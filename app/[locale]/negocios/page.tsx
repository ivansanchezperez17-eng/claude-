import { setRequestLocale } from "next-intl/server";
import ForBusinessesPage from "@/components/ForBusinessesPage";

export default async function NegociosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ForBusinessesPage />;
}
