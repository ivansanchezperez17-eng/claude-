import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { photoUrl } from "@/lib/supabase/storage";
import type { Business, BusinessPhoto } from "@/lib/types";
import Price, { hasPrice } from "./Price";

export default function BusinessCard({
  business,
  photo,
  usdRate,
  basePath = "/negocio",
  showStatus = false,
}: {
  business: Business;
  photo?: BusinessPhoto;
  usdRate: number;
  basePath?: "/negocio" | "/demo";
  showStatus?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("home.categories");
  const tDirectory = useTranslations("directory");
  const tStatus = useTranslations("status");
  const tBusiness = useTranslations("business");
  const description =
    locale === "en" ? business.description_en : business.description_es;

  return (
    <Link
      href={`${basePath}/${business.slug}`}
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
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone to-sand/40 text-clay-dark/60">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h1.6l1.2-1.8A1 1 0 0 1 9.1 3h5.8a1 1 0 0 1 .8.4L16.9 5h1.6A2.5 2.5 0 0 1 21 7.5v10a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" />
              <circle cx="12" cy="12.5" r="3.5" />
            </svg>
            <span className="text-xs font-medium">{tBusiness("photoComingSoon")}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-sage">
            {t(business.category)}
          </span>
          {business.is_sample ? (
            <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground/50">
              {tDirectory("sampleBadge")}
            </span>
          ) : (
            showStatus && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                  business.status === "aprobado"
                    ? "bg-sage/15 text-sage"
                    : "bg-clay/15 text-clay-dark"
                }`}
              >
                {tStatus(business.status)}
              </span>
            )
          )}
        </div>
        <h3 className="font-serif text-lg text-clay-dark">{business.name}</h3>
        {hasPrice(business) && (
          <Price
            business={business}
            usdRate={usdRate}
            className="text-xs font-medium text-clay-dark"
          />
        )}
        {description && (
          <p className="line-clamp-2 text-sm text-foreground/70">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
