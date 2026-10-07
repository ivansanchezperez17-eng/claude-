"use client";

import { useActionState, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { submitApplication, type ApplicationState } from "@/lib/applications";

const MAX_PHOTOS = 8;
const MAX_SIDE = 1600;
const CATEGORIES = [
  "experiencia",
  "taller",
  "transporte",
  "evento",
  "hotel",
  "restaurante",
  "comercio",
] as const;

// Reduce cada foto en el navegador (máx. 1600 px, JPEG). Así el envío cabe
// en el límite de Netlify y, de paso, se pierden los metadatos EXIF.
async function shrink(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.82),
  );
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}

const inputClass =
  "mt-1 w-full rounded-lg border border-stone bg-white px-3 py-2.5 outline-none focus:border-clay";

export default function ApplicationForm({
  locale,
  privacyHref,
}: {
  locale: string;
  privacyHref: string;
}) {
  const t = useTranslations("application");
  const [state, formAction, pending] = useActionState<ApplicationState, FormData>(
    submitApplication,
    { status: "idle" },
  );
  const [photoCount, setPhotoCount] = useState(0);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const photosRef = useRef<HTMLInputElement>(null);

  async function onPhotosChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    setPhotoError(null);
    if (files.length > MAX_PHOTOS) {
      setPhotoError(t("errors.photos.tooMany"));
      input.value = "";
      setPhotoCount(0);
      return;
    }
    setProcessing(true);
    try {
      const shrunk = await Promise.all(files.map(shrink));
      const transfer = new DataTransfer();
      shrunk.forEach((f) => transfer.items.add(f));
      input.files = transfer.files;
      setPhotoCount(shrunk.length);
    } catch {
      setPhotoError(t("errors.photos.badType"));
      input.value = "";
      setPhotoCount(0);
    } finally {
      setProcessing(false);
    }
  }

  const errors = state.errors ?? {};
  const err = (name: string) =>
    errors[name] ? (
      <span className="mt-1 block text-sm text-red-700">
        {name === "photos" ? t(`errors.photos.${errors.photos}`) : t(`errors.${name}`)}
      </span>
    ) : null;

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-2xl border border-stone bg-white p-6" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-foreground/80">
          {t("businessName")}
          <input name="business_name" required maxLength={120} className={inputClass} />
          {err("business_name")}
        </label>
        <label className="text-sm font-medium text-foreground/80">
          {t("contactName")}
          <input name="contact_name" required maxLength={120} autoComplete="name" className={inputClass} />
          {err("contact_name")}
        </label>
        <label className="text-sm font-medium text-foreground/80">
          {t("phone")}
          <input name="phone" type="tel" required maxLength={20} autoComplete="tel" placeholder="300 123 4567" className={inputClass} />
          {err("phone")}
        </label>
        <label className="text-sm font-medium text-foreground/80">
          {t("email")}
          <input name="email" type="email" maxLength={200} autoComplete="email" className={inputClass} />
          {err("email")}
        </label>
      </div>

      <label className="text-sm font-medium text-foreground/80">
        {t("category")}
        <select name="category" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            {t("categoryPlaceholder")}
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t(`categories.${c}`)}
            </option>
          ))}
        </select>
        {err("category")}
      </label>

      <label className="text-sm font-medium text-foreground/80">
        {t("description")}
        <textarea name="description" required rows={4} maxLength={1500} className={inputClass} />
        {err("description")}
      </label>

      <label className="text-sm font-medium text-foreground/80">
        {t("photos")}
        <span className="block font-normal text-foreground/60">{t("photosHint")}</span>
        <input
          ref={photosRef}
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={onPhotosChange}
          className={inputClass}
        />
        {processing && <span className="mt-1 block text-sm text-foreground/60">{t("processing")}</span>}
        {!processing && photoCount > 0 && (
          <span className="mt-1 block text-sm text-sage">{t("photosReady", { count: photoCount })}</span>
        )}
        {photoError ? <span className="mt-1 block text-sm text-red-700">{photoError}</span> : err("photos")}
      </label>

      <label className="flex items-start gap-3 text-sm text-foreground/80">
        <input type="checkbox" name="authorized" required className="mt-0.5 h-5 w-5 shrink-0" />
        <span>{t("authorize")}</span>
      </label>
      {err("authorized")}

      <label className="flex items-start gap-3 text-sm text-foreground/80">
        <input type="checkbox" name="privacy_accepted" required className="mt-0.5 h-5 w-5 shrink-0" />
        <span>
          {t.rich("privacy", {
            link: (chunks) => (
              <a href={privacyHref} target="_blank" className="underline">
                {chunks}
              </a>
            ),
          })}
        </span>
      </label>
      {err("privacy_accepted")}

      {errors.form && <p className="text-sm text-red-700">{t("errors.server")}</p>}

      <button
        type="submit"
        disabled={pending || processing}
        className="self-start rounded-full bg-clay px-7 py-3 font-medium text-white transition-colors hover:bg-clay-dark disabled:opacity-50"
      >
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
