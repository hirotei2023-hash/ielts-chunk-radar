// app/register/page.tsx

import { RegisterForm } from "@/components/auth/register-form-wrapper";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: "#1c1917" }}>
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-xl font-bold" style={{ color: "#f59e0b" }}>
          创建账号
        </h1>
        <p className="mb-6 text-center text-sm" style={{ color: "#a8a29e" }}>
          开始你的雅思词块学习之旅
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}
