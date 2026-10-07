"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const CATEGORIES = [
  "experiencia",
  "taller",
  "transporte",
  "evento",
  "hotel",
  "restaurante",
  "comercio",
] as const;

const MAX_PHOTOS = 8;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

const applicationSchema = z.object({
  business_name: z.string().trim().min(2).max(120),
  contact_name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+ ()-]{7,20}$/),
  email: z
    .union([z.literal(""), z.string().trim().email().max(200)])
    .transform((v) => (v === "" ? null : v)),
  category: z.enum(CATEGORIES),
  description: z.string().trim().min(10).max(1500),
  authorized: z.literal("on"),
  privacy_accepted: z.literal("on"),
});

export type ApplicationState = {
  status: "idle" | "error";
  errors?: Partial<Record<string, string>>;
};

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function submitApplication(
  _prev: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const locale = formData.get("locale") === "en" ? "en" : "es";

  // Trampa para bots: un campo oculto que una persona nunca llena.
  if (field(formData, "website")) {
    redirect(`/${locale}/${locale === "en" ? "business" : "negocios"}?enviado=1`);
  }

  const parsed = applicationSchema.safeParse({
    business_name: field(formData, "business_name"),
    contact_name: field(formData, "contact_name"),
    phone: field(formData, "phone"),
    email: field(formData, "email"),
    category: field(formData, "category"),
    description: field(formData, "description"),
    authorized: field(formData, "authorized"),
    privacy_accepted: field(formData, "privacy_accepted"),
  });

  const errors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      errors[key] ??= key;
    }
  }

  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_PHOTOS) errors.photos = "tooMany";
  else if (files.some((f) => f.size > MAX_PHOTO_BYTES)) errors.photos = "tooBig";
  else if (files.some((f) => !PHOTO_TYPES.includes(f.type))) errors.photos = "badType";

  if (!parsed.success || Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }

  // Re-codifica cada foto: confirma que es una imagen real, aplica la
  // rotación y elimina todos los metadatos (incluida la ubicación GPS).
  const cleaned: Buffer[] = [];
  for (const file of files) {
    try {
      const input = Buffer.from(await file.arrayBuffer());
      cleaned.push(
        await sharp(input)
          .rotate()
          .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 82, mozjpeg: true })
          .toBuffer(),
      );
    } catch {
      return { status: "error", errors: { photos: "badType" } };
    }
  }

  const supabase = await createClient();
  const folder = `pending/${randomUUID()}`;
  const photoPaths: string[] = [];
  for (const [i, buffer] of cleaned.entries()) {
    const path = `${folder}/${i + 1}.jpg`;
    const { error } = await supabase.storage
      .from("applications")
      .upload(path, buffer, { contentType: "image/jpeg", upsert: false });
    if (error) return { status: "error", errors: { form: "server" } };
    photoPaths.push(path);
  }

  const { error } = await supabase.from("business_applications").insert({
    ...parsed.data,
    authorized: true,
    privacy_accepted: true,
    photo_paths: photoPaths,
    locale,
  });
  if (error) return { status: "error", errors: { form: "server" } };

  redirect(`/${locale}/${locale === "en" ? "business" : "negocios"}?enviado=1`);
}
