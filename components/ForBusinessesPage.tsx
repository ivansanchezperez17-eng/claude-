import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getContactWhatsapp, getPlanPrices, getUsdCopRate } from "@/lib/settings";
import type { BusinessPlan } from "@/lib/types";
import ApplicationForm from "./ApplicationForm";
import WhatsAppIconLink from "./WhatsAppIconLink";

const PLAN_KEYS: BusinessPlan[] = ["basico", "destacado", "destacado_bilingue"];

export default async function ForBusinessesPage({
  locale,
  sent,
}: {
  locale: string;
  sent: boolean;
}) {
  const t = await getTranslations("forBusinesses");
  const supabase = await createClient();
  const [whatsapp, plans, usdRate] = await Promise.all([
    getContactWhatsapp(supabase),
    getPlanPrices(supabase),
    getUsdCopRate(supabase),
  ]);

  const whatsappHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(t("whatsappMessage"))}`;
  const privacyHref = locale === "en" ? "/en/privacy-policy" : "/es/politica-privacidad";

  function priceLabel(plan: BusinessPlan) {
    const cop = plans[plan].price_cop;
    if (cop === null) return t("priceToAgree");
    const formatted = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-CO").format(cop);
    if (locale !== "en") return t("pricePerMonth", { price: `$${formatted} COP` });
    const usd = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(cop / usdRate);
    return `${t("pricePerMonth", { price: `COP ${formatted}` })} (≈ ${usd}, approximate)`;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-center font-serif text-3xl text-clay-dark sm:text-4xl">{t("title")}</h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-foreground/70">{t("subtitle")}</p>

      <div className="mt-8 text-center">
        <WhatsAppIconLink href={whatsappHref} label={t("ctaWhatsapp")} />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {PLAN_KEYS.map((plan) => (
          <div key={plan} className="flex flex-col rounded-2xl border border-stone bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg text-clay-dark">{t(`plans.${plan}.name`)}</h2>
            <p className="mt-2 flex-1 text-sm text-foreground/70">{t(`plans.${plan}.description`)}</p>
            <p className="mt-4 font-medium text-sage">{priceLabel(plan)}</p>
          </div>
        ))}
      </div>

      <section id="inscripcion" className="mt-16 scroll-mt-24">
        <h2 className="font-serif text-2xl text-clay-dark">{t("formTitle")}</h2>
        <p className="mt-2 text-foreground/70">{t("formSubtitle")}</p>
        <div className="mt-6">
          {sent ? (
            <div role="status" className="rounded-2xl border border-sage/30 bg-sage/10 p-6 text-foreground/80">
              <p className="font-serif text-xl text-sage">{t("sentTitle")}</p>
              <p className="mt-2">{t("sentBody")}</p>
            </div>
          ) : (
            <ApplicationForm locale={locale} privacyHref={privacyHref} />
          )}
        </div>
      </section>
    </div>
  );
}
