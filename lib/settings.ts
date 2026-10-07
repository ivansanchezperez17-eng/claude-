import type { SupabaseClient } from "@supabase/supabase-js";
import type { BusinessPlan } from "./types";

const FALLBACK_USD_COP_RATE = 3210;
const FALLBACK_WHATSAPP = "573004678975";

export type PlanPrices = Record<BusinessPlan, { price_cop: number | null }>;

const FALLBACK_PLANS: PlanPrices = {
  basico: { price_cop: 100000 },
  destacado: { price_cop: null },
  destacado_bilingue: { price_cop: null },
};

async function getSetting(supabase: SupabaseClient, key: string) {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return data?.value as unknown;
}

export async function getUsdCopRate(supabase: SupabaseClient) {
  const rate = Number(await getSetting(supabase, "usd_cop_rate"));
  return Number.isFinite(rate) && rate > 0 ? rate : FALLBACK_USD_COP_RATE;
}

export async function getContactWhatsapp(supabase: SupabaseClient) {
  const value = await getSetting(supabase, "contact_whatsapp");
  const digits = typeof value === "string" ? value.replace(/\D/g, "") : "";
  return digits.length >= 10 ? digits : FALLBACK_WHATSAPP;
}

export async function getPlanPrices(supabase: SupabaseClient): Promise<PlanPrices> {
  const value = (await getSetting(supabase, "plans")) as Partial<PlanPrices> | null;
  const plans = { ...FALLBACK_PLANS };
  for (const key of Object.keys(plans) as BusinessPlan[]) {
    const price = value?.[key]?.price_cop;
    plans[key] = {
      price_cop: typeof price === "number" && price >= 0 ? price : null,
    };
  }
  return plans;
}
