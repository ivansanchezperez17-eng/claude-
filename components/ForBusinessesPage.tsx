import { useLocale, useTranslations } from "next-intl";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_SOLUTIONS_WHATSAPP ?? "";
const PLAN_KEYS = ["basico", "destacado", "destacadoBilingue"] as const;

export default function ForBusinessesPage() {
  const t = useTranslations("forBusinesses");
  const locale = useLocale();

  const whatsappHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        locale === "en"
          ? "Hi, I'd like to list my business on Visit Barichara"
          : "Hola, quiero aparecer con mi negocio en Visit Barichara",
      )}`
    : undefined;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-center font-serif text-3xl text-clay-dark sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-foreground/70">
        {t("subtitle")}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {PLAN_KEYS.map((plan) => (
          <div
            key={plan}
            className="flex flex-col rounded-2xl border border-stone bg-white p-6 shadow-sm"
          >
            <h2 className="font-serif text-lg text-clay-dark">
              {t(`plans.${plan}.name`)}
            </h2>
            <p className="mt-2 flex-1 text-sm text-foreground/70">
              {t(`plans.${plan}.description`)}
            </p>
            <p className="mt-4 text-sm font-medium text-sage">
              {t(`plans.${plan}.price`)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-sage px-6 py-3 font-medium text-white transition-colors hover:bg-sage/90"
          >
            {t("ctaWhatsapp")}
          </a>
        ) : (
          <p className="text-sm text-foreground/50">
            {t("ctaWhatsapp")} — próximamente
          </p>
        )}
      </div>
    </div>
  );
}
