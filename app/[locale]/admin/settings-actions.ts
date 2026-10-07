"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const optionalCop = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : Number(v)))
  .pipe(z.number().int().min(0).max(100_000_000).nullable());

const settingsSchema = z.object({
  basico: optionalCop,
  destacado: optionalCop,
  destacado_bilingue: optionalCop,
  contact_whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(10).max(15))
    .transform((digits) => (digits.length === 10 ? `57${digits}` : digits)),
  usd_cop_rate: z.coerce.number().min(1000).max(10000),
});

export async function saveSettings(formData: FormData) {
  const locale = formData.get("locale") === "en" ? "en" : "es";
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    redirect(`/${locale}/admin/configuracion?error=1`);
  }
  const s = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert([
    {
      key: "plans",
      value: {
        basico: { price_cop: s.basico },
        destacado: { price_cop: s.destacado },
        destacado_bilingue: { price_cop: s.destacado_bilingue },
      },
      updated_at: new Date().toISOString(),
    },
    { key: "contact_whatsapp", value: s.contact_whatsapp, updated_at: new Date().toISOString() },
    { key: "usd_cop_rate", value: s.usd_cop_rate, updated_at: new Date().toISOString() },
  ]);

  if (error) {
    redirect(`/${locale}/admin/configuracion?error=1`);
  }
  revalidatePath("/", "layout");
  redirect(`/${locale}/admin/configuracion?guardado=1`);
}
