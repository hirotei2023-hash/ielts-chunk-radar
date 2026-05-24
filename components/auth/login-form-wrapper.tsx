"use client";

import dynamic from "next/dynamic";

export const LoginForm = dynamic(
  () => import("@/components/auth/login-form").then((mod) => mod.LoginForm),
  { ssr: false }
);
