import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import path from "node:path";

const cache = new Map<string, Date>();

/**
 * 파일의 실제 수정일.
 * - 커밋된 파일: 마지막 커밋 날짜 (배포 서버에서 다시 빌드해도 바뀌지 않음)
 * - 아직 커밋 안 된 수정이 있는 파일: 파일 저장 시각
 * 여러 파일을 넘기면 가장 최근 날짜를 돌려줍니다.
 */
export function lastModified(...files: string[]): Date {
  const dates = files.map((f) => {
    const cached = cache.get(f);
    if (cached) return cached;
    const abs = path.join(process.cwd(), f);
    let date: Date | null = null;
    try {
      const dirty = execFileSync("git", ["status", "--porcelain", "--", f], { encoding: "utf8" }).trim();
      if (!dirty) {
        const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", f], { encoding: "utf8" }).trim();
        if (iso) date = new Date(iso);
      }
    } catch {
      // git이 없는 환경이면 파일 시각을 씁니다
    }
    if (!date) {
      try {
        date = statSync(abs).mtime;
      } catch {
        date = new Date(0);
      }
    }
    cache.set(f, date);
    return date;
  });
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

/** 2026-10-09 형식 */
export const ymd = (d: Date) => d.toISOString().slice(0, 10);
/** 2026년 10월 9일 형식 */
export const koDate = (d: Date | string) => {
  const [y, m, day] = (typeof d === "string" ? d : ymd(d)).split("-");
  return `${y}년 ${Number(m)}월 ${Number(day)}일`;
};

/** 여러 페이지가 공통으로 기대는 파일 (병원 정보가 바뀌면 모든 페이지 수정일이 갱신됨) */
export const SHARED_SOURCES = ["src/config/site.ts"];
