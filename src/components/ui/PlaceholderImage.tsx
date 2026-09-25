import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── 사진 플레이스홀더 ────────────────────────────────────────
   실제 사진이 준비되면 이 컴포넌트 대신 next/image로 교체
──────────────────────────────────────────────────────────── */
export default function PlaceholderImage({
  alt,
  className,
}: {
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 bg-steel/10 border border-dashed border-concrete/40 text-concrete",
        className
      )}
    >
      <ImageIcon size={28} strokeWidth={1.5} />
      <p className="px-4 text-center text-xs font-sans leading-relaxed">
        사진 준비중
        <br />
        <span className="text-concrete/70">{alt}</span>
      </p>
    </div>
  );
}
