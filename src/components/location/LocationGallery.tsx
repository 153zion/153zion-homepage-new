import Image from "next/image";
import { locationContent } from "@/lib/content";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

/* ─── 사옥·주차 사진 갤러리 ──────────────────────────────────── */
export default function LocationGallery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {locationContent.gallery.map((item, i) => (
        <div key={i} className="relative w-full aspect-[4/3] overflow-hidden">
          {item.image.startsWith("/images/placeholder/") ? (
            <PlaceholderImage alt={item.alt} className="w-full h-full" />
          ) : (
            <Image src={item.image} alt={item.alt} fill className="object-cover" />
          )}
        </div>
      ))}
    </div>
  );
}
