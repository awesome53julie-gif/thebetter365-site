import { trafficAccident } from "./traffic-accident";
import { pain } from "./pain";
import { chuna } from "./chuna";
import { diet } from "./diet";
import { immunity } from "./immunity";

/** 메뉴·목록·사이트맵 순서 */
export const treatments = [trafficAccident, pain, chuna, diet, immunity];
export const treatmentBySlug = (slug: string) => treatments.find((t) => t.slug === slug);
