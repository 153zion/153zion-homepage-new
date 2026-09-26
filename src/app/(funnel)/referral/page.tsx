import type { Metadata } from "next";
import { referralContent } from "@/lib/content";
import ReferralForm from "@/components/funnel/ReferralForm";

export const metadata: Metadata = {
  title: "소개하기",
  description: "공장·창고를 계획 중인 분을 소개해주시면 계약금액의 3%를 사례비로 드립니다.",
};

/* ─── ⑥ 소개 페이지 /referral ─────────────────────────────────
   funnel/research/10_follow-up.md 기준. 단 하나의 행동: 소개하기.
──────────────────────────────────────────────────────────── */
export default function ReferralPage() {
  return (
    <>
      {/* ── 소개 혜택 ── */}
      <section className="bg-ink text-white py-16 lg:py-24">
        <div className="max-w-[560px] mx-auto px-5 lg:px-10 text-center">
          <p className="label-en mb-4 text-white/50">Referral</p>
          <h1 className="font-serif text-3xl lg:text-4xl font-light tracking-wide mb-4">
            {referralContent.headline}
          </h1>
          <p className="font-sans text-base lg:text-lg text-accent mb-8">
            {referralContent.subheadline}
          </p>
          <p className="font-sans text-sm lg:text-base text-white/70 leading-relaxed">
            {referralContent.body}
          </p>
          <p className="mt-5 font-sans text-xs text-white/40">{referralContent.rewardNote}</p>
        </div>
      </section>

      {/* ── 소개 폼 ── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[560px] mx-auto px-5 lg:px-10">
          <h2 className="font-serif text-xl lg:text-2xl font-light text-ink tracking-wide mb-8 text-center">
            {referralContent.formTitle}
          </h2>
          <ReferralForm />
        </div>
      </section>
    </>
  );
}
