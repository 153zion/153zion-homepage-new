"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ErpShell from "@/components/erp/ErpShell";
import { getConsultation, getOptions, signedUrl } from "@/lib/erp/data";
import { withWeekday, type ConsultationFull, type OptionItem } from "@/lib/erp/types";
import { supabase } from "@/lib/supabase";

/* ─── 인쇄용 상담일지 (A4 1장) ───────────────────────────────
   기존 한글 양식과 같은 구성: 제목-표-항공사진-회사명.
   회사명·주소는 offices 테이블에서 읽습니다. [③ 출력] [④ 하드코딩 금지]
──────────────────────────────────────────────────────────── */
function PrintInner() {
  const params = useSearchParams();
  const id = params.get("id");
  const [data, setData] = useState<ConsultationFull | null>(null);
  const [office, setOffice] = useState<{ name: string } | null>(null);
  const [services, setServices] = useState<OptionItem[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const row = await getConsultation(id);
      setData(row);
      setServices(await getOptions("service"));
      const { data: off } = await supabase.from("offices").select("name").limit(1).maybeSingle();
      setOffice(off ?? null);
      if (row) {
        const urls: string[] = [];
        for (const a of row.attachments) {
          const u = await signedUrl(a.storage_path);
          if (u) urls.push(u);
        }
        setPhotos(urls);
      }
    })();
  }, [id]);

  if (!data) return <p className="py-10 text-center text-gray-500">불러오는 중…</p>;

  const jimokAll = Array.from(new Set(data.parcels.flatMap((p) => p.jimok_codes ?? [])));
  const area = data.land_area != null ? `${data.land_area} ㎡` : (data.area_pending_note ?? "");

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <tr>
      <th className="w-44 border border-black bg-white p-2 text-left align-middle text-[13px] font-bold">
        {label}
      </th>
      <td className="border border-black p-2 align-middle text-[13px]">{children}</td>
    </tr>
  );

  return (
    <div className="mx-auto max-w-[800px]">
      <div className="mb-4 flex gap-2 print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-orange-600 px-5 py-3 font-bold text-white"
        >
          인쇄 / PDF로 저장
        </button>
        <a
          href={`/erp/edit?id=${data.id}`}
          className="rounded-lg border border-gray-300 px-5 py-3 font-bold"
        >
          수정으로 돌아가기
        </a>
      </div>

      <div className="bg-white p-6 print:p-0">
        <h1 className="text-center text-xl font-bold">
          상담일지(
          {["대기", "검토", "계획", "진행"].map((s, i) => (
            <span key={s}>
              {i > 0 && "/"}
              <span className={data.status === s ? "text-red-600" : ""}>{s}</span>
            </span>
          ))}
          )
        </h1>
        <p className="mb-4 text-center text-lg">({data.doc_no})</p>

        <table className="w-full border-collapse">
          <tbody>
            <Row label="상담일자">{withWeekday(data.consulted_on)}</Row>
            <Row label="대지위치(도로명주소)">
              {data.parcels.map((p) => p.address).join(", ")}
            </Row>
            <Row label="용역내용">
              {services.map((s, i) => (
                <span key={s.code}>
                  {i > 0 && "/"}
                  <span className={data.services.includes(s.code) ? "font-bold text-red-600" : ""}>
                    {s.label}
                  </span>
                </span>
              ))}
            </Row>
            <Row label="대지면적(㎡)">{area}</Row>
            <Row label="지목">{jimokAll.join(", ")}</Row>
            <Row label="용도지역">{data.zone_code ?? ""}</Row>
            <Row label="건축주(연락처)">
              {data.client_name} {data.client_phone}
            </Row>
            <Row label="건축주 요구사항">{data.client_request ?? ""}</Row>
            <Row label="기타사항">{data.agency_note ?? ""}</Row>
            <Row label="비고">
              {[data.referrer_name ? `${data.referrer_name} 소개` : "", data.remark ?? ""]
                .filter(Boolean)
                .join(" / ")}
            </Row>
          </tbody>
        </table>

        <p className="mt-4 text-center font-bold">항공사진</p>
        <div className="mt-2 border border-black p-2">
          {photos.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-gray-400">
              첨부된 사진이 없습니다
            </div>
          ) : (
            photos.map((u, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={i} src={u} alt="항공사진" className="mx-auto mb-2 w-full" />
            ))
          )}
        </div>

        <p className="mt-6 text-center text-lg font-bold">
          {office?.name ?? "(주)153시온건축사사무소"}
        </p>
      </div>
    </div>
  );
}

export default function ErpPrintPage() {
  return (
    <ErpShell>
      <Suspense fallback={<p className="py-10 text-center text-gray-500">불러오는 중…</p>}>
        <PrintInner />
      </Suspense>
    </ErpShell>
  );
}
