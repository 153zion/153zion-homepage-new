"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  consultationSchema,
  type ConsultationFormValues,
} from "@/lib/validations/consultation";
import {
  createConsultation,
  findRelated,
  getOptions,
  updateConsultation,
  type SavePayload,
} from "@/lib/erp/data";
import { withWeekday, type ConsultationFull, type ConsultationRow, type OptionItem, type Staff } from "@/lib/erp/types";
import PhotoBox from "./PhotoBox";

/* ─── 상담일지 등록·수정 ─────────────────────────────────────
   한글 양식의 항목을 그대로 옮기되, 필수는 건축주·연락처·주소뿐입니다.
   [③ 문서번호·요일·작성자 자동] [④ 필수 최소화·큰 입력칸]
──────────────────────────────────────────────────────────── */

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-3 text-base outline-none focus:border-orange-500";
const labelCls = "mb-1 block text-sm font-bold text-gray-700";

export default function ConsultationForm({
  staff,
  initial,
}: {
  staff: Staff;
  initial: ConsultationFull | null;
}) {
  const router = useRouter();
  const [services, setServices] = useState<OptionItem[]>([]);
  const [jimok, setJimok] = useState<OptionItem[]>([]);
  const [zones, setZones] = useState<OptionItem[]>([]);
  const [statuses, setStatuses] = useState<OptionItem[]>([]);
  const [lostReasons, setLostReasons] = useState<OptionItem[]>([]);
  const [related, setRelated] = useState<ConsultationRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      consulted_on: initial?.consulted_on ?? new Date().toISOString().slice(0, 10),
      status: initial?.status ?? "대기",
      client_name: initial?.client_name ?? "",
      client_phone: initial?.client_phone ?? "",
      addresses:
        initial?.parcels.length
          ? initial.parcels.map((p) => ({
              address: p.address,
              jimok_codes: p.jimok_codes ?? [],
            }))
          : [{ address: "", jimok_codes: [] }],
      services: initial?.services ?? [],
      land_area: initial?.land_area != null ? String(initial.land_area) : "",
      area_pending_note: initial?.area_pending_note ?? "",
      zone_code: initial?.zone_code ?? "",
      client_request: initial?.client_request ?? "",
      agency_note: initial?.agency_note ?? "",
      remark: initial?.remark ?? "",
      referrer_name: initial?.referrer_name ?? "",
      next_contact_on: initial?.next_contact_on ?? "",
      lost_reason_code: initial?.lost_reason_code ?? "",
      spent_hours: initial?.spent_hours != null ? String(initial.spent_hours) : "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "addresses" });

  useEffect(() => {
    (async () => {
      setServices(await getOptions("service"));
      setJimok(await getOptions("jimok"));
      setZones(await getOptions("zone"));
      setStatuses(await getOptions("status"));
      setLostReasons(await getOptions("lost_reason"));
    })();
  }, []);

  const watchedStatus = watch("status");
  const watchedName = watch("client_name");
  const watchedDate = watch("consulted_on");
  const watchedServices = watch("services") ?? [];
  const firstAddress = watch("addresses.0.address") ?? "";

  /* 같은 건축주·같은 필지의 과거 상담을 알려줍니다 [③ 두 번 입력 방지] */
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!watchedName && !firstAddress) return setRelated([]);
      try {
        setRelated(await findRelated(watchedName, firstAddress, initial?.id));
      } catch {
        setRelated([]);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [watchedName, firstAddress, initial?.id]);

  const statusColor = useMemo(
    () => statuses.find((s) => s.code === watchedStatus)?.color ?? "#6B7280",
    [statuses, watchedStatus]
  );

  function toggleArray(name: "services", code: string) {
    const cur = watch(name) ?? [];
    setValue(
      name,
      cur.includes(code) ? cur.filter((c) => c !== code) : [...cur, code],
      { shouldDirty: true }
    );
  }

  function toggleJimok(index: number, code: string) {
    const cur = watch(`addresses.${index}.jimok_codes`) ?? [];
    setValue(
      `addresses.${index}.jimok_codes`,
      cur.includes(code) ? cur.filter((c) => c !== code) : [...cur, code],
      { shouldDirty: true }
    );
  }

  async function onSubmit(v: ConsultationFormValues) {
    setSaving(true);
    setSaveError(null);
    const payload: SavePayload = {
      consulted_on: v.consulted_on,
      status: v.status,
      client_name: v.client_name.trim(),
      client_phone: v.client_phone.trim(),
      land_area: v.land_area ? Number(v.land_area) : null,
      area_pending_note: v.area_pending_note?.trim() || null,
      zone_code: v.zone_code || null,
      client_request: v.client_request?.trim() || null,
      agency_note: v.agency_note?.trim() || null,
      remark: v.remark?.trim() || null,
      next_contact_on: v.next_contact_on || null,
      lost_reason_code: v.status === "무산" ? v.lost_reason_code || null : null,
      spent_hours: v.spent_hours ? Number(v.spent_hours) : null,
      referrer_name: v.referrer_name ?? "",
      parcels: v.addresses.map((a) => ({
        address: a.address,
        jimok_codes: a.jimok_codes,
      })),
      services: v.services ?? [],
    };

    try {
      if (initial) {
        await updateConsultation(initial.id, staff, payload, initial.status);
        router.push(`/erp/edit?id=${initial.id}&saved=1`);
      } else {
        const id = await createConsultation(staff, payload);
        router.push(`/erp/edit?id=${id}&created=1`);
      }
      router.refresh();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "저장하지 못했습니다");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 머리말 — 문서번호·상태 */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <div className="text-xs text-gray-500">문서번호</div>
            <div className="text-lg font-extrabold">
              {initial ? initial.doc_no : "저장하면 자동으로 부여됩니다"}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-500">진행상태</span>
            <span
              className="rounded-full px-3 py-1 text-sm font-bold text-white"
              style={{ background: statusColor }}
            >
              {watchedStatus}
            </span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s.code}
              type="button"
              onClick={() => setValue("status", s.code, { shouldDirty: true })}
              className={`rounded-lg border px-3 py-2 text-sm font-bold ${
                watchedStatus === s.code
                  ? "border-transparent text-white"
                  : "border-gray-300 bg-white text-gray-600"
              }`}
              style={watchedStatus === s.code ? { background: s.color ?? "#374151" } : {}}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm">
          <b>같은 건축주 또는 같은 필지의 과거 상담이 있습니다.</b>
          <ul className="mt-2 space-y-1">
            {related.slice(0, 5).map((r) => (
              <li key={r.id}>
                <a className="text-orange-700 underline" href={`/erp/edit?id=${r.id}`}>
                  {r.doc_no} · {r.client_name} · {r.first_address ?? "주소 없음"} ({r.status})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>상담일자 *</label>
          <input type="date" {...register("consulted_on")} className={inputCls} />
          <p className="mt-1 text-xs text-gray-500">{withWeekday(watchedDate)}</p>
        </div>
        <div>
          <label className={labelCls}>다음 연락 예정일</label>
          <input type="date" {...register("next_contact_on")} className={inputCls} />
          <p className="mt-1 text-xs text-gray-500">
            적어두면 &quot;오늘 연락할 건축주&quot; 목록에 뜹니다
          </p>
        </div>
        <div>
          <label className={labelCls}>건축주 *</label>
          <input {...register("client_name")} className={inputCls} placeholder="성함" />
          {errors.client_name && (
            <p className="mt-1 text-sm text-red-600">{errors.client_name.message}</p>
          )}
        </div>
        <div>
          <label className={labelCls}>연락처 *</label>
          <input
            {...register("client_phone")}
            className={inputCls}
            placeholder="010-1234-5678"
            inputMode="tel"
          />
          {errors.client_phone && (
            <p className="mt-1 text-sm text-red-600">{errors.client_phone.message}</p>
          )}
        </div>
      </div>

      {/* 대지위치 — 여러 필지 */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-2 flex items-center">
          <span className={labelCls + " mb-0"}>대지위치 *</span>
          <button
            type="button"
            onClick={() => append({ address: "", jimok_codes: [] })}
            className="ml-auto rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-bold"
          >
            + 필지 추가
          </button>
        </div>
        {errors.addresses && (
          <p className="mb-2 text-sm text-red-600">
            {errors.addresses.message ?? "대지위치를 입력해주세요"}
          </p>
        )}

        <div className="space-y-4">
          {fields.map((f, i) => {
            const addr = watch(`addresses.${i}.address`) ?? "";
            const picked = watch(`addresses.${i}.jimok_codes`) ?? [];
            return (
              <div key={f.id} className="rounded-lg border border-gray-200 p-3">
                <div className="flex gap-2">
                  <input
                    {...register(`addresses.${i}.address` as const)}
                    className={inputCls}
                    placeholder="예: 안성시 삼죽면 율곡리 16"
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="shrink-0 rounded-lg border border-gray-300 px-3 text-sm text-gray-500"
                    >
                      삭제
                    </button>
                  )}
                </div>

                {/* 조회 사이트 바로가기 [③ 찾는 시간 없애기] */}
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <a
                    className="rounded-lg border border-gray-300 px-2 py-1"
                    href={`https://map.kakao.com/?q=${encodeURIComponent(addr)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    카카오맵에서 보기
                  </a>
                  <button
                    type="button"
                    className="rounded-lg border border-gray-300 px-2 py-1"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(addr);
                      } catch {}
                      window.open("https://www.eum.go.kr/", "_blank");
                    }}
                  >
                    주소 복사 + 토지이음 열기
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-gray-300 px-2 py-1"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(addr);
                      } catch {}
                      window.open("https://cloud.eais.go.kr/", "_blank");
                    }}
                  >
                    주소 복사 + 세움터 열기
                  </button>
                </div>

                <div className="mt-3">
                  <div className="mb-1 text-xs text-gray-500">지목 (복수 선택)</div>
                  <div className="flex flex-wrap gap-2">
                    {jimok.map((j) => (
                      <button
                        key={j.code}
                        type="button"
                        onClick={() => toggleJimok(i, j.code)}
                        className={`rounded-lg border px-3 py-1.5 text-sm ${
                          picked.includes(j.code)
                            ? "border-orange-600 bg-orange-50 font-bold text-orange-700"
                            : "border-gray-300 text-gray-600"
                        }`}
                      >
                        {j.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 용역내용 · 면적 · 용도지역 */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className={labelCls}>용역내용 (복수 선택)</label>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <button
              key={s.code}
              type="button"
              onClick={() => toggleArray("services", s.code)}
              className={`rounded-lg border px-3 py-2 text-sm ${
                watchedServices.includes(s.code)
                  ? "border-red-600 bg-red-50 font-bold text-red-700"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>대지면적 (㎡)</label>
            <input
              {...register("land_area")}
              className={inputCls}
              inputMode="decimal"
              placeholder="예: 1974"
            />
          </div>
          <div>
            <label className={labelCls}>면적 미정 사유</label>
            <input
              {...register("area_pending_note")}
              className={inputCls}
              placeholder="예: 토목설계사무소에서 부지면적 건축주와 협의"
            />
          </div>
          <div>
            <label className={labelCls}>용도지역</label>
            <select {...register("zone_code")} className={inputCls}>
              <option value="">선택</option>
              {zones.map((z) => (
                <option key={z.code} value={z.code}>
                  {z.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>상담에 쓴 시간 (시간)</label>
            <input
              {...register("spent_hours")}
              className={inputCls}
              inputMode="decimal"
              placeholder="예: 1.5"
            />
            <p className="mt-1 text-xs text-gray-500">
              계약 안 된 상담에 쓴 시간을 월별로 확인합니다
            </p>
          </div>
        </div>
      </div>

      {/* 내용 */}
      <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <label className={labelCls}>건축주 요구사항</label>
          <textarea
            {...register("client_request")}
            className={inputCls + " min-h-24"}
            placeholder="예: 14평 × 3동"
          />
        </div>
        <div>
          <label className={labelCls}>기타사항 (관청 협의 등)</label>
          <textarea
            {...register("agency_note")}
            className={inputCls + " min-h-24"}
            placeholder="예: 건축과 협의 사항 — 3동을 앉히는데 단독주택 확인"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>소개자</label>
            <input
              {...register("referrer_name")}
              className={inputCls}
              placeholder="예: ○○하우징 ○○○실장"
            />
            <p className="mt-1 text-xs text-gray-500">
              소개자별 상담·계약 건수를 따로 집계합니다
            </p>
          </div>
          <div>
            <label className={labelCls}>비고</label>
            <input {...register("remark")} className={inputCls} />
          </div>
        </div>

        {watchedStatus === "무산" && (
          <div>
            <label className={labelCls}>무산 사유</label>
            <select {...register("lost_reason_code")} className={inputCls}>
              <option value="">선택</option>
              {lostReasons.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 사진 — 저장 후에 붙입니다 */}
      {initial ? (
        <PhotoBox consultationId={initial.id} staff={staff} initial={initial.attachments} />
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
          항공사진·지적도는 저장한 뒤에 붙일 수 있습니다.
        </div>
      )}

      {saveError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{saveError}</p>
      )}

      <div className="sticky bottom-0 flex gap-2 border-t border-gray-200 bg-white p-3 print:hidden">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-lg bg-orange-600 py-4 text-lg font-bold text-white disabled:opacity-50"
        >
          {saving ? "저장 중…" : "저장"}
        </button>
        {initial && (
          <a
            href={`/erp/print?id=${initial.id}`}
            className="rounded-lg border border-gray-300 px-5 py-4 text-center font-bold"
          >
            인쇄 / PDF
          </a>
        )}
      </div>
    </form>
  );
}
