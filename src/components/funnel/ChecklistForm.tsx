"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { checklistContent } from "@/lib/content";
import { checklistFormSchema, type ChecklistFormValues } from "@/lib/validations/funnel";
import { supabase } from "@/lib/supabase";

/* ─── 자가진단표 신청 폼 ─────────────────────────────────────
   회사ERP의 문의관리.html과 같은 Supabase inquiries 테이블에
   category="체크리스트 신청"으로 저장된다 (새 테이블 없이 재사용).
──────────────────────────────────────────────────────────── */
export default function ChecklistForm() {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<"idle" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      interest: "",
      landStatus: "",
      privacyConsent: false,
    },
  });

  const interest = watch("interest");
  const landStatus = watch("landStatus");
  const privacyConsent = watch("privacyConsent");

  const onSubmit = async (data: ChecklistFormValues) => {
    const interestLabel =
      checklistContent.interestOptions.find((o) => o.id === data.interest)?.label ?? data.interest;
    const landLabel =
      checklistContent.landOptions.find((o) => o.id === data.landStatus)?.label ?? data.landStatus;
    const contact = data.email ? `${data.phone} / ${data.email}` : data.phone;

    const { error } = await supabase.from("inquiries").insert({
      name: data.name,
      contact,
      category: "체크리스트 신청",
      message: `[관심 용도] ${interestLabel}\n[토지 보유 여부] ${landLabel}`,
    });

    if (error) {
      setErrorMessage(error.message);
      setSubmitState("error");
      return;
    }

    router.push("/checklist/thanks");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {/* ── 성함 / 연락처 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block font-sans text-sm font-medium text-ink mb-2">
            성함 <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="홍길동"
            className="w-full border border-concrete/30 px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-accent transition-colors"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1.5 font-sans text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block font-sans text-sm font-medium text-ink mb-2">
            연락처 <span className="text-accent">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="010-1234-5678"
            className="w-full border border-concrete/30 px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-accent transition-colors"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="mt-1.5 font-sans text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* ── 이메일 ── */}
      <div>
        <label htmlFor="email" className="block font-sans text-sm font-medium text-ink mb-2">
          이메일 <span className="text-concrete font-normal">(선택)</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="example@email.com"
          className="w-full border border-concrete/30 px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-accent transition-colors"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1.5 font-sans text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* ── 관심 용도 ── */}
      <div>
        <label className="block font-sans text-sm font-medium text-ink mb-3">
          관심 용도 <span className="text-accent">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {checklistContent.interestOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setValue("interest", opt.id, { shouldValidate: true })}
              className={`px-3 py-3 text-center font-sans text-sm border transition-colors ${
                interest === opt.id
                  ? "border-accent bg-accent/10 text-ink"
                  : "border-concrete/25 text-concrete hover:border-concrete/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {errors.interest && (
          <p className="mt-1.5 font-sans text-xs text-destructive">{errors.interest.message}</p>
        )}
      </div>

      {/* ── 토지 보유 여부 ── */}
      <div>
        <label className="block font-sans text-sm font-medium text-ink mb-3">
          토지 보유 여부 <span className="text-accent">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {checklistContent.landOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setValue("landStatus", opt.id, { shouldValidate: true })}
              className={`px-3 py-3 text-center font-sans text-sm border transition-colors ${
                landStatus === opt.id
                  ? "border-accent bg-accent/10 text-ink"
                  : "border-concrete/25 text-concrete hover:border-concrete/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {errors.landStatus && (
          <p className="mt-1.5 font-sans text-xs text-destructive">{errors.landStatus.message}</p>
        )}
      </div>

      {/* ── 개인정보 동의 ── */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
            {...register("privacyConsent")}
          />
          <span className="font-sans text-xs text-concrete leading-relaxed">
            자가진단표 발송을 위해 수집한 개인정보(성함, 연락처, 이메일)는 상담 목적으로만
            이용되며, 관련 법령에 따른 기간 동안 보관 후 파기됩니다. (
            <span className="text-concrete/70">[대표님 확인] 실제 보관 기간</span>) 위 내용에
            동의합니다. <span className="text-accent">*</span>
          </span>
        </label>
        {errors.privacyConsent && (
          <p className="mt-1.5 font-sans text-xs text-destructive">
            {errors.privacyConsent.message}
          </p>
        )}
      </div>

      {submitState === "error" && (
        <p className="font-sans text-sm text-destructive">
          신청에 실패했습니다: {errorMessage} (잠시 후 다시 시도해주세요)
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !privacyConsent}
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-sans text-sm font-medium tracking-wide hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        {checklistContent.ctaLabel}
      </button>
    </form>
  );
}
