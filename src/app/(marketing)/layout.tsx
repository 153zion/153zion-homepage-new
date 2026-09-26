import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomCTA from "@/components/layout/MobileBottomCTA";

/* ─── 마케팅 사이트 레이아웃 ─────────────────────────────────
   전체 메뉴가 있는 일반 페이지(메인/기업소개/문의). 퍼널 페이지는
   (funnel) 그룹의 최소 레이아웃을 따로 쓴다.
──────────────────────────────────────────────────────────── */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomCTA />
    </>
  );
}
