import { siteConfig, locationContent } from "@/lib/content";

/* ─── 길찾기 딥링크 버튼 3개 ─────────────────────────────────── */
export default function DirectionButtons() {
  const q = encodeURIComponent(siteConfig.address);
  const links: Record<string, string> = {
    kakao: `https://map.kakao.com/link/search/${q}`,
    naver: `https://map.naver.com/p/search/${q}`,
    tmap: `tmap://search?name=${q}`,
  };

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {locationContent.directionApps.map((app) => (
        <a
          key={app.id}
          href={links[app.id]}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-3 py-3 border border-concrete/25 text-ink font-sans text-xs lg:text-sm font-medium hover:border-accent hover:text-accent transition-colors text-center"
        >
          {app.label}
        </a>
      ))}
    </div>
  );
}
