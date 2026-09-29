"use client";

import Link from "next/link";
import ErpShell, { useStaff } from "@/components/erp/ErpShell";
import ConsultationForm from "@/components/erp/ConsultationForm";

/* 새 상담 등록 — 목록에서 "+ 새 상담" 한 번이면 이 화면입니다. [④ 3번 클릭 안에] */
function NewInner() {
  const staff = useStaff();
  if (!staff) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/erp" className="text-sm text-gray-500 underline">
          ← 목록
        </Link>
        <h1 className="text-xl font-extrabold">새 상담일지</h1>
      </div>
      <ConsultationForm staff={staff} initial={null} />
    </div>
  );
}

export default function ErpNewPage() {
  return (
    <ErpShell>
      <NewInner />
    </ErpShell>
  );
}
