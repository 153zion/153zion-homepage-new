/* ─── ERP 전용 레이아웃 ──────────────────────────────────────
   공개 홈페이지의 Header/Footer 를 붙이지 않습니다.
   사내 업무 화면이라 메뉴가 아니라 일이 먼저 보여야 합니다.
──────────────────────────────────────────────────────────── */
export default function ErpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
