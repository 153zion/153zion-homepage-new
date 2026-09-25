import type { Metadata } from "next";
import { Suspense } from "react";
import { Phone } from "lucide-react";
import { contactContent, siteConfig } from "@/lib/content";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "문의하기",
  description: "무료 부지검토 신청 및 건축 상담 문의. 상담은 무료이며 계약을 강요하지 않습니다.",
};

/* ─── 문의하기 /contact ────────────────────────────────────── */
export default function ContactPage() {
  return (
    <div className="pt-16 lg:pt-20">
      <section className="bg-stone py-16 lg:py-24">
        <div className="max-w-[720px] mx-auto px-5 lg:px-10 text-center">
          <p className="label-en mb-4 text-concrete">Contact</p>
          <h1 className="font-serif text-3xl lg:text-5xl font-light text-ink tracking-wide mb-5">
            {contactContent.title}
          </h1>
          <p className="font-sans text-sm lg:text-base text-concrete leading-relaxed">
            {contactContent.reassurance}
          </p>
          <a
            href={`tel:${siteConfig.phone}`}
            className="mt-6 inline-flex items-center gap-2 font-sans text-sm text-ink hover:text-accent transition-colors border-b border-ink/20 hover:border-accent pb-0.5"
          >
            <Phone size={14} />
            급하신 경우 바로 전화 상담: {siteConfig.phone}
          </a>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[720px] mx-auto px-5 lg:px-10">
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
