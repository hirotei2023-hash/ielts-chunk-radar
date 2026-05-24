// components/auth/login-form.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message === "Invalid login credentials"
        ? "邮箱或密码错误"
        : "登录失败，请重试");
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
          placeholder="输入密码"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: "#292524", color: "#fafaf9", border: "1px solid #44403c" }}
        />
      </div>

      {error && (
        <p className="rounded-lg p-2 text-xs" style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#fca5a5" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full py-2.5 text-sm font-semibold transition-colors"
        style={{ backgroundColor: "#f59e0b", color: "#1c1917" }}
      >
        {loading ? "登录中..." : "登录"}
      </button>

      <p className="text-center text-xs" style={{ color: "#a8a29e" }}>
        还没有账号？{" "}
        <Link href="/register" style={{ color: "#f59e0b" }}>去注册</Link>
      </p>

      <ForgotPasswordLink />
    </form>
  );
}

function ForgotPasswordLink() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [show, setShow] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setSent(true);
  };

  if (!show) {
    return (
      <p className="text-center text-xs">
        <button onClick={() => setShow(true)} style={{ color: "#a8a29e" }}>
          忘记密码？
        </button>
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {sent ? (
        <p className="text-center text-xs" style={{ color: "#84cc16" }}>
          密码重置链接已发送，请检查邮箱
        </p>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="输入注册邮箱"
            className="w-full rounded-lg px-3 py-2 text-xs outline-none"
            style={{ backgroundColor: "#292524", color: "#fafaf9", border: "1px solid #44403c" }}
          />
          <button
            onClick={handleReset}
            className="w-full rounded-full py-2 text-xs font-medium"
            style={{ backgroundColor: "#292524", color: "#f59e0b" }}
          >
            发送重置链接
          </button>
        </>
      )}
    </div>
  );
}
