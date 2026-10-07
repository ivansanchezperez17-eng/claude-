import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import BusinessCard from "@/components/BusinessCard";
import type { Business, BusinessPhoto, Category } from "@/lib/types";

const categories: Category[] = ["hotel", "restaurante", "comercio"];

export default async function DirectoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; zone?: string; q?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { category, zone, q } = await searchParams;

  const t = await getTranslations("directory");
  const tCategories = await getTranslations("home.categories");

  const supabase = await createClient();

  let query = supabase
    .from("businesses")
    .select("*")
    .eq("active", true)
    .order("name");

  if (category && categories.includes(category as Category)) {
    query = query.eq("category", category);
  }
  if (zone) {
    query = query.eq("zone", zone);
  }
  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  const { data: businesses } = await query;
  const list = (businesses ?? []) as Business[];

  const ids = list.map((b) => b.id);
  let photoMap = new Map<string, BusinessPhoto>();
  if (ids.length > 0) {
    const { data: photos } = await supabase
      .from("business_photos")
      .select("*")
      .in("business_id", ids)
      .eq("position", 0);
    for (const photo of (photos ?? []) as BusinessPhoto[]) {
      photoMap.set(photo.business_id, photo);
    }
  }

  const { data: zonesData } = await supabase
    .from("businesses")
    .select("zone")
    .eq("active", true)
    .not("zone", "is", null);
  const zones = Array.from(
    new Set((zonesData ?? []).map((z) => z.zone as string)),
  ).sort();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-serif text-3xl text-clay-dark">{t("title")}</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <FilterLink
          active={!category}
          href={{ zone, q }}
          label={t("all")}
        />
        {categories.map((c) => (
          <FilterLink
            key={c}
            active={category === c}
            href={{ category: c, zone, q }}
            label={tCategories(c)}
          />
        ))}

        {zones.length > 0 && (
          <div className="ml-auto flex flex-wrap gap-2">
            {zones.map((z) => (
              <FilterLink
                key={z}
                active={zone === z}
                href={{ category, zone: zone === z ? undefined : z, q }}
                label={z}
                subtle
              />
            ))}
          </div>
        )}
      </div>

      {list.length === 0 ? (
        <p className="mt-16 text-center text-foreground/60">{t("empty")}</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              photo={photoMap.get(business.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterLink({
  active,
  href,
  label,
  subtle,
}: {
  active: boolean;
  href: { category?: string; zone?: string; q?: string };
  label: string;
  subtle?: boolean;
}) {
  const params = new URLSearchParams();
  if (href.category) params.set("category", href.category);
  if (href.zone) params.set("zone", href.zone);
  if (href.q) params.set("q", href.q);
  const search = params.toString();

  return (
    <Link
      href={`/directorio${search ? `?${search}` : ""}`}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-clay text-white"
          : subtle
            ? "bg-white text-foreground/60 ring-1 ring-stone hover:text-foreground"
            : "bg-stone text-foreground/70 hover:bg-stone/70"
      }`}
    >
      {label}
    </Link>
  );
}
