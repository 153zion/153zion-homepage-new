"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/content";

/* ─── 카카오맵 (lazy load) ────────────────────────────────────
   - 화면에 들어올 때만 SDK를 불러온다 (IntersectionObserver)
   - 지도 타일에는 grayscale 필터를 걸고, 마커는 필터 밖의 별도
     오버레이 레이어에 올려 포인트 컬러(accent)를 그대로 유지한다
     (map.getProjection()으로 지도 이동/줌마다 마커 픽셀 좌표를 재계산)
   - NEXT_PUBLIC_KAKAO_MAP_KEY가 없으면 안내 문구만 표시
──────────────────────────────────────────────────────────── */

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
const PIN_W = 30;
const PIN_H = 40;

export default function KakaoMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mapElRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad || !KAKAO_KEY) return;
    setStatus("loading");

    const initMap = () => {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(siteConfig.address, (result: any, geoStatus: any) => {
          if (geoStatus !== window.kakao.maps.services.Status.OK || !mapElRef.current) {
            setStatus("error");
            return;
          }
          const coords = new window.kakao.maps.LatLng(
            Number(result[0].y),
            Number(result[0].x)
          );
          const map = new window.kakao.maps.Map(mapElRef.current, {
            center: coords,
            level: 4,
          });

          const syncPin = () => {
            if (!pinRef.current) return;
            const proj = map.getProjection();
            const point = proj.containerPointFromCoords(coords);
            pinRef.current.style.left = `${point.x - PIN_W / 2}px`;
            pinRef.current.style.top = `${point.y - PIN_H}px`;
          };

          window.kakao.maps.event.addListener(map, "idle", syncPin);
          window.kakao.maps.event.addListener(map, "zoom_changed", syncPin);
          setTimeout(syncPin, 0);

          setStatus("ready");
        });
      });
    };

    if (window.kakao?.maps) {
      initMap();
      return;
    }

    const existing = document.getElementById("kakao-map-sdk");
    if (existing) {
      existing.addEventListener("load", initMap);
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = initMap;
    script.onerror = () => setStatus("error");
    document.head.appendChild(script);
  }, [shouldLoad]);

  return (
    <div ref={wrapRef} className="relative w-full aspect-[4/3] lg:aspect-square bg-stone overflow-hidden">
      {!KAKAO_KEY && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
          <p className="font-sans text-sm text-concrete">지도 준비 중입니다</p>
          <p className="font-sans text-xs text-concrete/70">{siteConfig.address}</p>
        </div>
      )}
      {KAKAO_KEY && status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
          <p className="font-sans text-sm text-concrete">지도를 불러오지 못했습니다</p>
          <p className="font-sans text-xs text-concrete/70">{siteConfig.address}</p>
        </div>
      )}
      {KAKAO_KEY && (
        <>
          <div ref={mapElRef} className="w-full h-full" style={{ filter: "grayscale(1) contrast(1.05)" }} />
          {/* 필터 밖 오버레이 레이어 — 마커만 원래 색으로 유지 */}
          <div
            ref={pinRef}
            className="pointer-events-none absolute z-10 transition-opacity"
            style={{ width: PIN_W, height: PIN_H, opacity: status === "ready" ? 1 : 0 }}
          >
            <svg width={PIN_W} height={PIN_H} viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17 0C7.6 0 0 7.6 0 17c0 12.4 17 27 17 27s17-14.6 17-27C34 7.6 26.4 0 17 0z"
                fill="#B08D57"
              />
              <circle cx="17" cy="17" r="7" fill="#ffffff" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
