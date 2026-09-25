import { Download } from "lucide-react";
import { leadMagnetContent } from "@/lib/content";

/* ─── 리드 마그넷 섹션 ─────────────────────────────────────────
   PDF 체크리스트 무료 제공으로 연락처 확보
   [대표님 확인] 실제 PDF 파일을 public/downloads 에 추가해야 동작함
──────────────────────────────────────────────────────────── */
export default function LeadMagnetSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-[880px] mx-auto px-5 lg:px-10">
        <div className="border border-accent/30 bg-stone/60 px-8 py-12 lg:px-16 lg:py-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <p className="label-en mb-3 text-accent">Free Checklist</p>
            <h3 className="font-serif text-xl lg:text-2xl font-light text-ink mb-3 tracking-wide">
              {leadMagnetContent.title}
            </h3>
            <p className="font-sans text-sm text-concrete leading-relaxed">
              {leadMagnetContent.description}
            </p>
          </div>
          <a
            href={leadMagnetContent.pdfPath}
            download
            className="inline-flex items-center gap-2 px-7 py-4 bg-ink text-white font-sans text-sm font-medium tracking-wide hover:bg-ink/90 transition-colors whitespace-nowrap"
          >
            <Download size={16} />
            {leadMagnetContent.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
