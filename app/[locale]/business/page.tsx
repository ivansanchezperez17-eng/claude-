import { setRequestLocale } from "next-intl/server";
import ForBusinessesPage from "@/components/ForBusinessesPage";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ enviado?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { enviado } = await searchParams;
  return <ForBusinessesPage locale={locale} sent={enviado === "1"} />;
}
