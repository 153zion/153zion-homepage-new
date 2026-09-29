import { z } from "zod";

/* ─── 상담일지 입력 검증 ─────────────────────────────────────
   필수는 건축주·연락처·주소 셋뿐입니다.
   [④ 필수 입력 최소화 — 현장에서 5분 안에 작성]
──────────────────────────────────────────────────────────── */
export const consultationSchema = z.object({
  consulted_on: z.string().min(1, "상담일자를 선택해주세요"),
  status: z.string().min(1),
  client_name: z.string().min(1, "건축주 성함을 입력해주세요"),
  client_phone: z
    .string()
    .min(1, "연락처를 입력해주세요")
    .regex(/^[0-9-]{9,13}$/, "올바른 연락처 형식이 아닙니다 (예: 010-1234-5678)"),
  addresses: z
    .array(z.object({ address: z.string(), jimok_codes: z.array(z.string()) }))
    .min(1)
    .refine((list) => list.some((p) => p.address.trim().length > 0), {
      message: "대지위치를 한 곳 이상 입력해주세요",
    }),
  services: z.array(z.string()),
  land_area: z.string().optional(),
  area_pending_note: z.string().optional(),
  zone_code: z.string().optional(),
  client_request: z.string().optional(),
  agency_note: z.string().optional(),
  remark: z.string().optional(),
  referrer_name: z.string().optional(),
  next_contact_on: z.string().optional(),
  lost_reason_code: z.string().optional(),
  spent_hours: z.string().optional(),
});

export type ConsultationFormValues = z.infer<typeof consultationSchema>;
