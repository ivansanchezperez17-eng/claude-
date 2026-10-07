import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

export default function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const forBusinessesHref =
    locale === "en" ? "/en/business" : "/es/negocios";

  return (
    <header className="sticky top-0 z-40 border-b border-stone/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl tracking-tight text-clay-dark">
          Visit Barichara
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/80 sm:flex">
          <Link href="/" className="hover:text-clay-dark">
            {t("home")}
          </Link>
          <Link href="/directorio" className="hover:text-clay-dark">
            {t("directory")}
          </Link>
          <NextLink href={forBusinessesHref} className="hover:text-clay-dark">
            {t("forBusinesses")}
          </NextLink>
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
