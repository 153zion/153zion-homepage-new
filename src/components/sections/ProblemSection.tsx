import { problemContent } from "@/lib/content";

/* ─── 문제 제기 섹션 ───────────────────────────────────────────
   건축주가 공감할 만한 걱정거리 4개를 카드로 제시
──────────────────────────────────────────────────────────── */
export default function ProblemSection() {
  return (
    <section className="bg-stone py-20 lg:py-40">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-10">
        <h2 className="font-serif text-2xl lg:text-4xl font-light text-ink text-center tracking-wide mb-14 lg:mb-20">
          {problemContent.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-14 lg:mb-16">
          {problemContent.cards.map((card, i) => (
            <div
              key={i}
              className="bg-white border border-concrete/15 px-6 py-10 flex flex-col items-center text-center gap-4"
            >
              <span className="text-3xl" aria-hidden>
                {card.icon}
              </span>
              <p className="font-sans text-sm lg:text-base text-ink leading-relaxed">
                {card.text}
              </p>
            </div>
          ))}
        </div>

        <p className="font-serif text-lg lg:text-2xl font-light text-ink text-center tracking-wide">
          {problemContent.closing}
        </p>
      </div>
    </section>
  );
}
