/* ─── 153ERP 상담일지 타입 ──────────────────────────────────
   선택지(상태·용역내용·지목·용도지역·무산사유)는 코드에 박지 않고
   option_sets 테이블에서 읽습니다. [④ 다른 사무소가 설정만 바꿔 쓰기]
──────────────────────────────────────────────────────────── */

export type OptionItem = {
  code: string;
  label: string;
  color: string | null;
  sort_order: number;
};

export type OptionSetKey = "service" | "jimok" | "zone" | "status" | "lost_reason";

export type Staff = {
  id: string;
  office_id: string;
  name: string;
  position: string | null;
  role: "대표" | "직원" | "조회";
};

export type Parcel = {
  id?: string;
  address: string;
  jimok_codes: string[];
  sort_order: number;
};

export type Attachment = {
  id: string;
  storage_path: string;
  kind: string;
  created_at: string;
};

export type Consultation = {
  id: string;
  office_id: string;
  doc_no: string;
  status: string;
  consulted_on: string;
  client_name: string;
  client_phone: string;
  land_area: number | null;
  area_pending_note: string | null;
  zone_code: string | null;
  client_request: string | null;
  agency_note: string | null;
  remark: string | null;
  referrer_id: string | null;
  next_contact_on: string | null;
  author_id: string | null;
  lost_reason_code: string | null;
  spent_hours: number | null;
  created_at: string;
  updated_at: string;
};

export type ConsultationFull = Consultation & {
  parcels: Parcel[];
  services: string[];
  attachments: Attachment[];
  referrer_name: string | null;
  author_name: string | null;
};

/* 목록 화면에서 쓰는 요약 행 */
export type ConsultationRow = Consultation & {
  first_address: string | null;
  services: string[];
};

/* 요일 자동 표시 [③] */
export function withWeekday(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${isoDate.replace(/-/g, ".")}. / ${days[d.getDay()]}`;
}
