"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { contactContent } from "@/lib/content";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";
import { supabase } from "@/lib/supabase";

/* ─── 문의 폼 ───────────────────────────────────────────────
   회사ERP의 문의관리.html과 같은 Supabase inquiries 테이블에 저장됩니다.
   테이블 컬럼(name/contact/category/message)에 맞춰 폼 필드를 매핑합니다.
   이메일 자동 발송(resend)은 아직 미연동.
──────────────────────────────────────────────────────────── */
export default function ContactForm() {
  const searchParams = useSearchParams();
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      inquiryType: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      message: "",
      privacyConsent: false,
    },
  });

  /* 서비스 카드에서 ?type=factory 로 들어온 경우 자동 선택 */
  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl && contactContent.inquiryTypes.some((t) => t.id === typeFromUrl)) {
      setValue("inquiryType", typeFromUrl);
    }
  }, [searchParams, setValue]);

  const selectedType = watch("inquiryType");
  const privacyConsent = watch("privacyConsent");

  const onSubmit = async (data: ContactFormValues) => {
    const categoryLabel =
      contactContent.inquiryTypes.find((t) => t.id === data.inquiryType)?.label ??
      data.inquiryType;
    const contact = data.email ? `${data.phone} / ${data.email}` : data.phone;
    const message = [
      data.address ? `[부지 주소] ${data.address}` : null,
      data.message || null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const { error } = await supabase.from("inquiries").insert({
      name: data.name,
      contact,
      category: categoryLabel,
      message: message || "(문의 내용 없음)",
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
          문의가 접수되었습니다
        </h3>
        <p className="font-sans text-sm text-concrete leading-relaxed">
          {contactContent.reassurance}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
      {/* ── 문의 유형 선택 ── */}
      <div>
        <label className="block font-sans text-sm font-medium text-ink mb-3">
          문의 유형 <span className="text-accent">*</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-2.5">
          {contactContent.inquiryTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setValue("inquiryType", type.id, { shouldValidate: true })}
              className={`flex flex-col items-center justify-center gap-1.5 border px-3 py-4 text-center transition-colors ${
                selectedType === type.id
                  ? "border-accent bg-accent/10 text-ink"
                  : "border-concrete/25 text-concrete hover:border-concrete/50"
              }`}
            >
              <span className="text-xl" aria-hidden>
                {type.icon}
              </span>
              <span className="font-sans text-xs font-medium">{type.label}</span>
            </button>
          ))}
        </div>
        {errors.inquiryType && (
          <p className="mt-2 font-sans text-xs text-destructive">{errors.inquiryType.message}</p>
        )}
      </div>

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

      {/* ── 이메일 / 부지 주소 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
          <label htmlFor="address" className="block font-sans text-sm font-medium text-ink mb-2">
            부지 주소·지번 <span className="text-concrete font-normal">(선택)</span>
          </label>
          <input
            id="address"
            type="text"
            placeholder="경기도 안성시 ..."
            className="w-full border border-concrete/30 px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-accent transition-colors"
            {...register("address")}
          />
        </div>
      </div>

      {/* ── 문의 내용 ── */}
      <div>
        <label htmlFor="message" className="block font-sans text-sm font-medium text-ink mb-2">
          문의 내용 <span className="text-concrete font-normal">(선택)</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="어떤 건축을 계획하고 계신지, 궁금하신 점을 편하게 남겨주세요."
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
            문의 상담을 위해 수집한 개인정보(성함, 연락처, 이메일, 부지 주소)는 상담 목적으로만
            이용되며, 상담 완료 후 관련 법령에 따른 기간 동안 보관 후 파기됩니다. (
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

      {/* ── 제출 에러 ── */}
      {submitState === "error" && (
        <p className="font-sans text-sm text-destructive">
          문의 접수에 실패했습니다: {errorMessage} (잠시 후 다시 시도해주세요)
        </p>
      )}

      {/* ── 제출 버튼 ── */}
      <button
        type="submit"
        disabled={isSubmitting || !privacyConsent}
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-sans text-sm font-medium tracking-wide hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        문의 접수하기
      </button>
    </form>
  );
}
