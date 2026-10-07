import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getDemoPassword } from "@/lib/demo";
import BusinessDetail from "@/components/BusinessDetail";
import type { Business } from "@/lib/types";

export default async function DemoBusinessPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const password = await getDemoPassword();
  if (!password) {
    redirect(`/${locale}/demo`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("demo_business", {
    p_password: password,
    p_slug: slug,
  });

  if (error) {
    redirect(`/${locale}/demo`);
  }

  const business = (data as Business[] | null)?.[0];
  if (!business) {
    notFound();
  }

  const t = await getTranslations("demo");

  return (
    <>
      <div className="mx-auto mt-6 max-w-4xl px-6">
        <p className="rounded-2xl bg-clay-dark px-5 py-3 text-sm text-white">
          {t("previewNotice")}
        </p>
      </div>
      <BusinessDetail business={business} photos={[]} locale={locale} preview />
    </>
  );
}
