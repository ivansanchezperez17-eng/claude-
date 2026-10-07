import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../actions";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) {
    await supabase.auth.signOut();
    redirect(`/${locale}/admin/login?error=1`);
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-stone/40">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-2xl text-clay-dark">Panel de Visit Barichara</h1>
          <form action={signOut}>
            <input type="hidden" name="locale" value={locale} />
            <button type="submit" className="text-sm text-foreground/60 hover:text-foreground">
              Cerrar sesión
            </button>
          </form>
        </div>
        <nav className="mb-6 flex flex-wrap gap-2 text-sm font-medium">
          <Link href="/admin" className="rounded-full bg-white px-4 py-1.5 ring-1 ring-stone hover:text-clay-dark">
            Negocios
          </Link>
          <Link href="/admin/solicitudes" className="rounded-full bg-white px-4 py-1.5 ring-1 ring-stone hover:text-clay-dark">
            Solicitudes
          </Link>
          <Link href="/admin/configuracion" className="rounded-full bg-white px-4 py-1.5 ring-1 ring-stone hover:text-clay-dark">
            Configuración
          </Link>
        </nav>
        {children}
      </div>
    </div>
  );
}
