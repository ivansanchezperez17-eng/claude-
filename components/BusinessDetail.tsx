import { useTranslations } from "next-intl";
import { photoUrl } from "@/lib/supabase/storage";
import type { Business, BusinessPhoto } from "@/lib/types";
import Price, { hasPrice } from "./Price";

export default function BusinessDetail({
  business,
  photos,
  locale,
  usdRate,
  preview = false,
}: {
  business: Business;
  photos: BusinessPhoto[];
  locale: string;
  usdRate: number;
  preview?: boolean;
}) {
  const t = useTranslations("business");
  const tCategories = useTranslations("home.categories");
  const description =
    locale === "en" ? business.description_en : business.description_es;

  const facts: { label: string; value: React.ReactNode }[] = [
    { label: t("zone"), value: business.zone },
    {
      label: t("priceFrom"),
      value: hasPrice(business) ? <Price business={business} usdRate={usdRate} /> : null,
    },
    { label: t("priceRange"), value: business.price_range },
    { label: t("schedule"), value: business.schedule },
    { label: t("duration"), value: business.duration },
    { label: t("contact"), value: business.phone },
  ];
  const visibleFacts = facts.filter((f) => f.value);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {photos.length > 0 && (
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {photos.map((photo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.id}
              src={photoUrl(photo.storage_path)}
              alt={business.name}
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      )}

      <span className="text-xs font-medium uppercase tracking-wide text-sage">
        {tCategories(business.category)}
      </span>
      <h1 className="mt-1 font-serif text-4xl text-clay-dark">
        {business.name}
      </h1>

      {description && <p className="mt-4 text-foreground/80">{description}</p>}

      {business.is_sample && (
        <p className="mt-4 rounded-xl bg-stone/60 px-4 py-2 text-sm text-foreground/60">
          {t("sampleNotice")}
        </p>
      )}

      {visibleFacts.length > 0 && (
        <dl className="mt-8 grid gap-4 rounded-2xl border border-stone bg-white p-6 sm:grid-cols-2">
          {visibleFacts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs uppercase tracking-wide text-foreground/50">
                {fact.label}
              </dt>
              <dd className="mt-1">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {business.whatsapp &&
          (preview ? (
            <span className="inline-block cursor-default rounded-full bg-sage/60 px-6 py-3 font-medium text-white">
              {t("whatsapp")}
            </span>
          ) : (
            <a
              href={`/go/${business.slug}?lang=${locale}`}
              className="inline-block rounded-full bg-sage px-6 py-3 font-medium text-white transition-colors hover:bg-sage/90"
            >
              {t("whatsapp")}
            </a>
          ))}
        {business.map_url && (
          <a
            href={business.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-stone px-6 py-3 font-medium text-clay-dark transition-colors hover:bg-stone/40"
          >
            {t("map")}
          </a>
        )}
      </div>
    </div>
  );
}
