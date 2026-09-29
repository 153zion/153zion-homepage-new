"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getMyStaff } from "@/lib/erp/data";
import type { Staff } from "@/lib/erp/types";

/* ─── ERP 공통 껍데기 ────────────────────────────────────────
   로그인하지 않았거나 직원으로 등록되지 않았으면 들여보내지 않습니다.
   상담일지에는 건축주 실명·연락처가 들어가기 때문입니다. [④ 권한]
──────────────────────────────────────────────────────────── */

const StaffContext = createContext<Staff | null>(null);
export function useStaff() {
  return useContext(StaffContext);
}

export default function ErpShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "nostaff">("loading");

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/erp/login");
        return;
      }
      const me = await getMyStaff();
      if (!alive) return;
      if (!me) {
        setState("nostaff");
        return;
      }
      setStaff(me);
      setState("ready");
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  if (state === "loading") {
    return <div className="p-10 text-center text-gray-500">불러오는 중…</div>;
  }

  if (state === "nostaff") {
    return (
      <div className="mx-auto max-w-lg p-10 text-center">
        <h1 className="mb-3 text-xl font-bold">직원으로 등록되지 않은 계정입니다</h1>
        <p className="mb-6 text-gray-600">
          로그인은 되었지만 이 계정이 직원 명단(staff)에 없습니다. 대표님께
          등록을 요청해주세요.
        </p>
        <button
          className="rounded-lg bg-gray-800 px-5 py-3 font-bold text-white"
          onClick={async () => {
            await supabase.auth.signOut();
            router.replace("/erp/login");
          }}
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <StaffContext.Provider value={staff}>
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white print:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
            <Link href="/erp" className="text-lg font-extrabold tracking-tight">
              153ERP <span className="text-orange-600">상담일지</span>
            </Link>
            <Link
              href="/erp/new"
              className="ml-auto rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white"
            >
              + 새 상담
            </Link>
            <span className="hidden text-sm text-gray-500 sm:inline">
              {staff?.name} {staff?.position ?? ""}
            </span>
            <button
              className="text-sm text-gray-500 underline"
              onClick={async () => {
                await supabase.auth.signOut();
                router.replace("/erp/login");
              }}
            >
              로그아웃
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </div>
    </StaffContext.Provider>
  );
}
