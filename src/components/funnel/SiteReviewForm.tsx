"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { siteReviewFormSchema, type SiteReviewFormValues } from "@/lib/validations/funnel";
import { supabase } from "@/lib/supabase";

/* ─── 무료 부지 검토 신청 폼 ─────────────────────────────────
   Supabase inquiries 테이블에 category="무료 부지검토"로 저장.
──────────────────────────────────────────────────────────── */
export default function SiteReviewForm() {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<"idle" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SiteReviewFormValues>({
    resolver: zodResolver(siteReviewFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      message: "",
      privacyConsent: false,
    },
  });

  const privacyConsent = watch("privacyConsent");

  const onSubmit = async (data: SiteReviewFormValues) => {
    const contact = data.email ? `${data.phone} / ${data.email}` : data.phone;
    const message = [`[부지 주소] ${data.address}`, data.message || null]
      .filter(Boolean)
      .join("\n\n");

    const { error } = await supabase.from("inquiries").insert({
      name: data.name,
      contact,
      category: "무료 부지검토",
      message,
    });

    if (error) {
      setErrorMessage(error.message);
      setSubmitState("error");
      return;
    }

    router.push("/site-review/thanks");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
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

      <div>
        <label htmlFor="address" className="block font-sans text-sm font-medium text-ink mb-2">
          부지 주소 또는 지번 <span className="text-accent">*</span>
        </label>
        <input
          id="address"
          type="text"
          placeholder="경기도 안성시 ..."
          className="w-full border border-concrete/30 px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-accent transition-colors"
          {...register("address")}
        />
        {errors.address && (
          <p className="mt-1.5 font-sans text-xs text-destructive">{errors.address.message}</p>
        )}
      </div>

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

      <div>
        <label htmlFor="message" className="block font-sans text-sm font-medium text-ink mb-2">
          계획 중인 용도·규모 <span className="text-concrete font-normal">(선택)</span>
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="예: 공장, 300평 규모로 검토 중입니다"
          className="w-full border border-concrete/30 px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-accent transition-colors resize-none"
          {...register("message")}
        />
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
            {...register("privacyConsent")}
          />
          <span className="font-sans text-xs text-concrete leading-relaxed">
            부지 검토를 위해 수집한 개인정보(성함, 연락처, 이메일, 부지 주소)는 상담 목적으로만
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
        무료 부지 검토 신청하기
      </button>
    </form>
  );
}
