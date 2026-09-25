"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/content";

/* ─── 모바일 하단 고정 CTA 바 ─────────────────────────────────
   CLAUDE.md 4-4장: 지방 건축주는 전화 문의 비중이 높음
   [전화하기] [무료 부지검토] 2버튼 고정 표시
   - lg 이상(데스크톱)에서는 숨김
──────────────────────────────────────────────────────────── */
export default function MobileBottomCTA() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 shadow-[0_-2px_16px_rgba(0,0,0,0.12)]">
      {/* 전화하기 */}
      <a
        href={`tel:${siteConfig.phone}`}
        className="flex-1 flex items-center justify-center gap-2 bg-steel text-white font-sans text-sm font-medium tracking-wide active:bg-steel/90 transition-colors"
        aria-label={`전화 상담: ${siteConfig.phone}`}
      >
        <Phone size={16} />
        전화 상담
      </a>

      {/* 세로 구분선 */}
      <div className="w-px bg-white/20" />

      {/* 무료 부지검토 */}
      <Link
        href="/contact"
        className="flex-1 flex items-center justify-center bg-accent text-white font-sans text-sm font-medium tracking-wide active:bg-accent/90 transition-colors"
      >
        무료 부지검토 신청
      </Link>
    </div>
  );
}
