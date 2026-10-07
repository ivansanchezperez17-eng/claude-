import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import BusinessDetail from "@/components/BusinessDetail";
import { getUsdCopRate } from "@/lib/settings";
import type { Business, BusinessPhoto } from "@/lib/types";

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("status", "aprobado")
    .maybeSingle();

  if (!business) {
    notFound();
  }

  const { data: photos } = await supabase
    .from("business_photos")
    .select("*")
    .eq("business_id", business.id)
    .order("position");

  const usdRate = await getUsdCopRate(supabase);

  return (
    <BusinessDetail
      business={business as Business}
      photos={(photos ?? []) as BusinessPhoto[]}
      locale={locale}
      usdRate={usdRate}
    />
  );
}
