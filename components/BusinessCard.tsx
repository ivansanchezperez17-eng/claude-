import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { photoUrl } from "@/lib/supabase/storage";
import type { Business, BusinessPhoto } from "@/lib/types";

export default function BusinessCard({
  business,
  photo,
}: {
  business: Business;
  photo?: BusinessPhoto;
}) {
  const locale = useLocale();
  const t = useTranslations("home.categories");
  const description =
    locale === "en" ? business.description_en : business.description_es;

  return (
    <Link
      href={`/negocio/${business.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full bg-stone">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl(photo.storage_path)}
            alt={business.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-foreground/40">
            {business.name}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-sage">
          {t(business.category)}
        </span>
        <h3 className="font-serif text-lg text-clay-dark">{business.name}</h3>
        {description && (
          <p className="line-clamp-2 text-sm text-foreground/70">
            {description}
          </p>
        )}
        {business.zone && (
          <span className="mt-auto pt-2 text-xs text-foreground/50">
            {business.zone}
          </span>
        )}
      </div>
    </Link>
  );
}
