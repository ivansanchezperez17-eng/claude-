import { redirect } from "next/navigation";
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

  return (
    <div className="min-h-[calc(100vh-200px)] bg-stone/40">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-2xl text-clay-dark">
            Panel de Visit Barichara
          </h1>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-foreground/60 hover:text-foreground"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
        {children}
      </div>
    </div>
  );
}
