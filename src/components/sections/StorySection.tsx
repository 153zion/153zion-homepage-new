import Link from "next/link";
import { storyContent } from "@/lib/content";

/* ─── 스토리(에피파니) 섹션 ─────────────────────────────────────
   실제 사례를 통해 신뢰를 쌓는 다크 섹션
──────────────────────────────────────────────────────────── */
export default function StorySection() {
  return (
    <section className="bg-ink py-20 lg:py-40">
      <div className="max-w-[800px] mx-auto px-5 lg:px-10 text-center">
        <p className="label-en mb-8 text-white/50">Story</p>
        <p className="font-serif text-lg lg:text-2xl font-light text-white/90 leading-loose whitespace-pre-line mb-10">
          {storyContent.story}
        </p>
        <p className="font-sans text-accent text-base lg:text-lg font-medium mb-8">
          {storyContent.closing}
        </p>
        <Link
          href={storyContent.cta.href}
          className="inline-flex items-center font-sans text-sm text-white/70 hover:text-white border-b border-white/30 hover:border-white transition-colors pb-1"
        >
          {storyContent.cta.label}
        </Link>
      </div>
    </section>
  );
}
