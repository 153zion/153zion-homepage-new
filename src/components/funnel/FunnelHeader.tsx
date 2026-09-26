import { siteConfig } from "@/lib/content";

/* ─── 퍼널 전용 최소 헤더 ────────────────────────────────────
   마스터 프롬프트 5장: "메뉴·외부 링크 최소화. 홈페이지 전체
   메뉴를 붙이지 않는다." 로고와 전화번호만 노출한다.
──────────────────────────────────────────────────────────── */
export default function FunnelHeader() {
  return (
    <header className="bg-ink">
      <div className="max-w-[720px] mx-auto px-5 lg:px-10 flex items-center justify-between h-14">
        <span className="font-serif text-sm lg:text-base font-light text-white tracking-wide">
          (주)153시온건축사사무소
        </span>
        <a
          href={`tel:${siteConfig.phone}`}
          className="font-sans text-xs lg:text-sm text-white/70 hover:text-white transition-colors"
        >
          {siteConfig.phone}
        </a>
      </div>
    </header>
  );
}
