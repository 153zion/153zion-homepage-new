import FunnelHeader from "@/components/funnel/FunnelHeader";
import FunnelFooter from "@/components/funnel/FunnelFooter";

/* ─── 퍼널 전용 레이아웃 ─────────────────────────────────────
   153시온_설계의뢰퍼널_마스터프롬프트.md 5장 "공통 요구사항":
   메뉴·외부 링크 최소화, 페이지마다 CTA 하나. 전체 사이트
   Header/Footer(MarketingLayout)를 붙이지 않는다.
──────────────────────────────────────────────────────────── */
export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FunnelHeader />
      <main className="flex-1">{children}</main>
      <FunnelFooter />
    </>
  );
}
