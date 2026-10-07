import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import BusinessDetail from "@/components/BusinessDetail";
import { getUsdCopRate } from "@/lib/settings";
import type { Business, BusinessPhoto } from "@/lib/types";

async function relatedBusinesses(
  supabase: Awaited<ReturnType<typeof createClient>>,
  business: Business,
) {
  const { data: sameCategory } = await supabase
    .from("businesses")
    .select("*")
    .eq("status", "aprobado")
    .eq("category", business.category)
    .neq("id", business.id)
    .limit(3);
  const related = (sameCategory ?? []) as Business[];
  if (related.length >= 3) return related;

  const { data: others } = await supabase
    .from("businesses")
    .select("*")
    .eq("status", "aprobado")
    .neq("category", business.category)
    .limit(3 - related.length);
  return [...related, ...((others ?? []) as Business[])];
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("status", "aprobado")
    .maybeSingle();

  if (!data) {
    notFound();
  }
  const business = data as Business;

  const [{ data: photos }, related, usdRate] = await Promise.all([
    supabase
      .from("business_photos")
      .select("*")
      .eq("business_id", business.id)
      .order("position"),
    relatedBusinesses(supabase, business),
    getUsdCopRate(supabase),
  ]);

  return (
    <BusinessDetail
      business={business}
      photos={(photos ?? []) as BusinessPhoto[]}
      related={related}
      locale={locale}
      usdRate={usdRate}
    />
  );
}
