"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ErpShell, { useStaff } from "@/components/erp/ErpShell";
import ConsultationForm from "@/components/erp/ConsultationForm";
import { deleteConsultation, getConsultation } from "@/lib/erp/data";
import type { ConsultationFull } from "@/lib/erp/types";

/* 상담일지 수정 — 정적 내보내기라 /erp/edit?id=... 형태로 엽니다 */
function EditInner() {
  const staff = useStaff();
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const justSaved = params.get("saved") === "1" || params.get("created") === "1";

  const [data, setData] = useState<ConsultationFull | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    if (!id) {
      setState("missing");
      return;
    }
    (async () => {
      const row = await getConsultation(id);
      if (!row) {
        setState("missing");
        return;
      }
      setData(row);
      setState("ok");
    })();
  }, [id]);

  if (!staff) return null;
  if (state === "loading") return <p className="py-10 text-center text-gray-500">불러오는 중…</p>;
  if (state === "missing" || !data)
    return (
      <div className="py-10 text-center">
        <p className="mb-4 text-gray-500">상담일지를 찾을 수 없습니다.</p>
        <Link href="/erp" className="rounded-lg bg-gray-800 px-5 py-3 font-bold text-white">
          목록으로
        </Link>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/erp" className="text-sm text-gray-500 underline">
          ← 목록
        </Link>
        <h1 className="text-xl font-extrabold">{data.doc_no}</h1>
        {justSaved && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">
            저장되었습니다
          </span>
        )}
        <button
          className="ml-auto text-sm text-gray-400 underline"
          onClick={async () => {
            if (!confirm(`${data.doc_no} 상담일지를 지울까요? 되돌릴 수 없습니다.`)) return;
            await deleteConsultation(data.id);
            router.replace("/erp");
          }}
        >
          삭제
        </button>
      </div>

      <ConsultationForm staff={staff} initial={data} />
    </div>
  );
}

export default function ErpEditPage() {
  return (
    <ErpShell>
      <Suspense fallback={<p className="py-10 text-center text-gray-500">불러오는 중…</p>}>
        <EditInner />
      </Suspense>
    </ErpShell>
  );
}
