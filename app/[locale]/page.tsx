import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const categories = ["hotel", "restaurante", "comercio"] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Home />;
}

function Home() {
  const t = useTranslations("home");

  return (
    <div>
      <section className="bg-gradient-to-b from-clay-dark to-clay px-6 py-24 text-center text-white sm:py-32">
        <h1 className="mx-auto max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
          {t("subtitle")}
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
            className="bg-sage px-6 py-3 font-medium text-white transition-colors hover:bg-sage/90"
          >
            {t("exploreCta")}
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
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
      </section>
    </div>
  );
}
