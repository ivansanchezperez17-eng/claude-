import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getDemoPassword } from "@/lib/demo";
import BusinessCard from "@/components/BusinessCard";
import type { Business } from "@/lib/types";
import { enterDemo, exitDemo } from "./actions";

export default async function DemoPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { error } = await searchParams;
  const t = await getTranslations("demo");

  const password = await getDemoPassword();
  let businesses: Business[] | null = null;

  if (password) {
    const supabase = await createClient();
    const { data, error: rpcError } = await supabase.rpc("demo_businesses", {
      p_password: password,
    });
    if (!rpcError) businesses = (data ?? []) as Business[];
  }

  if (!businesses) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-sm flex-col justify-center px-6 py-16">
        <h1 className="mb-2 text-center font-serif text-2xl text-clay-dark">
          {t("title")}
        </h1>
        <p className="mb-6 text-center text-sm text-foreground/60">
          {t("subtitle")}
        </p>
        <form action={enterDemo} className="flex flex-col gap-4">
          <input type="hidden" name="locale" value={locale} />
          <label className="text-sm font-medium text-foreground/80">
            {t("passwordLabel")}
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-stone bg-white px-4 py-2.5 outline-none focus:border-clay"
            />
          </label>
          {(error || password) && (
            <p className="text-sm text-red-600">{t("wrongPassword")}</p>
          )}
          <button
            type="submit"
            className="rounded-full bg-clay px-5 py-2.5 font-medium text-white transition-colors hover:bg-clay-dark"
          >
            {t("enter")}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-clay-dark px-5 py-3 text-sm text-white">
        <span>{t("banner")}</span>
        <form action={exitDemo}>
          <input type="hidden" name="locale" value={locale} />
          <button type="submit" className="underline">
            {t("exit")}
          </button>
        </form>
      </div>
      <h1 className="font-serif text-3xl text-clay-dark">{t("listTitle")}</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            basePath="/demo"
            showStatus
          />
        ))}
      </div>
    </div>
  );
}
