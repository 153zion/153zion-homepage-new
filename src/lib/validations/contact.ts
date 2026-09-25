import { z } from "zod";

/* ─── 문의 폼 검증 스키마 ───────────────────────────────────── */
export const contactFormSchema = z.object({
  inquiryType: z.string().min(1, "문의 유형을 선택해주세요"),
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
  address: z.string().optional(),
  message: z.string().optional(),
  privacyConsent: z
    .boolean()
    .refine((v) => v === true, { message: "개인정보 수집·이용에 동의해주세요" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
