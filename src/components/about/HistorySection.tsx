import { aboutContent } from "@/lib/content";

/* ─── 연혁 섹션 ─────────────────────────────────────────────── */
export default function HistorySection() {
  return (
    <section className="bg-ink py-20 lg:py-32">
      <div className="max-w-[720px] mx-auto px-5 lg:px-10">
        <p className="label-en mb-4 text-white/40 text-center">History</p>
        <h2 className="font-serif text-2xl lg:text-4xl font-light text-white text-center tracking-wide mb-14 lg:mb-20">
          걸어온 길
        </h2>

        <div className="flex flex-col">
          {aboutContent.history.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-6 lg:gap-10 py-5 border-b border-white/10 last:border-b-0"
            >
              <p className="font-serif text-lg lg:text-xl font-light text-accent w-20 shrink-0">
                {item.year}
              </p>
              <p className="font-sans text-sm lg:text-base text-white/80 leading-relaxed">
                {item.event}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
