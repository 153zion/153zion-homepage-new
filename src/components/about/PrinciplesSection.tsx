import { aboutContent } from "@/lib/content";

/* ─── 원칙 섹션 ─────────────────────────────────────────────── */
export default function PrinciplesSection() {
  return (
    <section className="bg-stone py-20 lg:py-32">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-10">
        <p className="label-en mb-4 text-concrete text-center">Principles</p>
        <h2 className="font-serif text-2xl lg:text-4xl font-light text-ink text-center tracking-wide mb-14 lg:mb-20">
          저희가 지키는 원칙
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {aboutContent.principles.map((principle, i) => (
            <div key={principle.title} className="bg-white border border-concrete/15 px-6 py-10">
              <p className="font-serif text-3xl font-light text-accent mb-5">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-sans text-base font-medium text-ink mb-2">
                {principle.title}
              </h3>
              <p className="font-sans text-sm text-concrete leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
