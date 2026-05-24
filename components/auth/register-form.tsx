// components/auth/register-form.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const BAND_OPTIONS = ["5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0"];

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetBand, setTargetBand] = useState("6.0");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password.length < 6) {
      setError("密码至少需要 6 位");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { target_band: targetBand },
      },
    });

    if (error) {
      setError(error.message === "User already registered"
        ? "该邮箱已注册"
        : "注册失败，请重试");
    } else {
      setSuccess("注册成功！请检查邮箱确认链接（如未收到，可直接登录）。");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm" style={{ color: "#a8a29e" }}>邮箱</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: "#292524", color: "#fafaf9", border: "1px solid #44403c" }}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm" style={{ color: "#a8a29e" }}>密码</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="至少 6 位"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: "#292524", color: "#fafaf9", border: "1px solid #44403c" }}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm" style={{ color: "#a8a29e" }}>目标分数</label>
        <select
          value={targetBand}
          onChange={(e) => setTargetBand(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: "#292524", color: "#fafaf9", border: "1px solid #44403c" }}
        >
          {BAND_OPTIONS.map((b) => (
            <option key={b} value={b}>Band {b}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="rounded-lg p-2 text-xs" style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#fca5a5" }}>
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-lg p-2 text-xs" style={{ backgroundColor: "rgba(132,204,22,0.15)", color: "#bef264" }}>
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full py-2.5 text-sm font-semibold transition-colors"
        style={{ backgroundColor: "#f59e0b", color: "#1c1917" }}
      >
        {loading ? "注册中..." : "注册"}
      </button>

      <p className="text-center text-xs" style={{ color: "#a8a29e" }}>
        已有账号？{" "}
        <Link href="/login" style={{ color: "#f59e0b" }}>去登录</Link>
      </p>
    </form>
  );
}
