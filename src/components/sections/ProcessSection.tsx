import { processContent } from "@/lib/content";

/* ─── 프로세스 섹션 ───────────────────────────────────────────
   무료 부지검토부터 사용승인까지 5단계 진행 과정
──────────────────────────────────────────────────────────── */
export default function ProcessSection() {
  return (
    <section className="bg-stone py-20 lg:py-40">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-10">
        <h2 className="font-serif text-2xl lg:text-4xl font-light text-ink text-center tracking-wide mb-14 lg:mb-20">
          {processContent.title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
          {processContent.steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* 데스크톱 연결선 */}
              {i < processContent.steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-1/2 w-full h-px bg-concrete/25" />
              )}

              <div className="relative z-10 mb-5 flex items-center justify-center w-12 h-12 rounded-full bg-ink text-white font-serif text-sm">
                {step.number}
              </div>

              {step.badge && (
                <span className="mb-2 inline-block px-2.5 py-0.5 text-[11px] font-sans font-medium text-accent border border-accent/40 rounded-full">
                  {step.badge}
                </span>
              )}

              <h3 className="font-sans text-base font-medium text-ink mb-2">{step.title}</h3>
              <p className="font-sans text-sm text-concrete leading-relaxed max-w-[220px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
