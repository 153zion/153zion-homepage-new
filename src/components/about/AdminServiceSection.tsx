import { FileSearch, Ruler, Receipt, ShieldCheck, MapPin } from "lucide-react";
import { adminServiceContent } from "@/lib/content";

const ICONS = [FileSearch, Ruler, Receipt, ShieldCheck, MapPin];

/* ─── 인허가·행정 절차 무료 서비스 섹션 ─────────────────────── */
export default function AdminServiceSection() {
  return (
    <section className="bg-stone py-20 lg:py-32">
      <div className="max-w-[880px] mx-auto px-5 lg:px-10">
        <p className="label-en mb-4 text-concrete text-center">Free Admin Support</p>
        <h2 className="font-serif text-2xl lg:text-4xl font-light text-ink text-center tracking-wide mb-5">
          {adminServiceContent.title}
        </h2>
        <p className="font-sans text-sm lg:text-base text-concrete text-center leading-relaxed max-w-[560px] mx-auto mb-14 lg:mb-16">
          {adminServiceContent.subtitle}
        </p>

        <div className="flex flex-col gap-3">
          {adminServiceContent.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={item.title}
                className="flex items-start gap-5 bg-white border border-concrete/15 px-6 py-5 lg:px-7 lg:py-6"
              >
                <div className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-accent/15 text-accent">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="label-en mb-1 text-concrete">{item.agency}</p>
                  <h3 className="font-sans text-base font-medium text-ink mb-1.5">{item.title}</h3>
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
