import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { attractions } from "@/lib/attractions";

const categories = ["hotel", "restaurante", "comercio"] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Home locale={locale} />;
}

function Home({ locale }: { locale: string }) {
  const t = useTranslations("home");
  const tAttractions = useTranslations("attractions");

  return (
    <div>
      <section className="bg-gradient-to-b from-clay-dark to-clay px-6 py-24 text-center text-white sm:py-32">
        <h1 className="mx-auto max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
          {t("subtitle")}
        </p>
        <a
          href="#que-hacer"
          className="mt-8 inline-block rounded-full bg-sage px-6 py-3 font-medium text-white transition-colors hover:bg-sage/90"
        >
          {t("exploreCta")}
        </a>
      </section>

      <section id="que-hacer" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center font-serif text-3xl text-clay-dark">
          {tAttractions("sectionTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/70">
          {tAttractions("sectionSubtitle")}
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {attractions.map((attraction) => {
            const title =
              locale === "en" ? attraction.title_en : attraction.title_es;
            const description =
              locale === "en"
                ? attraction.description_en
                : attraction.description_es;
            return (
              <div
                key={attraction.slug}
                className="flex flex-col rounded-2xl border border-stone bg-white p-6 shadow-sm"
              >
                <span className="text-3xl">{attraction.emoji}</span>
                <h3 className="mt-3 font-serif text-lg text-clay-dark">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-foreground/70">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-stone/40 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-serif text-3xl text-clay-dark">
            {t("stayTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/70">
            {t("staySubtitle")}
          </p>

          <form
            action="/directorio"
            className="mx-auto mt-8 flex max-w-lg overflow-hidden rounded-full bg-white shadow-lg"
          >
            <input
              name="q"
              placeholder={t("searchPlaceholder")}
              className="flex-1 px-5 py-3 text-foreground outline-none"
            />
            <button
              type="submit"
              className="bg-clay px-6 py-3 font-medium text-white transition-colors hover:bg-clay-dark"
            >
              {t("searchCta")}
            </button>
          </form>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/directorio?category=${category}`}
                className="group rounded-2xl border border-stone bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <span className="font-serif text-2xl text-clay-dark">
                  {t(`categories.${category}`)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
