import { createClient } from "@supabase/supabase-js";

/* ─── Supabase 클라이언트 ──────────────────────────────────────
   회사ERP의 문의관리.html과 같은 프로젝트/테이블(inquiries)을 사용합니다.
──────────────────────────────────────────────────────────── */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
