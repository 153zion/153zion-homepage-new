import type { Metadata } from "next";
import { Check, Phone } from "lucide-react";
import { siteReviewThanksContent, siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "무료 부지 검토 신청 완료",
  description: "무료 부지 검토 신청이 접수되었습니다.",
};

/* ─── ④ 신청완료·상담예약 페이지 /site-review/thanks ──────────
   funnel/research/11_funnel-blueprint.md 페이지 ④. 일정 선택
   기능은 아직 없어, 준비물 안내 + 전화 상담 경로로 대체한다.
──────────────────────────────────────────────────────────── */
export default function SiteReviewThanksPage() {
  return (
    <section className="bg-stone py-20 lg:py-28">
      <div className="max-w-[560px] mx-auto px-5 lg:px-10 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
          <Check size={22} />
        </div>
        <h1 className="font-serif text-2xl lg:text-3xl font-light text-ink tracking-wide mb-4">
          {siteReviewThanksContent.title}
        </h1>
        <p className="font-sans text-sm lg:text-base text-concrete leading-relaxed mb-10">
          {siteReviewThanksContent.body}
        </p>

        <div className="bg-white border border-concrete/15 px-6 py-6 lg:px-8 lg:py-8 text-left mb-8">
          <p className="font-sans text-sm font-medium text-ink mb-4">
            {siteReviewThanksContent.prepTitle}
          </p>
          <ul className="flex flex-col gap-2">
            {siteReviewThanksContent.prepItems.map((item, i) => (
              <li key={i} className="font-sans text-sm text-concrete leading-relaxed">
                · {item}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={`tel:${siteConfig.phone}`}
          className="inline-flex items-center gap-2 font-sans text-sm text-ink hover:text-accent transition-colors border-b border-ink/20 hover:border-accent pb-0.5"
        >
          <Phone size={14} />
          {siteReviewThanksContent.phoneNote}: {siteConfig.phone}
        </a>
      </div>
    </section>
  );
}
