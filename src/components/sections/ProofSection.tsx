"use client";

import { useEffect, useRef, useState } from "react";
import { statsContent } from "@/lib/content";

/* ─── 숫자 증거 섹션 ───────────────────────────────────────────
   화면에 보이면 0에서 실제 값까지 카운트업
   [대표님 확인] 값이 채워지기 전까지는 note를 함께 표기
──────────────────────────────────────────────────────────── */
function StatItem({
  value,
  suffix,
  label,
  note,
}: (typeof statsContent.items)[number]) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.round(progress * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-serif text-4xl lg:text-6xl font-light text-white tracking-wide">
        {count}
        <span className="text-accent">{suffix}</span>
      </p>
      <p className="mt-3 font-sans text-sm text-white/60">{label}</p>
      {note && <p className="mt-1 font-sans text-[11px] text-white/30">{note}</p>}
    </div>
  );
}

export default function ProofSection() {
  return (
    <section className="bg-steel py-20 lg:py-32">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        {statsContent.items.map((item) => (
          <StatItem key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}
