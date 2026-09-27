import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Clock, MapPin } from "lucide-react";
import { siteConfig, locationContent } from "@/lib/content";
import KakaoMap from "@/components/location/KakaoMap";
import DirectionButtons from "@/components/location/DirectionButtons";
import AddressCopyButton from "@/components/location/AddressCopyButton";
import LocationGallery from "@/components/location/LocationGallery";

export const metadata: Metadata = {
  title: "오시는 길",
  description: `${siteConfig.name} 오시는 길 안내. ${siteConfig.address}`,
};

/* ─── 오시는 길 /location ─────────────────────────────────────
   데스크톱: 좌측 정보 / 우측 지도+길찾기 2단
   모바일: 지도 → 길찾기 버튼 → 정보 순 세로 배치
   (그리드 order로 동일 DOM을 반응형으로 재배치)
──────────────────────────────────────────────────────────── */
export default function LocationPage() {
  return (
    <div className="pt-16 lg:pt-20">
      <section className="bg-stone py-16 lg:py-24">
        <div className="max-w-[720px] mx-auto px-5 lg:px-10 text-center">
          <p className="label-en mb-4 text-concrete">Location</p>
          <h1 className="font-serif text-3xl lg:text-5xl font-light text-ink tracking-wide mb-5">
            {locationContent.heroTitle}
          </h1>
          <p className="font-sans text-sm lg:text-base text-concrete leading-relaxed">
            {locationContent.heroSubtitle}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[1120px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* ── 지도 + 길찾기 (모바일 1번째 / 데스크톱 우측) ── */}
            <div className="order-1 lg:order-2 flex flex-col gap-4">
              <KakaoMap />
              <DirectionButtons />
            </div>

            {/* ── 정보 (모바일 2번째 / 데스크톱 좌측) ── */}
            <div className="order-2 lg:order-1 flex flex-col gap-10">
              <div>
                <div className="flex items-start gap-3 mb-2">
                  <MapPin size={16} className="mt-1 shrink-0 text-accent" />
                  <div className="flex-1">
                    <p className="label-en mb-1 text-concrete">{locationContent.addressLabel}</p>
                    <p className="font-sans text-base text-ink leading-relaxed">
                      {siteConfig.address}
                    </p>
                  </div>
                </div>
                <div className="pl-7">
                  <AddressCopyButton />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-1 shrink-0 text-accent" />
                <div>
                  <p className="label-en mb-1 text-concrete">{locationContent.phoneLabel}</p>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="font-sans text-base text-ink hover:text-accent transition-colors"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={16} className="mt-1 shrink-0 text-accent" />
                <div>
                  <p className="label-en mb-1 text-concrete">{locationContent.hoursLabel}</p>
                  <p className="font-sans text-base text-ink">{siteConfig.businessHours}</p>
                </div>
              </div>

              <div>
                <p className="label-en mb-4 text-concrete">{locationContent.galleryTitle}</p>
                <LocationGallery />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 하단 CTA ── */}
      <section className="bg-stone py-16 lg:py-24 text-center">
        <p className="font-serif text-xl lg:text-2xl font-light text-ink tracking-wide mb-6">
          {locationContent.ctaTitle}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-sans text-sm font-medium tracking-wide hover:bg-accent/90 transition-colors"
        >
          {locationContent.ctaLabel}
        </Link>
      </section>
    </div>
  );
}
