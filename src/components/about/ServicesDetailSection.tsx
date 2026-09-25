import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { servicesContent } from "@/lib/content";

/* ─── 전문 분야 상세 섹션 ───────────────────────────────────── */
export default function ServicesDetailSection() {
  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="max-w-[880px] mx-auto px-5 lg:px-10">
        <p className="label-en mb-4 text-concrete text-center">Services</p>
        <h2 className="font-serif text-2xl lg:text-4xl font-light text-ink text-center tracking-wide mb-14 lg:mb-20">
          전문 분야
        </h2>

        <div className="flex flex-col divide-y divide-concrete/15 border-t border-b border-concrete/15">
          {servicesContent.items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex items-center justify-between gap-6 py-6 hover:bg-stone/60 transition-colors px-2"
            >
              <div>
                <p className="label-en mb-1.5 text-concrete">{item.label}</p>
                <h3 className="font-serif text-lg lg:text-xl font-light text-ink tracking-wide mb-1">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-concrete">{item.description}</p>
              </div>
              <ArrowRight
                size={20}
                className="shrink-0 text-concrete group-hover:text-accent group-hover:translate-x-1 transition-all"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
