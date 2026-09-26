import type { Metadata } from "next";
import { siteReviewContent, storyContent, faqItems } from "@/lib/content";
import SiteReviewForm from "@/components/funnel/SiteReviewForm";

export const metadata: Metadata = {
  title: "무료 부지 검토 신청",
  description: "계약 전에 토지이용계획, 진입로·지목, 개발행위허가 필요 여부를 무료로 검토해드립니다.",
};

/* ─── ③ 무료 부지 검토 신청 페이지 /site-review ───────────────
   funnel/research/07(제안 스택), 11(청사진) 기준. 단 하나의 행동:
   무료 부지 검토 신청.
──────────────────────────────────────────────────────────── */
export default function SiteReviewPage() {
  return (
    <>
      {/* ── 빅 도미노 헤드라인 ── */}
      <section className="bg-ink text-white py-16 lg:py-24">
        <div className="max-w-[640px] mx-auto px-5 lg:px-10 text-center">
          <p className="label-en mb-4 text-white/50">Free Site Review</p>
          <h1 className="font-serif text-3xl lg:text-4xl font-light tracking-wide mb-5">
            {siteReviewContent.headline}
          </h1>
          <p className="font-sans text-sm lg:text-base text-white/70 leading-relaxed">
            {siteReviewContent.subheadline}
          </p>
        </div>
      </section>

      {/* ── 제안 스택 ── */}
      <section className="bg-stone py-14 lg:py-20">
        <div className="max-w-[640px] mx-auto px-5 lg:px-10">
          <div className="flex flex-col gap-3">
            {siteReviewContent.offerStack.map((item, i) => (
              <div key={i} className="flex gap-4 bg-white border border-concrete/15 px-5 py-4">
                <span className="label-en text-accent shrink-0 w-24">{item.label}</span>
                <span className="font-sans text-sm text-ink leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center font-sans text-xs text-concrete">
            {siteReviewContent.scarcityNote}
          </p>
        </div>
      </section>

      {/* ── 익명 사례 ── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-[560px] mx-auto px-5 lg:px-10">
          <p className="label-en mb-5 text-concrete text-center">Case</p>
          <p className="font-sans text-sm lg:text-base text-ink/85 leading-loose whitespace-pre-line mb-5">
            {storyContent.story}
          </p>
          <p className="font-serif text-base text-accent text-center">{storyContent.closing}</p>
        </div>
      </section>

      {/* ── 진행 절차 ── */}
      <section className="bg-stone py-16 lg:py-20">
        <div className="max-w-[640px] mx-auto px-5 lg:px-10">
          <p className="label-en mb-8 text-concrete text-center">Process</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {siteReviewContent.process.map((p) => (
              <div key={p.step} className="text-center">
                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent font-serif">
                  {p.step}
                </div>
                <p className="font-sans text-sm font-medium text-ink mb-1">{p.title}</p>
                <p className="font-sans text-xs text-concrete leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-[640px] mx-auto px-5 lg:px-10">
          <p className="label-en mb-8 text-concrete text-center">FAQ</p>
          <div className="flex flex-col gap-6">
            {faqItems.map((item, i) => (
              <div key={i} className="border-b border-concrete/15 pb-6 last:border-none">
                <p className="font-sans text-sm font-medium text-ink mb-2">Q. {item.question}</p>
                <p className="font-sans text-sm text-concrete leading-relaxed">A. {item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 신청 폼 ── */}
      <section className="bg-stone py-16 lg:py-24">
        <div className="max-w-[560px] mx-auto px-5 lg:px-10">
          <h2 className="font-serif text-xl lg:text-2xl font-light text-ink tracking-wide mb-8 text-center">
            {siteReviewContent.formTitle}
          </h2>
          <SiteReviewForm />
        </div>
      </section>
    </>
  );
}
