import { useTranslations } from "next-intl";
import { photoUrl } from "@/lib/supabase/storage";
import type { Business, BusinessPhoto } from "@/lib/types";
import BusinessCard from "./BusinessCard";
import Price, { hasPrice } from "./Price";
import WhatsAppButton, { StickyWhatsAppBar } from "./WhatsAppButton";

function mapQuery(business: Business) {
  return [business.name, business.zone, "Barichara, Santander, Colombia"]
    .filter(Boolean)
    .join(", ");
}

function PhotoComingSoon({ label }: { label: string }) {
  return (
    <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-stone to-sand/40 text-clay-dark/70">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h1.6l1.2-1.8A1 1 0 0 1 9.1 3h5.8a1 1 0 0 1 .8.4L16.9 5h1.6A2.5 2.5 0 0 1 21 7.5v10a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" />
        <circle cx="12" cy="12.5" r="3.5" />
      </svg>
      <span className="font-serif text-lg">{label}</span>
    </div>
  );
}

function Gallery({ photos, name, comingSoon }: { photos: BusinessPhoto[]; name: string; comingSoon: string }) {
  if (photos.length === 0) return <PhotoComingSoon label={comingSoon} />;
  const [main, ...rest] = photos;
  return (
    <div className="grid gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl(main.storage_path)}
        alt={name}
        className="aspect-[16/9] w-full rounded-2xl object-cover"
      />
      {rest.length > 0 && (
        <div className="flex snap-x gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
          {rest.map((photo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.id}
              src={photoUrl(photo.storage_path)}
              alt={`${name} — ${i + 2}`}
              loading="lazy"
              className="aspect-[4/3] w-40 shrink-0 snap-start rounded-xl object-cover sm:w-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BusinessDetail({
  business,
  photos,
  related,
  locale,
  usdRate,
  preview = false,
}: {
  business: Business;
  photos: BusinessPhoto[];
  related: Business[];
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
    { label: t("priceRange"), value: business.price_range },
    { label: t("schedule"), value: business.schedule },
    { label: t("duration"), value: business.duration },
    { label: t("contact"), value: business.phone },
  ];
  const visibleFacts = facts.filter((f) => f.value);

  const query = encodeURIComponent(mapQuery(business));
  const mapEmbed = `https://www.google.com/maps?q=${query}&output=embed&hl=${locale}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Gallery photos={photos} name={business.name} comingSoon={t("photoComingSoon")} />

      <div className="mt-8">
        <span className="text-xs font-medium uppercase tracking-wide text-sage">
          {tCategories(business.category)}
        </span>
        <h1 className="mt-1 font-serif text-4xl text-clay-dark">{business.name}</h1>
        {hasPrice(business) && (
          <Price
            business={business}
            usdRate={usdRate}
            className="mt-2 block text-lg font-medium text-foreground/80"
          />
        )}
      </div>

      {business.whatsapp && (
        <div className="mt-6">
          <WhatsAppButton
            slug={business.slug}
            locale={locale}
            label={t("whatsapp")}
            preview={preview}
            className="w-full sm:w-auto"
          />
        </div>
      )}

      {description && <p className="mt-6 text-foreground/80">{description}</p>}

      {business.is_sample && (
        <p className="mt-4 rounded-xl bg-stone/60 px-4 py-2 text-sm text-foreground/60">
          {t("sampleNotice")}
        </p>
      )}

      {visibleFacts.length > 0 && (
        <dl className="mt-8 grid gap-4 rounded-2xl border border-stone bg-white p-6 sm:grid-cols-2">
          {visibleFacts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs uppercase tracking-wide text-foreground/50">{fact.label}</dt>
              <dd className="mt-1">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <section className="mt-10">
        <h2 className="font-serif text-2xl text-clay-dark">{t("mapTitle")}</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone bg-stone">
          <iframe
            src={mapEmbed}
            title={t("mapFrameTitle", { name: business.name })}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block aspect-[4/3] w-full sm:aspect-[16/9]"
          />
        </div>
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-full border border-stone px-6 py-3 font-medium text-clay-dark transition-colors hover:bg-stone/40"
        >
          {t("directions")}
        </a>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-clay-dark">{t("related")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <BusinessCard
                key={item.id}
                business={item}
                usdRate={usdRate}
                basePath={preview ? "/demo" : "/negocio"}
              />
            ))}
          </div>
        </section>
      )}

      {business.whatsapp && (
        <StickyWhatsAppBar
          slug={business.slug}
          locale={locale}
          label={t("whatsapp")}
          preview={preview}
        />
      )}
    </div>
  );
}
