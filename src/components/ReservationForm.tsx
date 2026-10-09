"use client";

import { useState } from "react";
import { site } from "@/config/site";

/**
 * 최소 필드 예약 신청: 이름 · 연락처 · 개인정보 동의.
 * - JS가 없어도 일반 HTML 폼으로 제출됩니다 (site.reservation.endpoint 로 POST).
 * - JS가 있으면 페이지 이동 없이 제출하고 결과를 이 자리에 표시합니다.
 */
export function ReservationForm() {
  const endpoint = site.reservation.endpoint;
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!endpoint) return;
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch(endpoint, { method: "POST", body: new FormData(e.currentTarget), headers: { Accept: "application/json" } });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="form-result" role="status">
        예약 신청이 접수되었습니다. 남겨 주신 연락처로 연락드려 진료 시간을 확정하겠습니다.
      </p>
    );
  }

  return (
    <form className="reserve-form" action={endpoint || undefined} method="post" onSubmit={onSubmit}>
      <input type="hidden" name="_subject" value={`[${site.name}] 홈페이지 예약 신청`} />
      <div className="field">
        <label htmlFor="rsv-name">이름</label>
        <input id="rsv-name" name="name" type="text" autoComplete="name" required maxLength={30} />
      </div>
      <div className="field">
        <label htmlFor="rsv-phone">연락처</label>
        <input id="rsv-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="010-0000-0000" pattern="[0-9\-\s]{9,14}" />
      </div>
      <div className="consent">
        <input id="rsv-consent" name="consent" type="checkbox" value="동의" required />
        <label htmlFor="rsv-consent">
          개인정보 수집·이용에 동의합니다 <small>(필수)</small>
        </label>
      </div>
      <p className="consent-text">
        수집 항목: 이름, 연락처 · 목적: 진료 예약 안내 · 보유 기간: 예약 안내를 마친 뒤 지체 없이 파기 · 동의하지 않으실 수 있으며, 이 경우 전화로 예약해 주세요.
      </p>
      {endpoint ? (
        <button className="btn primary" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "보내는 중…" : "예약 신청하기"}
        </button>
      ) : (
        <>
          <button className="btn primary" type="submit" disabled>
            예약 신청하기
          </button>
          <p className="form-note">온라인 예약 신청은 준비 중입니다. 전화 {site.phone.display}로 예약해 주세요.</p>
        </>
      )}
      {state === "error" && (
        <p className="form-error" role="alert">
          신청을 보내지 못했습니다. 잠시 후 다시 시도하거나 전화 {site.phone.display}로 예약해 주세요.
        </p>
      )}
    </form>
  );
}
