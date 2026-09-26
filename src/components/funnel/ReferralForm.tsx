"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { referralContent } from "@/lib/content";
import { referralFormSchema, type ReferralFormValues } from "@/lib/validations/funnel";
import { supabase } from "@/lib/supabase";

/* ─── 소개 폼 ────────────────────────────────────────────────
   Supabase inquiries 테이블에 category="소개"로 저장. 소개자를
   name/contact에, 피소개자 정보는 message에 담는다.
──────────────────────────────────────────────────────────── */
export default function ReferralForm() {
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReferralFormValues>({
    resolver: zodResolver(referralFormSchema),
    defaultValues: {
      referrerName: "",
      referrerPhone: "",
      refereeName: "",
      refereePhone: "",
      message: "",
      privacyConsent: false,
    },
  });

  const privacyConsent = watch("privacyConsent");

  const onSubmit = async (data: ReferralFormValues) => {
    const message = [
      data.refereeName || data.refereePhone
        ? `[피소개자] ${data.refereeName || "(이름 미기재)"} ${data.refereePhone || ""}`.trim()
        : "[피소개자] 연락처 미기재 — 소개자가 먼저 안내 예정",
      data.message || null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const { error } = await supabase.from("inquiries").insert({
      name: data.referrerName,
      contact: data.referrerPhone,
      category: "소개",
      message,
    });

    if (error) {
      setErrorMessage(error.message);
      setSubmitState("error");
      return;
    }

    setSubmitState("success");
  };

  if (submitState === "success") {
    return (
      <div className="border border-accent/30 bg-stone/60 px-8 py-16 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
          <Check size={22} />
        </div>
        <h3 className="font-serif text-xl lg:text-2xl font-light text-ink mb-3 tracking-wide">
          {referralContent.successTitle}
        </h3>
        <p className="font-sans text-sm text-concrete leading-relaxed">
          {referralContent.successBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {/* ── 소개자 정보 ── */}
      <div>
        <p className="font-sans text-xs font-medium text-concrete mb-3">소개해주시는 분</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="referrerName" className="block font-sans text-sm font-medium text-ink mb-2">
              성함 <span className="text-accent">*</span>
            </label>
            <input
              id="referrerName"
              type="text"
              placeholder="홍길동"
              className="w-full border border-concrete/30 px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-accent transition-colors"
              {...register("referrerName")}
            />
            {errors.referrerName && (
              <p className="mt-1.5 font-sans text-xs text-destructive">
                {errors.referrerName.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="referrerPhone" className="block font-sans text-sm font-medium text-ink mb-2">
              연락처 <span className="text-accent">*</span>
            </label>
            <input
              id="referrerPhone"
              type="tel"
              placeholder="010-1234-5678 (사례비 지급용)"
              className="w-full border border-concrete/30 px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-accent transition-colors"
              {...register("referrerPhone")}
            />
            {errors.referrerPhone && (
              <p className="mt-1.5 font-sans text-xs text-destructive">
                {errors.referrerPhone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── 피소개자 정보 ── */}
      <div>
        <p className="font-sans text-xs font-medium text-concrete mb-1">
          소개하시는 분 <span className="font-normal">(선택)</span>
        </p>
        <p className="font-sans text-xs text-concrete/70 mb-3">{referralContent.helperNote}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="refereeName" className="block font-sans text-sm font-medium text-ink mb-2">
              성함
            </label>
            <input
              id="refereeName"
              type="text"
              placeholder="홍길동"
              className="w-full border border-concrete/30 px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-accent transition-colors"
              {...register("refereeName")}
            />
          </div>
          <div>
            <label htmlFor="refereePhone" className="block font-sans text-sm font-medium text-ink mb-2">
              연락처
            </label>
            <input
              id="refereePhone"
              type="tel"
              placeholder="010-1234-5678"
              className="w-full border border-concrete/30 px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-accent transition-colors"
              {...register("refereePhone")}
            />
            {errors.refereePhone && (
              <p className="mt-1.5 font-sans text-xs text-destructive">
                {errors.refereePhone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── 메모 ── */}
      <div>
        <label htmlFor="message" className="block font-sans text-sm font-medium text-ink mb-2">
          전하고 싶은 말 <span className="text-concrete font-normal">(선택)</span>
        </label>
        <textarea
          id="message"
          rows={3}
          placeholder="어떤 상황인지 편하게 남겨주세요"
          className="w-full border border-concrete/30 px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-accent transition-colors resize-none"
          {...register("message")}
        />
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
            소개 감사 인사와 사례비 지급을 위해 수집한 개인정보(성함, 연락처)는 해당 목적으로만
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
          접수에 실패했습니다: {errorMessage} (잠시 후 다시 시도해주세요)
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !privacyConsent}
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-sans text-sm font-medium tracking-wide hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        {referralContent.ctaLabel}
      </button>
    </form>
  );
}
