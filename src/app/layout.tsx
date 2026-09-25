import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomCTA from "@/components/layout/MobileBottomCTA";

/* ─── 폰트 설정 ───────────────────────────────────────────────
   - Pretendard: globals.css에서 CDN으로 로드 (font-sans)
   - Noto Serif KR: next/font/google으로 자체 호스팅 (font-serif)
──────────────────────────────────────────────────────────── */
const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-noto-serif-kr",
  display: "swap",
  preload: false, // 한국어 폰트는 필요 시 로드
});

/* ─── 사이트 메타데이터 ──────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "(주)153시온건축사사무소 | 안성 건축설계·감리·인허가",
    template: "%s | (주)153시온건축사사무소",
  },
  description:
    "경기도 안성에서 공장·창고·교회·주택 건축설계, 감리, 인허가, 사용승인 업무대행을 전문으로 합니다. 짓기 전에, 막히지 않게.",
  keywords: [
    "안성 건축사무소",
    "안성 공장 설계",
    "안성 창고 설계",
    "경기 남부 건축사",
    "교회 건축설계",
    "공장 인허가",
    "건축감리",
    "사용승인 업무대행",
    "모듈러하우스 설계",
    "153시온건축사사무소",
  ],
  authors: [{ name: "(주)153시온건축사사무소" }],
  creator: "(주)153시온건축사사무소",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "(주)153시온건축사사무소",
    title: "(주)153시온건축사사무소 | 안성 건축설계·감리·인허가",
    description:
      "경기도 안성에서 공장·창고·교회·주택 건축설계, 감리, 인허가, 사용승인 업무대행을 전문으로 합니다.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSerifKr.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-ink">
        {/* ── 헤더 (투명 → 스크롤 시 블러 전환) ── */}
        <Header />

        {/* ── 페이지 콘텐츠 ── */}
        <main className="flex-1">{children}</main>

        {/* ── 푸터 ── */}
        <Footer />

        {/* ── 모바일 하단 고정 CTA 바 ── */}
        <MobileBottomCTA />
      </body>
    </html>
  );
}
