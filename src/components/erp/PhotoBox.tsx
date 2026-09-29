"use client";

import { useEffect, useState } from "react";
import { deleteAttachment, signedUrl, uploadPhotos } from "@/lib/erp/data";
import type { Attachment, Staff } from "@/lib/erp/types";

/* ─── 항공사진·지적도 첨부 ───────────────────────────────────
   현장에서 찍어 바로 올립니다(모바일 카메라). [③ 시간 절약]
   버킷은 비공개라 볼 때마다 1시간짜리 임시 주소를 받습니다.
──────────────────────────────────────────────────────────── */
export default function PhotoBox({
  consultationId,
  staff,
  initial,
}: {
  consultationId: string;
  staff: Staff;
  initial: Attachment[];
}) {
  const [items, setItems] = useState<Attachment[]>(initial);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const next: Record<string, string> = {};
      for (const a of items) {
        const u = await signedUrl(a.storage_path);
        if (u) next[a.id] = u;
      }
      setUrls(next);
    })();
  }, [items]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    setError(null);
    try {
      await uploadPhotos(consultationId, staff.id, files);
      const { getConsultation } = await import("@/lib/erp/data");
      const fresh = await getConsultation(consultationId);
      setItems(fresh?.attachments ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "사진을 올리지 못했습니다");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  async function onDelete(a: Attachment) {
    if (!confirm("이 사진을 지울까요?")) return;
    await deleteAttachment(a);
    setItems((prev) => prev.filter((x) => x.id !== a.id));
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-sm font-bold text-gray-700">항공사진 · 지적도</span>
        <label className="ml-auto cursor-pointer rounded-lg bg-gray-800 px-4 py-2 text-sm font-bold text-white">
          {busy ? "올리는 중…" : "사진 추가"}
          <input
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            className="hidden"
            onChange={onPick}
            disabled={busy}
          />
        </label>
      </div>

      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">
          아직 사진이 없습니다. 현장에서 찍어 바로 올릴 수 있습니다.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((a) => (
            <div key={a.id} className="overflow-hidden rounded-lg border border-gray-200">
              {urls[a.id] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={urls[a.id]} alt={a.kind} className="h-32 w-full object-cover" />
              ) : (
                <div className="h-32 w-full bg-gray-100" />
              )}
              <button
                type="button"
                onClick={() => onDelete(a)}
                className="w-full py-1.5 text-xs text-gray-500 hover:text-red-600"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
