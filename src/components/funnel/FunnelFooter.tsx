import { siteConfig } from "@/lib/content";

/* ─── 퍼널 전용 최소 푸터 ────────────────────────────────────
   메뉴 없이 법적 표기(상호·대표자·사업자등록번호·주소·연락처)만
   남긴다. 네이버 광고 검수 기준을 충족하기 위한 최소 정보.
──────────────────────────────────────────────────────────── */
export default function FunnelFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone border-t border-concrete/15">
      <div className="max-w-[720px] mx-auto px-5 lg:px-10 py-8 text-center">
        <p className="font-sans text-xs text-concrete leading-relaxed">
          {siteConfig.name} · 대표 {siteConfig.ceo} · 사업자등록번호 {siteConfig.businessNumber}
          <br />
          {siteConfig.address} · {siteConfig.phone}
        </p>
        <p className="mt-3 font-sans text-[11px] text-concrete/70">
          © {currentYear} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
