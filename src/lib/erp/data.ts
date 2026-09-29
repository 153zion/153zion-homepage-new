import { supabase } from "@/lib/supabase";
import type {
  Attachment,
  ConsultationFull,
  ConsultationRow,
  OptionItem,
  OptionSetKey,
  Parcel,
  Staff,
} from "./types";

/* ─── 153ERP 상담일지 데이터 계층 ────────────────────────────
   RLS 로 "로그인한 직원의 사무소 자료"만 오갑니다.
   화면 쪽에서는 office_id 를 신경 쓰지 않습니다. [④]
──────────────────────────────────────────────────────────── */

export async function getMyStaff(): Promise<Staff | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data } = await supabase
    .from("staff")
    .select("id, office_id, name, position, role")
    .eq("auth_user_id", auth.user.id)
    .eq("active", true)
    .maybeSingle();
  return (data as Staff) ?? null;
}

export async function getOptions(setKey: OptionSetKey): Promise<OptionItem[]> {
  const { data } = await supabase
    .from("option_sets")
    .select("code, label, color, sort_order")
    .eq("set_key", setKey)
    .eq("active", true)
    .order("sort_order");
  return (data as OptionItem[]) ?? [];
}

export async function getSetting(key: string): Promise<string | null> {
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return data?.value ?? null;
}

