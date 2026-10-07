"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Convierte una solicitud del formulario en un negocio en borrador.
// El negocio dio su autorización en el formulario; queda en borrador hasta
// que lo apruebes en el panel.
export async function convertApplication(formData: FormData) {
  const locale = formData.get("locale") === "en" ? "en" : "es";
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();

  const { data: app } = await supabase
    .from("business_applications")
    .select("*")
    .eq("id", id)
    .eq("status", "nueva")
    .maybeSingle();
  if (!app) redirect(`/${locale}/admin/solicitudes?error=1`);

  const phoneDigits = String(app.phone).replace(/\D/g, "");
  const whatsapp = phoneDigits.length === 10 ? `57${phoneDigits}` : phoneDigits;

  const { data: business, error } = await supabase
    .from("businesses")
    .insert({
      name: app.business_name,
      slug: `${slugify(app.business_name)}-${randomUUID().slice(0, 4)}`,
      category: app.category,
      description_es: app.description,
      phone: app.phone,
      whatsapp,
      status: "borrador",
      authorization_channel: "formulario",
      authorized_by: app.contact_name,
      authorized_at: app.created_at,
    })
    .select("id")
    .single();
  if (error || !business) redirect(`/${locale}/admin/solicitudes?error=1`);

  // Copia las fotos enviadas al bucket de fotos de negocios.
  let position = 0;
  for (const path of (app.photo_paths ?? []) as string[]) {
    const { data: file } = await supabase.storage.from("applications").download(path);
    if (!file) continue;
    const target = `${business.id}/${randomUUID()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("business-photos")
      .upload(target, file, { contentType: "image/jpeg" });
    if (uploadError) continue;
    await supabase
      .from("business_photos")
      .insert({ business_id: business.id, storage_path: target, position: position++ });
  }

  await supabase
    .from("business_applications")
    .update({ status: "convertida", business_id: business.id })
    .eq("id", id);

  revalidatePath(`/${locale}/admin`, "layout");
  redirect(`/${locale}/admin/negocios/${business.id}`);
}

export async function discardApplication(formData: FormData) {
  const locale = formData.get("locale") === "en" ? "en" : "es";
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("business_applications").update({ status: "descartada" }).eq("id", id);
  revalidatePath(`/${locale}/admin/solicitudes`);
  redirect(`/${locale}/admin/solicitudes`);
}
