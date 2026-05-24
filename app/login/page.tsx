// app/login/page.tsx

import { LoginForm } from "@/components/auth/login-form-wrapper";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: "#1c1917" }}>
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-xl font-bold" style={{ color: "#f59e0b" }}>
          雅思词块雷达
        </h1>
        <p className="mb-6 text-center text-sm" style={{ color: "#a8a29e" }}>
          登录以同步学习数据
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
