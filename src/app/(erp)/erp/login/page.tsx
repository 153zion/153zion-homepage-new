"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

/* ─── ERP 로그인 ────────────────────────────────────────────
   계정은 대표님이 수파베이스에서 직원별로 만들어 나눠줍니다. [④ 권한]
──────────────────────────────────────────────────────────── */
export default function ErpLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError("이메일 또는 비밀번호가 맞지 않습니다");
      return;
    }
    router.replace("/erp");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6"
      >
        <h1 className="mb-1 text-2xl font-extrabold">153ERP</h1>
        <p className="mb-6 text-sm text-gray-500">상담일지 — 직원 전용</p>

        <label className="mb-1 block text-sm font-bold text-gray-700">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-3 text-base"
          autoComplete="username"
          required
        />

        <label className="mb-1 block text-sm font-bold text-gray-700">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-5 w-full rounded-lg border border-gray-300 px-3 py-3 text-base"
          autoComplete="current-password"
          required
        />

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-orange-600 py-4 text-lg font-bold text-white disabled:opacity-50"
        >
          {busy ? "확인 중…" : "로그인"}
        </button>
      </form>
    </div>
  );
}
