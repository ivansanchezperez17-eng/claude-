"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEMO_COOKIE } from "@/lib/demo";

function safeLocale(value: FormDataEntryValue | null) {
  return value === "en" ? "en" : "es";
}

export async function enterDemo(formData: FormData) {
  const locale = safeLocale(formData.get("locale"));
  const password = String(formData.get("password") ?? "").slice(0, 200);

  const supabase = await createClient();
  const { data: ok } = await supabase.rpc("demo_check", { p_password: password });

  if (ok !== true) {
    redirect(`/${locale}/demo?error=1`);
  }

  const cookieStore = await cookies();
  cookieStore.set(DEMO_COOKIE, password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(`/${locale}/demo`);
}

export async function exitDemo(formData: FormData) {
  const locale = safeLocale(formData.get("locale"));
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_COOKIE);
  redirect(`/${locale}`);
}
