import type { Metadata } from "next";
import Link from "next/link";
import { checklistContent, checklistThanksContent } from "@/lib/content";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "자가진단표 확인",
  description: "자가진단표 확인 및 다음 단계 안내",
};

/* ─── ② 감사·브릿지 페이지 /checklist/thanks ─────────────────
   자료 전달 + 대표 에피파니 브리지 스토리 + 단 하나의 다음 행동
   (무료 부지 검토로 연결). funnel/research/05, 07, 08 기준.
──────────────────────────────────────────────────────────── */
export default function ChecklistThanksPage() {
  return (
    <>
      {/* ── 자료 전달 확인 ── */}
      <section className="bg-stone py-14 lg:py-20">
        <div className="max-w-[640px] mx-auto px-5 lg:px-10 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
            <Check size={22} />
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-light text-ink tracking-wide mb-4">
            {checklistThanksContent.title}
          </h1>
          <ul className="mt-6 flex flex-col gap-2 text-left mx-auto max-w-[420px]">
            {checklistContent.items.map((item, i) => (
              <li key={i} className="font-sans text-sm text-concrete leading-relaxed">
                {i + 1}. {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 대표 에피파니 브리지 스토리 ── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[560px] mx-auto px-5 lg:px-10">
          <p className="label-en mb-4 text-concrete text-center">CEO Message</p>
          <p className="font-sans text-sm lg:text-base text-ink/85 leading-loose whitespace-pre-line mb-8">
            {checklistThanksContent.epiphany}
          </p>
          <p className="font-serif text-base text-ink text-right">
            {checklistThanksContent.ceoSignoff}
          </p>
        </div>
      </section>

      {/* ── 다음 행동 (단일 CTA) ── */}
      <section className="bg-ink text-white py-16 lg:py-20">
        <div className="max-w-[560px] mx-auto px-5 lg:px-10 text-center">
          <h2 className="font-serif text-xl lg:text-2xl font-light tracking-wide mb-4">
            {checklistThanksContent.nextStepTitle}
          </h2>
          <p className="font-sans text-sm lg:text-base text-white/70 leading-relaxed mb-8">
            {checklistThanksContent.nextStepBody}
          </p>
          <Link
            href="/site-review"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-sans text-sm font-medium tracking-wide hover:bg-accent/90 transition-colors"
          >
            {checklistThanksContent.ctaLabel}
          </Link>
        </div>
      </section>
    </>
  );
}
