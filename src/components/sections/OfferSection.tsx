import Link from "next/link";
import { Check } from "lucide-react";
import { offerContent } from "@/lib/content";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

/* ─── 메인 제안(CTA) 섹션 ──────────────────────────────────────
   페이지 하단 최종 전환 유도 섹션
──────────────────────────────────────────────────────────── */
export default function OfferSection() {
  return (
    <section className="relative bg-ink py-20 lg:py-40 overflow-hidden">
      <div className="absolute inset-0">
        <PlaceholderImage alt="대지 전경" className="w-full h-full opacity-40" />
        <div className="absolute inset-0 bg-ink/70" />
      </div>

      <div className="relative z-10 max-w-[760px] mx-auto px-5 lg:px-10 text-center">
        <h2 className="font-serif text-3xl lg:text-5xl font-light text-white tracking-wide mb-6 whitespace-pre-line">
          {offerContent.headline}
        </h2>
        <p className="font-sans text-white/70 text-base lg:text-lg leading-relaxed mb-10">
          {offerContent.subheadline}
        </p>

        <ul className="flex flex-col gap-3 mb-10 max-w-md mx-auto text-left">
          {offerContent.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3 font-sans text-sm text-white/85">
              <Check size={16} className="mt-0.5 shrink-0 text-accent" />
              {bullet}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link
            href={offerContent.ctaPrimary.href}
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-sans text-sm font-medium tracking-wide hover:bg-accent/90 transition-colors w-full sm:w-auto"
          >
            {offerContent.ctaPrimary.label}
          </Link>
          <a
            href={offerContent.ctaPhone.href}
            className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white font-sans text-sm font-medium tracking-wide hover:bg-white/10 transition-colors w-full sm:w-auto"
          >
            {offerContent.ctaPhone.label}
          </a>
        </div>

        {offerContent.scarcityNote && (
          <p className="font-sans text-xs text-white/40">{offerContent.scarcityNote}</p>
        )}
      </div>
    </section>
  );
}
