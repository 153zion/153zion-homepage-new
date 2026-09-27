import Image from "next/image";
import { modelingContent } from "@/lib/content";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

interface ModelingGroupData {
  title: string;
  subtitle: string;
  items: readonly { image: string; alt: string; caption: string }[];
}

/* ─── 3D 모델링 무료 서비스 갤러리 (외부/내부 공용) ──────────── */
function ModelingGroup({ group }: { group: ModelingGroupData }) {
  return (
    <div>
      <h3 className="font-serif text-xl lg:text-2xl font-light text-ink tracking-wide mb-3">
        {group.title}
      </h3>
      <p className="font-sans text-sm text-concrete leading-relaxed max-w-[640px] mb-8">
        {group.subtitle}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {group.items.map((item, i) => (
          <div key={i} className="flex flex-col gap-3">
            {item.image.startsWith("/images/placeholder/") ? (
              <PlaceholderImage alt={item.alt} className="w-full aspect-[4/3]" />
            ) : (
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image src={item.image} alt={item.alt} fill className="object-cover" />
              </div>
            )}
            {item.caption && (
              <p className="font-sans text-xs text-concrete leading-relaxed">{item.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ModelingSection() {
  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-10">
        <p className="label-en mb-14 text-concrete text-center">Free 3D Modeling</p>
        <div className="flex flex-col gap-16 lg:gap-20">
          <ModelingGroup group={modelingContent.exterior} />
          <ModelingGroup group={modelingContent.interior} />
        </div>
      </div>
    </section>
  );
}
