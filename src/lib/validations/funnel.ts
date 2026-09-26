import { z } from "zod";

/* ─── 리드마그넷(자가진단표) 신청 폼 검증 스키마 ─────────────── */
export const checklistFormSchema = z.object({
  name: z.string().min(1, "성함을 입력해주세요"),
  phone: z
    .string()
    .min(1, "연락처를 입력해주세요")
    .regex(/^[0-9-]{9,13}$/, "올바른 연락처 형식이 아닙니다 (예: 010-1234-5678)"),
  email: z
    .string()
    .optional()
    .refine((v) => !v || z.string().email().safeParse(v).success, {
      message: "올바른 이메일 형식이 아닙니다",
    }),
  interest: z.string().min(1, "관심 용도를 선택해주세요"),
  landStatus: z.string().min(1, "토지 보유 여부를 선택해주세요"),
  privacyConsent: z
    .boolean()
    .refine((v) => v === true, { message: "개인정보 수집·이용에 동의해주세요" }),
});

export type ChecklistFormValues = z.infer<typeof checklistFormSchema>;
