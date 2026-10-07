import { createClient } from "@/lib/supabase/server";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { convertApplication, discardApplication } from "../../application-actions";

type Application = {
  id: string;
  business_name: string;
  contact_name: string;
  phone: string;
  email: string | null;
  category: string;
  description: string;
  photo_paths: string[] | null;
  status: "nueva" | "convertida" | "descartada";
  created_at: string;
};

const STATUS_LABEL: Record<Application["status"], string> = {
  nueva: "Nueva",
  convertida: "Convertida en borrador",
  descartada: "Descartada",
};

export default async function ApplicationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("business_applications")
    .select("*")
    .order("created_at", { ascending: false });
  const list = (data ?? []) as Application[];

  // Las fotos están en un bucket privado: se muestran con enlaces temporales (1 hora).
  const allPaths = list.flatMap((a) => a.photo_paths ?? []);
  const signed = new Map<string, string>();
  if (allPaths.length > 0) {
    const { data: urls } = await supabase.storage.from("applications").createSignedUrls(allPaths, 3600);
    for (const u of urls ?? []) {
      if (u.path && u.signedUrl) signed.set(u.path, u.signedUrl);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          No se pudo procesar la solicitud. Intenta de nuevo.
        </p>
      )}
      {list.length === 0 && (
        <p className="rounded-2xl border border-stone bg-white p-8 text-center text-foreground/50">
          Aún no hay solicitudes desde el formulario.
        </p>
      )}
      {list.map((a) => (
        <article key={a.id} className="rounded-2xl border border-stone bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="font-serif text-lg text-clay-dark">{a.business_name}</h2>
              <p className="text-sm text-foreground/60">
                {a.category} · {new Date(a.created_at).toLocaleString("es-CO", { timeZone: "America/Bogota" })}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                a.status === "nueva" ? "bg-clay/15 text-clay-dark" : "bg-foreground/10 text-foreground/50"
              }`}
            >
              {STATUS_LABEL[a.status]}
            </span>
          </div>
          <p className="mt-3 text-sm">
            <strong>{a.contact_name}</strong> · {a.phone}
            {a.email ? ` · ${a.email}` : ""}
          </p>
          <p className="mt-2 whitespace-pre-line text-sm text-foreground/80">{a.description}</p>
          {(a.photo_paths ?? []).length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {(a.photo_paths ?? []).map((p) =>
                signed.get(p) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p} src={signed.get(p)} alt="" className="h-24 w-32 shrink-0 rounded-lg object-cover" />
                ) : null,
              )}
            </div>
          )}
          <p className="mt-2 text-xs text-foreground/50">Autorizó publicar sus datos y fotos en el formulario.</p>
          {a.status === "nueva" && (
            <div className="mt-4 flex flex-wrap gap-3">
              <form action={convertApplication}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className="rounded-full bg-clay px-5 py-2 text-sm font-medium text-white hover:bg-clay-dark">
                  Crear borrador
                </button>
              </form>
              <form action={discardApplication}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="id" value={a.id} />
                <ConfirmSubmitButton
                  confirmMessage="¿Descartar esta solicitud?"
                  className="rounded-full px-5 py-2 text-sm text-foreground/60 ring-1 ring-stone hover:text-foreground"
                >
                  Descartar
                </ConfirmSubmitButton>
              </form>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
