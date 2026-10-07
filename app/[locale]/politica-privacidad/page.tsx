import { setRequestLocale } from "next-intl/server";
import PrivacyPolicyPage from "@/components/PrivacyPolicyPage";

export default async function PoliticaPrivacidadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyPolicyPage />;
}
