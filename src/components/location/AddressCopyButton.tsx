"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { siteConfig, locationContent } from "@/lib/content";

/* ─── 주소 복사 버튼 ───────────────────────────────────────── */
export default function AddressCopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // 클립보드 권한이 없는 환경에서는 조용히 무시
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 font-sans text-xs text-concrete hover:text-accent transition-colors border border-concrete/25 hover:border-accent rounded-full px-3 py-1.5"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? locationContent.copiedLabel : locationContent.copyLabel}
    </button>
  );
}
