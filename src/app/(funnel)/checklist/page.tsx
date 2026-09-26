import type { Metadata } from "next";
import { Check } from "lucide-react";
import { checklistContent } from "@/lib/content";
import ChecklistForm from "@/components/funnel/ChecklistForm";

export const metadata: Metadata = {
  title: "공장부지 인허가 자가진단표",
  description: "계약 전에 꼭 확인해야 할 9가지, 무료 체크리스트로 받아보세요.",
};

/* ─── ① 리드마그넷 랜딩 /checklist ───────────────────────────
   funnel/research/07_hook-story-offer.md, 08_lead-magnet.md 기준.
   단 하나의 행동: 자가진단표 신청.
──────────────────────────────────────────────────────────── */
export default function ChecklistPage() {
  return (
    <>
      {/* ── 헤드라인 + 공감 ── */}
      <section className="bg-ink text-white py-16 lg:py-24">
        <div className="max-w-[640px] mx-auto px-5 lg:px-10 text-center">
          <p className="label-en mb-4 text-white/50">Free Checklist</p>
          <h1 className="font-serif text-3xl lg:text-4xl font-light tracking-wide mb-4">
            {checklistContent.headline}
          </h1>
          <p className="font-sans text-base lg:text-lg text-accent mb-8">
            {checklistContent.subheadline}
          </p>
          <p className="font-sans text-sm lg:text-base text-white/70 leading-relaxed">
            {checklistContent.intro}
          </p>
        </div>
      </section>

      {/* ── 자료 미리보기 ── */}
      <section className="bg-stone py-12 lg:py-16">
        <div className="max-w-[640px] mx-auto px-5 lg:px-10">
          <p className="label-en mb-5 text-concrete text-center">9 Checkpoints</p>
          <ul className="flex flex-col gap-3">
            {checklistContent.items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-white border border-concrete/15 px-5 py-4"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent mt-0.5">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="font-sans text-sm text-ink leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 신청 폼 ── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[560px] mx-auto px-5 lg:px-10">
          <h2 className="font-serif text-xl lg:text-2xl font-light text-ink tracking-wide mb-8 text-center">
            {checklistContent.formTitle}
          </h2>
          <ChecklistForm />
        </div>
      </section>
    </>
  );
}
