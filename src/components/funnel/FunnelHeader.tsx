import Link from "next/link";
import { siteConfig } from "@/lib/content";

/* ─── 퍼널 전용 최소 헤더 ────────────────────────────────────
   마스터 프롬프트 5장: "메뉴·외부 링크 최소화. 홈페이지 전체
   메뉴를 붙이지 않는다." 로고·전화번호 외에 홈페이지로 돌아가는
   버튼 하나만 예외로 둔다 (대표 요청).
──────────────────────────────────────────────────────────── */
export default function FunnelHeader() {
  return (
    <header className="bg-ink">
      <div className="max-w-[720px] mx-auto px-5 lg:px-10 flex items-center justify-between h-14 gap-3">
        <Link
          href="/"
          className="font-serif text-sm lg:text-base font-light text-white tracking-wide hover:text-white/80 transition-colors"
        >
          (주)153시온건축사사무소
        </Link>
        <div className="flex items-center gap-3 lg:gap-5 shrink-0">
          <Link
            href="/"
            className="font-sans text-xs lg:text-sm text-white/70 hover:text-white border border-white/25 hover:border-white/50 rounded-full px-3 py-1.5 transition-colors"
          >
            홈페이지
          </Link>
          <a
            href={`tel:${siteConfig.phone}`}
            className="font-sans text-xs lg:text-sm text-white/70 hover:text-white transition-colors"
          >
            {siteConfig.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