/* 목록 — 건축주명·주소·상태로 찾기 [③ 찾는 시간을 없앤다] */
export async function listConsultations(params: {
  q?: string;
  status?: string;
}): Promise<ConsultationRow[]> {
  let query = supabase
    .from("consultations")
    .select(
      "*, consultation_parcels(address, sort_order), consultation_services(service_code)"
    )
    .order("consulted_on", { ascending: false })
    .order("doc_no", { ascending: false });

  if (params.status) query = query.eq("status", params.status);

  const { data, error } = await query;
  if (error) throw error;

  type Raw = ConsultationRow & {
    consultation_parcels: { address: string; sort_order: number }[];
    consultation_services: { service_code: string }[];
  };

  let rows = ((data as Raw[]) ?? []).map((r) => {
    const parcels = [...(r.consultation_parcels ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order
    );
    return {
      ...r,
      first_address: parcels.length ? parcels.map((p) => p.address).join(", ") : null,
      services: (r.consultation_services ?? []).map((s) => s.service_code),
    } as ConsultationRow;
  });

  const q = (params.q ?? "").trim();
  if (q) {
    const lower = q.toLowerCase();
    rows = rows.filter((r) =>
      [r.client_name, r.client_phone, r.doc_no, r.first_address ?? "", r.remark ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );
  }
  return rows;
}

/* 같은 건축주·같은 필지의 과거 상담 [③ 두 번 입력하지 않게] */
export async function findRelated(
  clientName: string,
  address: string,
  excludeId?: string
): Promise<ConsultationRow[]> {
  if (!clientName && !address) return [];
  const rows = await listConsultations({});
  const addr = address.trim();
  return rows.filter(
    (r) =>
      r.id !== excludeId &&
      ((clientName && r.client_name === clientName) ||
        (addr && (r.first_address ?? "").includes(addr)))
  );
}

export async function getConsultation(id: string): Promise<ConsultationFull | null> {
  const { data, error } = await supabase
    .from("consultations")
    .select(
      "*, consultation_parcels(id, address, jimok_codes, sort_order), consultation_services(service_code), attachments(id, storage_path, kind, created_at), referrers(name), staff(name)"
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  type Raw = ConsultationFull & {
    consultation_parcels: Parcel[];
    consultation_services: { service_code: string }[];
    attachments: Attachment[];
    referrers: { name: string } | null;
    staff: { name: string } | null;
  };
  const r = data as Raw;

  return {
    ...r,
    parcels: [...(r.consultation_parcels ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order
    ),
    services: (r.consultation_services ?? []).map((s) => s.service_code),
    attachments: r.attachments ?? [],
    referrer_name: r.referrers?.name ?? null,
    author_name: r.staff?.name ?? null,
  };
}

/* 소개자는 이름으로 찾고 없으면 만듭니다 (소개자별 집계를 위해 테이블 분리) [①] */
async function findOrCreateReferrer(
  officeId: string,
  name: string
): Promise<string | null> {
  const clean = name.trim();
  if (!clean) return null;
  const { data: found } = await supabase
    .from("referrers")
    .select("id")
    .eq("name", clean)
    .maybeSingle();
  if (found) return found.id as string;

  const { data: created, error } = await supabase
    .from("referrers")
    .insert({ office_id: officeId, name: clean })
    .select("id")
    .single();
  if (error) throw error;
  return created.id as string;
}

export type SavePayload = {
  consulted_on: string;
  status: string;
  client_name: string;
  client_phone: string;
  land_area: number | null;
  area_pending_note: string | null;
  zone_code: string | null;
  client_request: string | null;
  agency_note: string | null;
  remark: string | null;
  next_contact_on: string | null;
  lost_reason_code: string | null;
  spent_hours: number | null;
  referrer_name: string;
  parcels: { address: string; jimok_codes: string[] }[];
  services: string[];
};

async function replaceChildren(id: string, payload: SavePayload) {
  await supabase.from("consultation_parcels").delete().eq("consultation_id", id);
  const parcels = payload.parcels
    .filter((p) => p.address.trim())
    .map((p, i) => ({
      consultation_id: id,
      address: p.address.trim(),
      jimok_codes: p.jimok_codes,
      sort_order: i,
    }));
  if (parcels.length) await supabase.from("consultation_parcels").insert(parcels);

  await supabase.from("consultation_services").delete().eq("consultation_id", id);
  if (payload.services.length) {
    await supabase.from("consultation_services").insert(
      payload.services.map((code) => ({ consultation_id: id, service_code: code }))
    );
  }
}

/* 새 상담 — 문서번호는 서버에서 YYYYMM-NN 로 자동 부여 [③] */
export async function createConsultation(
  staff: Staff,
  payload: SavePayload
): Promise<string> {
  const { data: docNo, error: rpcError } = await supabase.rpc("next_doc_no", {
    p_office: staff.office_id,
    p_date: payload.consulted_on,
  });
  if (rpcError) throw rpcError;

  const referrer_id = await findOrCreateReferrer(staff.office_id, payload.referrer_name);

  const { data, error } = await supabase
    .from("consultations")
    .insert({
      office_id: staff.office_id,
      doc_no: docNo as string,
      author_id: staff.id,
      referrer_id,
      consulted_on: payload.consulted_on,
      status: payload.status,
      client_name: payload.client_name,
      client_phone: payload.client_phone,
      land_area: payload.land_area,
      area_pending_note: payload.area_pending_note,
      zone_code: payload.zone_code,
      client_request: payload.client_request,
      agency_note: payload.agency_note,
      remark: payload.remark,
      next_contact_on: payload.next_contact_on,
      lost_reason_code: payload.lost_reason_code,
      spent_hours: payload.spent_hours,
    })
    .select("id")
    .single();
  if (error) throw error;

  const id = data.id as string;
  await replaceChildren(id, payload);
  await supabase.from("status_history").insert({
    consultation_id: id,
    from_status: null,
    to_status: payload.status,
    changed_by: staff.id,
  });
  return id;
}

export async function updateConsultation(
  id: string,
  staff: Staff,
  payload: SavePayload,
  prevStatus: string
): Promise<void> {
  const referrer_id = await findOrCreateReferrer(staff.office_id, payload.referrer_name);

  const { error } = await supabase
    .from("consultations")
    .update({
      referrer_id,
      consulted_on: payload.consulted_on,
      status: payload.status,
      client_name: payload.client_name,
      client_phone: payload.client_phone,
      land_area: payload.land_area,
      area_pending_note: payload.area_pending_note,
      zone_code: payload.zone_code,
      client_request: payload.client_request,
      agency_note: payload.agency_note,
      remark: payload.remark,
      next_contact_on: payload.next_contact_on,
      lost_reason_code: payload.lost_reason_code,
      spent_hours: payload.spent_hours,
    })
    .eq("id", id);
  if (error) throw error;

  await replaceChildren(id, payload);

  if (prevStatus !== payload.status) {
    await supabase.from("status_history").insert({
      consultation_id: id,
      from_status: prevStatus,
      to_status: payload.status,
      changed_by: staff.id,
    });
  }
}

/* 목록에서 바로 상태 변경 [① 칸반의 토대] */
export async function changeStatus(
  id: string,
  from: string,
  to: string,
  staffId: string
): Promise<void> {
  const { error } = await supabase
    .from("consultations")
    .update({ status: to })
    .eq("id", id);
  if (error) throw error;
  await supabase.from("status_history").insert({
    consultation_id: id,
    from_status: from,
    to_status: to,
    changed_by: staffId,
  });
}

export async function deleteConsultation(id: string): Promise<void> {
  const { error } = await supabase.from("consultations").delete().eq("id", id);
  if (error) throw error;
}

/* ─── 사진 첨부 (현장에서 촬영 즉시 업로드) [③] ─────────────── */
export async function uploadPhotos(
  consultationId: string,
  staffId: string,
  files: File[],
  kind = "항공사진"
): Promise<void> {
  for (const file of files) {
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const path = `${consultationId}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from("consultation-photos")
      .upload(path, file, { upsert: false });
    if (error) throw error;
    await supabase.from("attachments").insert({
      consultation_id: consultationId,
      storage_path: path,
      kind,
      uploaded_by: staffId,
    });
  }
}

export async function signedUrl(path: string): Promise<string | null> {
  const { data } = await supabase.storage
    .from("consultation-photos")
    .createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

export async function deleteAttachment(att: Attachment): Promise<void> {
  await supabase.storage.from("consultation-photos").remove([att.storage_path]);
  await supabase.from("attachments").delete().eq("id", att.id);
}
