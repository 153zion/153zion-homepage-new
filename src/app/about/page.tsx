import type { Metadata } from "next";
import Link from "next/link";
import CeoSection from "@/components/about/CeoSection";
import PrinciplesSection from "@/components/about/PrinciplesSection";
import ServicesDetailSection from "@/components/about/ServicesDetailSection";
import HistorySection from "@/components/about/HistorySection";
import { aboutContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "기업소개",
  description:
    "(주)153시온건축사사무소 대표 건축사 김승호와 사무소를 소개합니다. 크게 보이는 것보다 끝까지 책임지는 실무 전문가입니다.",
};

/* ─── 기업소개 /about ──────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="pt-16 lg:pt-20">
      <section className="min-h-[60vh] bg-stone flex items-center justify-center">
        <div className="text-center px-5">
          <p className="label-en mb-4">About</p>
          <h1 className="font-serif text-3xl lg:text-5xl font-light text-ink tracking-wide whitespace-pre-line">
            {aboutContent.heroTitle}
          </h1>
        </div>
      </section>

      <CeoSection />
      <PrinciplesSection />
      <ServicesDetailSection />
      <HistorySection />

      {/* ── 페이지 하단 CTA ── */}
      <section className="bg-stone py-16 lg:py-24 text-center">
        <p className="font-serif text-xl lg:text-2xl font-light text-ink tracking-wide mb-6">
          지금 계획 중인 건축이 있으신가요?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-sans text-sm font-medium tracking-wide hover:bg-accent/90 transition-colors"
        >
          무료 부지검토 신청하기
        </Link>
      </section>
    </div>
  );
}
