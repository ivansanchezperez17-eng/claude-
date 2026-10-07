import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Business } from "@/lib/types";
import { deleteBusiness } from "../actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: businesses } = await supabase
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (businesses ?? []) as Business[];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Link
          href="/admin/negocios/nuevo"
          className="rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-white hover:bg-clay-dark"
        >
          + Nuevo negocio
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone bg-white">
        <table className="w-full text-sm">
          <thead className="bg-stone/60 text-left text-xs uppercase tracking-wide text-foreground/60">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Próximo pago</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-foreground/50">
                  Aún no has agregado ningún negocio.
                </td>
              </tr>
            )}
            {list.map((business) => {
              const overdue =
                business.next_payment_due && business.next_payment_due < today;
              return (
                <tr key={business.id} className="border-t border-stone">
                  <td className="px-4 py-3 font-medium">{business.name}</td>
                  <td className="px-4 py-3 capitalize">{business.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        business.active
                          ? "bg-sage/15 text-sage"
                          : "bg-foreground/10 text-foreground/50"
                      }`}
                    >
                      {business.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 ${overdue ? "font-medium text-red-600" : ""}`}
                  >
                    {business.next_payment_due ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/negocios/${business.id}`}
                      className="text-clay-dark hover:underline"
                    >
                      Editar
                    </Link>
                    <form action={deleteBusiness} className="inline">
                      <input type="hidden" name="id" value={business.id} />
                      <input type="hidden" name="locale" value={locale} />
                      <ConfirmSubmitButton
                        confirmMessage={`¿Eliminar "${business.name}"? Esta acción no se puede deshacer.`}
                        className="ml-4 text-foreground/40 hover:text-red-600"
                      >
                        Eliminar
                      </ConfirmSubmitButton>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
