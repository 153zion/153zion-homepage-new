import Link from "next/link";
import { Check } from "lucide-react";
import { processContent, checklistContent } from "@/lib/content";

/* ─── 프로세스 섹션 ───────────────────────────────────────────
   무료 부지검토부터 사용승인까지 5단계 진행 과정. 왼쪽은 세로
   단계 목록, 오른쪽은 실제 /checklist 페이지를 미리보기 형태로
   보여주는 브라우저 목업 카드(클릭하면 실제 페이지로 이동).
──────────────────────────────────────────────────────────── */
export default function ProcessSection() {
  return (
    <section className="bg-stone py-20 lg:py-40">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-10">
        <h2 className="font-serif text-2xl lg:text-4xl font-light text-ink text-center tracking-wide mb-14 lg:mb-20">
          {processContent.title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-14 lg:gap-16 items-center">
          {/* ── 왼쪽: 세로 단계 목록 ── */}
          <div className="relative flex flex-col gap-10">
            <div className="absolute left-5 top-5 bottom-5 w-px bg-concrete/20 hidden sm:block" />
            {processContent.steps.map((step) => (
              <div key={step.number} className="relative flex gap-5">
                <div className="relative z-10 shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-ink text-white font-serif text-sm">
                  {step.number}
                </div>
                <div className="pt-1.5">
                  {step.badge && (
                    <span className="mb-2 inline-block px-2.5 py-0.5 text-[11px] font-sans font-medium text-accent border border-accent/40 rounded-full">
                      {step.badge}
                    </span>
                  )}
                  <h3 className="font-sans text-base font-medium text-ink mb-1.5">{step.title}</h3>
                  <p className="font-sans text-sm text-concrete leading-relaxed max-w-[360px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── 오른쪽: 실제 체크리스트 페이지 미리보기 카드 ── */}
          <Link
            href="/checklist"
            className="block bg-white rounded-2xl border border-concrete/15 shadow-xl overflow-hidden hover:border-accent/40 hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-1.5 px-4 py-3 bg-stone border-b border-concrete/10">
              <span className="w-2.5 h-2.5 rounded-full bg-concrete/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-concrete/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-concrete/30" />
              <span className="ml-3 font-sans text-[11px] text-concrete/70 truncate">
                153zion-homepage.pages.dev/checklist
              </span>
            </div>
            <div className="p-6 lg:p-7">
              <p className="font-serif text-lg font-light text-ink mb-4">
                {checklistContent.formTitle}
              </p>
              <ul className="flex flex-col gap-2.5 mb-6">
                {checklistContent.items.slice(0, 5).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent mt-0.5">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span className="font-sans text-xs text-ink/80 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center justify-center w-full px-6 py-3 bg-accent text-white font-sans text-sm font-medium tracking-wide rounded-sm">
                {checklistContent.ctaLabel}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
