"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ErpShell, { useStaff } from "@/components/erp/ErpShell";
import { changeStatus, getOptions, listConsultations } from "@/lib/erp/data";
import type { ConsultationRow, OptionItem } from "@/lib/erp/types";

/* ─── 상담 목록 ─────────────────────────────────────────────
   건축주·연락처·문서번호·주소로 한 칸에서 찾습니다. [③]
   목록에서 바로 상태를 바꿉니다. [① 놓치는 상담 없애기]
──────────────────────────────────────────────────────────── */
function ListInner() {
  const staff = useStaff();
  const [rows, setRows] = useState<ConsultationRow[]>([]);
  const [statuses, setStatuses] = useState<OptionItem[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    try {
      setRows(await listConsultations({ q, status }));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => setStatuses(await getOptions("status")))();
  }, []);

  useEffect(() => {
    const t = setTimeout(reload, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status]);

  const colorOf = useMemo(
    () => (code: string) => statuses.find((s) => s.code === code)?.color ?? "#6B7280",
    [statuses]
  );

  const today = new Date().toISOString().slice(0, 10);
  const todayCalls = rows.filter((r) => r.next_contact_on && r.next_contact_on <= today);

  return (
    <div className="space-y-4">
      {todayCalls.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
          <b className="text-sm">오늘 연락할 건축주 {todayCalls.length}명</b>
          <ul className="mt-2 space-y-1 text-sm">
            {todayCalls.map((r) => (
              <li key={r.id}>
                <Link className="text-orange-700 underline" href={`/erp/edit?id=${r.id}`}>
                  {r.client_name} ({r.client_phone}) · {r.doc_no}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="건축주·연락처·주소·문서번호로 찾기"
          className="min-w-60 flex-1 rounded-lg border border-gray-300 px-3 py-3 text-base"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-3 text-base"
        >
          <option value="">전체 상태</option>
          {statuses.map((s) => (
            <option key={s.code} value={s.code}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="py-10 text-center text-gray-500">불러오는 중…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="mb-4 text-gray-500">아직 등록된 상담이 없습니다.</p>
          <Link
            href="/erp/new"
            className="rounded-lg bg-orange-600 px-5 py-3 font-bold text-white"
          >
            + 첫 상담 등록하기
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-gray-200 bg-white p-4 sm:flex sm:items-center sm:gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                    style={{ background: colorOf(r.status) }}
                  >
                    {r.status}
                  </span>
                  <span className="font-mono text-xs text-gray-500">{r.doc_no}</span>
                  <span className="text-base font-bold">{r.client_name}</span>
                  <a className="text-sm text-gray-500" href={`tel:${r.client_phone}`}>
                    {r.client_phone}
                  </a>
                </div>
                <p className="mt-1 truncate text-sm text-gray-600">
                  {r.first_address ?? "대지위치 없음"}
                  {r.services.length ? ` · ${r.services.join(", ")}` : ""}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  상담 {r.consulted_on}
                  {r.next_contact_on ? ` · 다음 연락 ${r.next_contact_on}` : ""}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2 sm:mt-0">
                <select
                  value={r.status}
                  onChange={async (e) => {
                    if (!staff) return;
                    const to = e.target.value;
                    await changeStatus(r.id, r.status, to, staff.id);
                    reload();
                  }}
                  className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
                >
                  {statuses.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <Link
                  href={`/erp/edit?id=${r.id}`}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold"
                >
                  열기
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ErpListPage() {
  return (
    <ErpShell>
      <ListInner />
    </ErpShell>
  );
}
