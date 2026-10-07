import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";

const CONTACT_EMAIL = "ivansanchezperez17@gmail.com";

export default function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const forBusinessesHref =
    locale === "en" ? "/en/business" : "/es/negocios";
  const privacyHref =
    locale === "en" ? "/en/privacy-policy" : "/es/politica-privacidad";

  return (
    <footer className="border-t border-stone/80 py-10 text-center text-sm text-foreground/60">
      <p>© {new Date().getFullYear()} Visit Barichara</p>
      <p className="mx-auto mt-2 max-w-md px-6">{t("disclaimer")}</p>
      <nav className="mt-4 flex flex-wrap items-center justify-center gap-4">
        <NextLink href={forBusinessesHref} className="hover:text-clay-dark">
          {tNav("forBusinesses")}
        </NextLink>
        <NextLink href={privacyHref} className="hover:text-clay-dark">
          {t("privacyPolicy")}
        </NextLink>
        <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-clay-dark">
          {t("contact")}: {CONTACT_EMAIL}
        </a>
      </nav>
    </footer>
  );
}
