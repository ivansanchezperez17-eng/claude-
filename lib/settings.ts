import type { SupabaseClient } from "@supabase/supabase-js";

const FALLBACK_USD_COP_RATE = 3210;

export async function getUsdCopRate(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "usd_cop_rate")
    .maybeSingle();
  const rate = Number(data?.value);
  return Number.isFinite(rate) && rate > 0 ? rate : FALLBACK_USD_COP_RATE;
}
