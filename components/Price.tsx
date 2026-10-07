import { useLocale, useTranslations } from "next-intl";
import type { Business } from "@/lib/types";

type PriceFields = Pick<Business, "price_type" | "price_from_cop" | "price_unit">;

export function hasPrice(business: PriceFields) {
  return business.price_type !== "fijo" || business.price_from_cop !== null;
}

export default function Price({
  business,
  usdRate,
  className,
}: {
  business: PriceFields;
  usdRate: number;
  className?: string;
}) {
  const t = useTranslations("price");
  const locale = useLocale();

  if (business.price_type === "voluntario") {
    return <span className={className}>{t("voluntary")}</span>;
  }
  if (business.price_type === "gratis") {
    return <span className={className}>{t("free")}</span>;
  }
  if (business.price_from_cop === null) return null;

  const cop = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-CO", {
    maximumFractionDigits: 0,
  }).format(business.price_from_cop);
  const unit = business.price_unit ? ` ${t(`unit.${business.price_unit}`)}` : "";

  if (locale !== "en") {
    return (
      <span className={className}>
        {t("from")} ${cop} COP{unit}
      </span>
    );
  }

  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(business.price_from_cop / usdRate);

  return (
    <span className={className}>
      {t("from")} COP {cop}
      {unit}{" "}
      <span className="whitespace-nowrap font-normal text-foreground/50">
        ({t("approxUsd", { usd })})
      </span>
    </span>
  );
}
