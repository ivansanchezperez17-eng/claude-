"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function signIn(formData: FormData) {
  const locale = formData.get("locale") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/${locale}/admin/login?error=1`);
  }

  redirect(`/${locale}/admin`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/admin/login`);
}

function businessFields(formData: FormData) {
  return {
    name: formData.get("name") as string,
    category: formData.get("category") as Category,
    zone: (formData.get("zone") as string) || null,
    description_es: (formData.get("description_es") as string) || null,
    description_en: (formData.get("description_en") as string) || null,
    phone: (formData.get("phone") as string) || null,
    whatsapp: (formData.get("whatsapp") as string) || null,
    price_range: (formData.get("price_range") as string) || null,
    price_from: (formData.get("price_from") as string) || null,
    schedule: (formData.get("schedule") as string) || null,
    duration: (formData.get("duration") as string) || null,
    map_url: (formData.get("map_url") as string) || null,
    website: (formData.get("website") as string) || null,
    instagram: (formData.get("instagram") as string) || null,
    source_url: (formData.get("source_url") as string) || null,
    is_sample: formData.get("is_sample") === "on",
    active: formData.get("active") === "on",
    next_payment_due: (formData.get("next_payment_due") as string) || null,
  };
}

export async function createBusiness(formData: FormData) {
  const locale = formData.get("locale") as string;
  const supabase = await createClient();
  const fields = businessFields(formData);
  const slug = `${slugify(fields.name)}-${randomUUID().slice(0, 4)}`;

  const { data, error } = await supabase
    .from("businesses")
    .insert({ ...fields, slug })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "No se pudo crear el negocio");
  }

  await uploadPendingPhotos(formData, data.id);

  revalidatePath(`/${locale}/admin`);
  redirect(`/${locale}/admin`);
}

export async function updateBusiness(id: string, formData: FormData) {
  const locale = formData.get("locale") as string;
  const supabase = await createClient();
  const fields = businessFields(formData);

  const { error } = await supabase.from("businesses").update(fields).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await uploadPendingPhotos(formData, id);

  revalidatePath(`/${locale}/admin`);
  redirect(`/${locale}/admin`);
}

export async function deleteBusiness(formData: FormData) {
  const id = formData.get("id") as string;
  const locale = formData.get("locale") as string;
  const supabase = await createClient();

  const { data: photos } = await supabase
    .from("business_photos")
    .select("storage_path")
    .eq("business_id", id);

  if (photos && photos.length > 0) {
    await supabase.storage
      .from("business-photos")
      .remove(photos.map((p) => p.storage_path));
  }

  await supabase.from("businesses").delete().eq("id", id);

  revalidatePath(`/${locale}/admin`);
  redirect(`/${locale}/admin`);
}

async function uploadPendingPhotos(formData: FormData, businessId: string) {
  const supabase = await createClient();
  const files = formData.getAll("photos") as File[];

  const { data: existing } = await supabase
    .from("business_photos")
    .select("position")
    .eq("business_id", businessId)
    .order("position", { ascending: false })
    .limit(1);

  let nextPosition = (existing?.[0]?.position ?? -1) + 1;

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${businessId}/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("business-photos")
      .upload(path, file, { contentType: file.type });

    if (uploadError) continue;

    await supabase.from("business_photos").insert({
      business_id: businessId,
      storage_path: path,
      position: nextPosition++,
    });
  }
}

export async function deletePhoto(formData: FormData) {
  const photoId = formData.get("photoId") as string;
  const storagePath = formData.get("storagePath") as string;
  const businessId = formData.get("businessId") as string;
  const locale = formData.get("locale") as string;

  const supabase = await createClient();
  await supabase.storage.from("business-photos").remove([storagePath]);
  await supabase.from("business_photos").delete().eq("id", photoId);

  revalidatePath(`/${locale}/admin/negocios/${businessId}`);
}
