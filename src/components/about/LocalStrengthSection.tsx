import { Clock, MessageCircle, Network, HeartHandshake } from "lucide-react";
import { localStrengthContent } from "@/lib/content";

const ICONS = [Clock, MessageCircle, Network, HeartHandshake];

/* ─── 지역친화 4가지 강점 섹션 ──────────────────────────────── */
export default function LocalStrengthSection() {
  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-10">
        <p className="label-en mb-4 text-concrete text-center">Local Network</p>
        <h2 className="font-serif text-2xl lg:text-4xl font-light text-ink text-center tracking-wide mb-5">
          {localStrengthContent.title}
        </h2>
        <p className="font-sans text-sm lg:text-base text-concrete text-center leading-relaxed max-w-[640px] mx-auto mb-14 lg:mb-20">
          {localStrengthContent.subtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          {localStrengthContent.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={item.title}
                className="flex gap-5 bg-stone border border-concrete/15 px-6 py-7 lg:px-8 lg:py-8"
              >
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-accent/15 text-accent">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="label-en mb-1 text-accent">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-sans text-base font-medium text-ink mb-2">{item.title}</h3>
                  <p className="font-sans text-sm text-concrete leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
