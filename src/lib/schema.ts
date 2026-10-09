import { site, clinicId, abs, fullAddress } from "@/config/site";
import { namedDoctors, doctorById } from "@/content/doctors";
import { treatments } from "@/content/treatments";
import type { Faqs, Post, Treatment } from "@/content/types";

type Json = Record<string, unknown>;

export const doctorId = (id: string) => `${site.url}/doctors/#${id}`;

const address = {
  "@type": "PostalAddress",
  streetAddress: site.address.street,
  addressLocality: site.address.locality,
  addressRegion: site.address.region,
  addressCountry: site.address.country,
};

/** 다른 페이지에서 병원을 가리킬 때 (이름까지 넣어 페이지 단독으로도 해석되게) */
export const clinicRef = { "@type": site.schemaType, "@id": clinicId, name: site.name, url: `${site.url}/` };

/** 병원(MedicalClinic / Dentist): 이름·주소·전화·진료시간 */
export function clinic(): Json {
  return {
    "@context": "https://schema.org",
    "@type": site.schemaType,
    "@id": clinicId,
    name: site.name,
    alternateName: [site.legalName, `성서 ${site.name}`],
    url: `${site.url}/`,
    telephone: site.phone.international,
    address,
    hasMap: site.maps.naver,
    sameAs: [site.maps.naver],
    image: [abs("/img/team-hero.jpg"), abs("/img/treatment-room.jpg")],
    logo: abs("/img/logo-mark.png"),
    ...(site.schemaType === "MedicalClinic" ? { medicalSpecialty: site.specialty } : {}),
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.schemaDays,
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    availableService: treatments.map((t) => ({ "@type": t.about.type, name: t.about.name, url: abs(`/treatments/${t.slug}/`) })),
    amenityFeature: [{ "@type": "LocationFeatureSpecification", name: site.parking, value: true }],
    founder: { "@id": doctorId(namedDoctors[0].id) },
    employee: namedDoctors.map((d) => ({ "@id": doctorId(d.id) })),
  };
}

/** 의사(Physician) + 소속 병원(worksFor) */
export function physicians(): Json[] {
  return namedDoctors.map((d) => ({
    "@context": "https://schema.org",
    "@type": ["Person", "Physician"],
    "@id": doctorId(d.id),
    name: d.name,
    jobTitle: d.role === "한의사" ? "한의사" : `${d.role} · 한의사`,
    image: abs(d.photo.src),
    url: abs(`/doctors/#${d.id}`),
    worksFor: clinicRef,
    workLocation: { "@type": "Place", name: site.name, address: fullAddress },
  }));
}

function personRef(name: string): Json {
  const d = doctorById(name);
  return d
    ? { "@type": ["Person", "Physician"], "@id": doctorId(d.id), name: d.name, worksFor: clinicRef }
    : { "@type": "Person", name, worksFor: clinicRef };
}

export function breadcrumb(items: [name: string, path: string][]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
  };
}

export function faqPage(faqs: Faqs): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function treatmentPage(t: Treatment, modified: Date): Json {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: t.title,
    description: t.description,
    url: abs(`/treatments/${t.slug}/`),
    inLanguage: "ko-KR",
    dateModified: modified.toISOString(),
    about: { "@type": t.about.type, name: t.about.name },
    image: abs(t.image.src),
    publisher: clinicRef,
  };
}

export function article(p: Post, modified: Date): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    articleSection: p.category,
    inLanguage: "ko-KR",
    datePublished: p.published,
    dateModified: modified.toISOString(),
    mainEntityOfPage: abs(`/blog/${p.slug}/`),
    image: abs("/img/og-image.jpg"),
    author: p.author ? personRef(p.author) : clinicRef,
    ...(p.reviewedBy ? { reviewedBy: personRef(p.reviewedBy) } : {}),
    publisher: { ...clinicRef, logo: { "@type": "ImageObject", url: abs("/img/logo-mark.png") } },
  };
}

export function website(): Json {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": `${site.url}/#website`, url: `${site.url}/`, name: site.name, inLanguage: "ko-KR", publisher: { "@id": clinicId } };
}
