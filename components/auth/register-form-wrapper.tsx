"use client";

import dynamic from "next/dynamic";

export const RegisterForm = dynamic(
  () => import("@/components/auth/register-form").then((mod) => mod.RegisterForm),
  { ssr: false }
);
