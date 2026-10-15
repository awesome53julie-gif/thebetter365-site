import { post as trafficGuide } from "./traffic-accident-insurance-guide";
import { post as weekendGuide } from "./weekend-night-clinic-guide";
import { post as chunaInsurance } from "./chuna-health-insurance";

/** 최신 글이 먼저 */
export const posts = [chunaInsurance, trafficGuide, weekendGuide].sort((a, b) => b.published.localeCompare(a.published));
export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
