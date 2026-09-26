"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { heroContent } from "@/lib/content";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

/* ─── 메인 히어로 섹션 ─────────────────────────────────────────
   - 배경 이미지 슬라이드쇼 (자동 크로스페이드)
   - 헤드라인 + 서브헤드라인 + CTA 2개
──────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroContent.slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink">
      {/* ── 배경 슬라이드쇼 ── */}
      <div className="absolute inset-0">
        {heroContent.slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {slide.src.startsWith("/images/placeholder/") ? (
              <PlaceholderImage alt={slide.alt} className="w-full h-full" />
            ) : (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                className="object-cover"
              />
            )}
          </div>
        ))}
        {/* 가독성 + 브랜드 컬러를 위한 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-indigo-900/70 to-purple-900/60" />
        <div className="absolute -top-32 -right-32 w-[36rem] h-[36rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] rounded-full bg-indigo-400/15 blur-3xl" />
      </div>

      {/* ── 콘텐츠 ── */}
      <div className="relative z-10 text-center text-white px-5">
        <p className="label-en mb-6 text-white/70">{heroContent.label}</p>
        <h1 className="font-serif text-4xl lg:text-7xl font-light tracking-wide leading-tight mb-6 whitespace-pre-line">
          {heroContent.headline}
        </h1>
        <p className="font-sans text-white/70 text-base lg:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          {heroContent.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={heroContent.ctaPrimary.href}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-900 font-sans text-sm font-semibold tracking-wide rounded-full hover:bg-white/90 transition-colors w-full sm:w-auto shadow-lg shadow-indigo-950/30"
          >
            {heroContent.ctaPrimary.label}
          </Link>
          <a
            href={heroContent.ctaSecondary.href}
            className="inline-flex items-center justify-center px-8 py-4 border border-white/40 text-white font-sans text-sm font-medium tracking-wide rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto"
          >
            {heroContent.ctaSecondary.label}
          </a>
        </div>
      </div>

      {/* ── 슬라이드 인디케이터 ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroContent.slides.map((slide, i) => (
          <button
            key={slide.src}
            onClick={() => setActiveSlide(i)}
            aria-label={`${i + 1}번 슬라이드로 이동`}
            className={`h-1.5 rounded-full transition-all ${
              i === activeSlide ? "w-8 bg-accent" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
