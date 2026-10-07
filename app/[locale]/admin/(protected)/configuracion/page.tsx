import { createClient } from "@/lib/supabase/server";
import { getContactWhatsapp, getPlanPrices, getUsdCopRate } from "@/lib/settings";
import { saveSettings } from "../../settings-actions";

const input =
  "mt-1 w-full rounded-lg border border-stone bg-white px-3 py-2 outline-none focus:border-clay";

export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ guardado?: string; error?: string }>;
}) {
  const { locale } = await params;
  const { guardado, error } = await searchParams;
  const supabase = await createClient();
  const [plans, whatsapp, usdRate] = await Promise.all([
    getPlanPrices(supabase),
    getContactWhatsapp(supabase),
    getUsdCopRate(supabase),
  ]);

  return (
    <form action={saveSettings} className="flex flex-col gap-6 rounded-2xl border border-stone bg-white p-6">
      <input type="hidden" name="locale" value={locale} />
      <h2 className="font-serif text-xl text-clay-dark">Configuración</h2>
      {guardado && <p className="rounded-lg bg-sage/10 px-4 py-2 text-sm text-sage">Cambios guardados.</p>}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          No se guardó: revisa que los valores sean números válidos.
        </p>
      )}

      <fieldset>
        <legend className="font-medium">Precio mensual de cada plan (en pesos)</legend>
        <p className="text-sm text-foreground/60">Déjalo vacío para mostrar «A convenir».</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-medium text-foreground/80">
            Básico
            <input name="basico" type="number" min={0} step={1000} defaultValue={plans.basico.price_cop ?? ""} className={input} />
          </label>
          <label className="text-sm font-medium text-foreground/80">
            Destacado
            <input name="destacado" type="number" min={0} step={1000} defaultValue={plans.destacado.price_cop ?? ""} className={input} />
          </label>
          <label className="text-sm font-medium text-foreground/80">
            Destacado bilingüe
            <input
              name="destacado_bilingue"
              type="number"
              min={0}
              step={1000}
              defaultValue={plans.destacado_bilingue.price_cop ?? ""}
              className={input}
            />
          </label>
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-foreground/80">
          WhatsApp de contacto (página para negocios)
          <input name="contact_whatsapp" type="tel" required defaultValue={whatsapp} className={input} />
        </label>
        <label className="text-sm font-medium text-foreground/80">
          Tasa del dólar (pesos por 1 USD)
          <input name="usd_cop_rate" type="number" required min={1000} max={10000} defaultValue={usdRate} className={input} />
        </label>
      </div>

      <button type="submit" className="self-start rounded-full bg-clay px-6 py-2.5 font-medium text-white hover:bg-clay-dark">
        Guardar
      </button>
    </form>
  );
}
