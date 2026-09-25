import Link from "next/link";
import { siteConfig } from "@/lib/content";

/* ─── 사이트 푸터 ─────────────────────────────────────────────
   - 회사 정보, 메뉴 링크, 마지막 CTA 한 줄
──────────────────────────────────────────────────────────── */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/70">
      {/* ── 마지막 CTA 한 줄 ── */}
      <div className="border-b border-white/10 py-8 text-center">
        <p className="font-serif text-xl lg:text-2xl font-light text-white tracking-wide">
          전화 한 통이면 시작됩니다.
        </p>
        <a
          href={`tel:${siteConfig.phone}`}
          className="mt-2 inline-block font-sans text-2xl lg:text-3xl font-light text-accent hover:text-accent/80 transition-colors tracking-widest"
        >
          {siteConfig.phone}
        </a>
      </div>

      {/* ── 본문 ── */}
      <div className="max-w-[1440px] mx-auto px-5 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* 회사 정보 */}
          <div className="lg:col-span-2">
            <p className="font-serif text-lg font-light text-white mb-1">
              (주)153시온건축사사무소
            </p>
            <p className="label-en text-xs mb-6 text-concrete">
              153 Zion Architecture Office
            </p>
            <dl className="space-y-2 text-sm font-sans">
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-concrete">대표</dt>
                <dd>{siteConfig.ceo}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-concrete">주소</dt>
                <dd>{siteConfig.address}</dd>
              </div>
              <div className="flex flex-wrap gap-x-4">
                <div className="flex gap-x-2">
                  <dt className="text-concrete">전화</dt>
                  <dd>
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="hover:text-white transition-colors"
                    >
                      {siteConfig.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-x-2">
                  <dt className="text-concrete">팩스</dt>
                  <dd>{siteConfig.fax}</dd>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-concrete">이메일</dt>
                <dd>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-concrete">사업자등록번호</dt>
                <dd>{siteConfig.businessNumber}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-concrete">법인등록번호</dt>
                <dd>{siteConfig.corporateNumber}</dd>
              </div>
            </dl>
          </div>

          {/* 바로가기 */}
          <div>
            <p className="label-en text-xs mb-5">Quick Links</p>
            <nav className="flex flex-col gap-3 text-sm font-sans">
              <Link href="/about" className="hover:text-white transition-colors">
                기업소개
              </Link>
              <Link href="/location" className="hover:text-white transition-colors">
                오시는 길
              </Link>
              <Link href="/board" className="hover:text-white transition-colors">
                건축 소식
              </Link>
              <Link href="/qna" className="hover:text-white transition-colors">
                Q&amp;A
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                문의하기
              </Link>
              <Link
                href="/contact"
                className="mt-2 text-accent hover:text-accent/80 transition-colors font-medium"
              >
                무료 부지검토 신청 →
              </Link>
            </nav>
          </div>
        </div>

        {/* ── 하단 법적 정보 ── */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col lg:flex-row gap-3 lg:items-center justify-between text-xs text-concrete">
          <p>
            © {currentYear} (주)153시온건축사사무소. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors">
              관리자
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
