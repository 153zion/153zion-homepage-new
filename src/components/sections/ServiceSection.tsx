import Image from "next/image";
import Link from "next/link";
import { servicesContent } from "@/lib/content";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

/* ─── 분야(서비스) 섹션 ────────────────────────────────────────
   6개 전문 분야를 이미지 카드 그리드로 소개
──────────────────────────────────────────────────────────── */
export default function ServiceSection() {
  return (
    <section className="bg-white py-20 lg:py-40">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
        <h2 className="font-serif text-2xl lg:text-4xl font-light text-ink text-center tracking-wide mb-14 lg:mb-20">
          {servicesContent.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {servicesContent.items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group block border border-concrete/15 hover:border-accent/50 transition-colors"
            >
              {item.image.startsWith("/images/placeholder/") ? (
                <PlaceholderImage alt={item.alt} className="w-full aspect-[4/3]" />
              ) : (
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-serif text-xl font-light text-ink mb-2 tracking-wide">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-concrete leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
