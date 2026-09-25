import { aboutContent, siteConfig } from "@/lib/content";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

/* ─── 대표 인사말 섹션 ──────────────────────────────────────── */
export default function CeoSection() {
  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-16 items-start">
          <PlaceholderImage
            alt={`대표 건축사 ${siteConfig.ceo} 인물사진`}
            className="w-full aspect-[4/5]"
          />

          <div>
            <p className="label-en mb-4 text-concrete">CEO Message</p>
            <h2 className="font-serif text-2xl lg:text-3xl font-light text-ink tracking-wide mb-8">
              대표 인사말
            </h2>
            <p className="font-sans text-sm lg:text-base text-ink/85 leading-loose whitespace-pre-line mb-10">
              {aboutContent.ceoMessage}
            </p>
            <div className="flex flex-col gap-1">
              <p className="font-serif text-lg text-ink">{siteConfig.ceo}</p>
              <p className="label-en text-concrete">
                대표 건축사 · {siteConfig.nameShort}
              </p>
            </div>
          </div>
        </div>

        {/* ── 사명 "153"의 의미 ── */}
        <div className="mt-16 lg:mt-24 border border-accent/30 bg-stone/60 px-8 py-10 lg:px-12 lg:py-12">
          <p className="label-en mb-3 text-accent">Our Name</p>
          <h3 className="font-serif text-xl lg:text-2xl font-light text-ink tracking-wide mb-4">
            사명 &ldquo;153&rdquo;에 담긴 의미
          </h3>
          <p className="font-sans text-sm lg:text-base text-concrete leading-relaxed whitespace-pre-line">
            {aboutContent.nameMeaning}
          </p>
        </div>
      </div>
    </section>
  );
}
