import { notFound } from "next/navigation";
import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { photoUrl } from "@/lib/supabase/storage";
import type { Business, BusinessPhoto } from "@/lib/types";

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (!business) {
    notFound();
  }

  const typedBusiness = business as Business;

  const { data: photos } = await supabase
    .from("business_photos")
    .select("*")
    .eq("business_id", typedBusiness.id)
    .order("position");

  const t = await getTranslations("business");
  const tCategories = await getTranslations("home.categories");
  const currentLocale = await getLocale();
  const description =
    currentLocale === "en"
      ? typedBusiness.description_en
      : typedBusiness.description_es;

  const photoList = (photos ?? []) as BusinessPhoto[];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {photoList.length > 0 && (
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {photoList.map((photo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.id}
              src={photoUrl(photo.storage_path)}
              alt={typedBusiness.name}
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      )}

      <span className="text-xs font-medium uppercase tracking-wide text-sage">
        {tCategories(typedBusiness.category)}
      </span>
      <h1 className="mt-1 font-serif text-4xl text-clay-dark">
        {typedBusiness.name}
      </h1>

      {description && (
        <p className="mt-4 text-foreground/80">{description}</p>
      )}

      {typedBusiness.is_sample && (
        <p className="mt-4 rounded-xl bg-stone/60 px-4 py-2 text-sm text-foreground/60">
          {t("sampleNotice")}
        </p>
      )}

      <dl className="mt-8 grid gap-4 rounded-2xl border border-stone bg-white p-6 sm:grid-cols-2">
        {typedBusiness.zone && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-foreground/50">
              {t("zone")}
            </dt>
            <dd className="mt-1">{typedBusiness.zone}</dd>
          </div>
        )}
        {typedBusiness.price_from && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-foreground/50">
              {t("priceFrom")}
            </dt>
            <dd className="mt-1">{typedBusiness.price_from}</dd>
          </div>
        )}
        {typedBusiness.price_range && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-foreground/50">
              {t("priceRange")}
            </dt>
            <dd className="mt-1">{typedBusiness.price_range}</dd>
          </div>
        )}
        {typedBusiness.schedule && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-foreground/50">
              {t("schedule")}
            </dt>
            <dd className="mt-1">{typedBusiness.schedule}</dd>
          </div>
        )}
        {typedBusiness.duration && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-foreground/50">
              {t("duration")}
            </dt>
            <dd className="mt-1">{typedBusiness.duration}</dd>
          </div>
        )}
        {typedBusiness.phone && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-foreground/50">
              {t("contact")}
            </dt>
            <dd className="mt-1">{typedBusiness.phone}</dd>
          </div>
        )}
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        {typedBusiness.whatsapp && (
          <a
            href={`/go/${typedBusiness.slug}?lang=${currentLocale}`}
            className="inline-block rounded-full bg-sage px-6 py-3 font-medium text-white transition-colors hover:bg-sage/90"
          >
            {t("whatsapp")}
          </a>
        )}
        {typedBusiness.map_url && (
          <a
            href={typedBusiness.map_url}
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
