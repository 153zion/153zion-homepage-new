"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/content";

/* ─── 상단 GNB 헤더 ───────────────────────────────────────────
   - 기본: 투명 배경
   - 스크롤 시: 반투명 블러 배경으로 전환
   - 모바일: 풀스크린 오버레이 메뉴
──────────────────────────────────────────────────────────── */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* 스크롤 감지 */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* 드롭다운 외부 클릭 닫기 */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBoardOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* 모바일 메뉴 열릴 때 스크롤 잠금 */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { href: "/about", label: "기업소개" },
    { href: "/location", label: "오시는 길" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-concrete/10 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 lg:px-10 flex items-center justify-between h-16 lg:h-20">
          {/* ── 로고 ── */}
          <Link
            href="/"
            className="flex flex-col leading-none"
            onClick={() => setMobileOpen(false)}
          >
            <span
              className={`font-sans text-[11px] font-medium tracking-[0.15em] uppercase transition-colors ${
                scrolled ? "text-concrete" : "text-white/70"
              }`}
            >
              Architecture · Supervision · Permit
            </span>
            <span
              className={`font-serif text-base lg:text-lg font-light tracking-wide transition-colors ${
                scrolled ? "text-ink" : "text-white"
              }`}
            >
              (주)153시온건축사사무소
            </span>
          </Link>

          {/* ── 데스크톱 GNB ── */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm font-medium transition-colors hover:text-accent ${
                  scrolled ? "text-ink" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* 게시판 드롭다운 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setBoardOpen(!boardOpen)}
                className={`flex items-center gap-1 font-sans text-sm font-medium transition-colors hover:text-accent ${
                  scrolled ? "text-ink" : "text-white"
                }`}
              >
                게시판
                <ChevronDown
                  size={14}
                  className={`transition-transform ${boardOpen ? "rotate-180" : ""}`}
                />
              </button>
              {boardOpen && (
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white border border-concrete/20 shadow-lg py-2 min-w-[140px] rounded-sm">
                  <Link
                    href="/board"
                    className="block px-5 py-2.5 text-sm text-ink hover:text-accent hover:bg-stone transition-colors"
                    onClick={() => setBoardOpen(false)}
                  >
                    건축 소식
                  </Link>
                  <Link
                    href="/qna"
                    className="block px-5 py-2.5 text-sm text-ink hover:text-accent hover:bg-stone transition-colors"
                    onClick={() => setBoardOpen(false)}
                  >
                    Q&amp;A
                  </Link>
                </div>
              )}
            </div>

            {/* CTA 버튼 */}
            <Link
              href="/contact"
              className="ml-4 inline-flex items-center px-5 py-2.5 bg-accent text-white font-sans text-sm font-medium tracking-wide hover:bg-accent/90 transition-colors"
            >
              무료 부지검토 신청
            </Link>
          </nav>

          {/* ── 모바일 햄버거 ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 transition-colors ${
              scrolled ? "text-ink" : "text-white"
            }`}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* ── 모바일 풀스크린 메뉴 ── */}
      <div
        className={`fixed inset-0 z-40 bg-ink flex flex-col justify-center items-center transition-all duration-500 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-10 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-serif text-3xl font-light text-white hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/board"
            onClick={() => setMobileOpen(false)}
            className="font-serif text-3xl font-light text-white hover:text-accent transition-colors"
          >
            건축 소식
          </Link>
          <Link
            href="/qna"
            onClick={() => setMobileOpen(false)}
            className="font-serif text-3xl font-light text-white hover:text-accent transition-colors"
          >
            Q&amp;A
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="mt-4 px-8 py-4 bg-accent text-white font-sans text-base font-medium tracking-wide"
          >
            무료 부지검토 신청
          </Link>
          <a
            href={`tel:${siteConfig.phone}`}
            className="font-sans text-lg text-white/60 hover:text-white transition-colors"
          >
            {siteConfig.phone}
          </a>
        </nav>
      </div>
    </>
  );
}
