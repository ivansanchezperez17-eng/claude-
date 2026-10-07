import { signIn } from "../actions";

export default async function AdminLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="mb-6 text-center font-serif text-2xl text-clay-dark">
        Acceso administrador
      </h1>
      <form action={signIn} className="flex flex-col gap-4">
        <input type="hidden" name="locale" value={locale} />
        <input
          name="email"
          type="email"
          required
          placeholder="Correo"
          className="rounded-lg border border-stone bg-white px-4 py-2.5 outline-none focus:border-clay"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Contraseña"
          className="rounded-lg border border-stone bg-white px-4 py-2.5 outline-none focus:border-clay"
        />
        {error && (
          <p className="text-sm text-red-600">
            Correo o contraseña incorrectos.
          </p>
        )}
        <button
          type="submit"
          className="rounded-full bg-clay px-5 py-2.5 font-medium text-white transition-colors hover:bg-clay-dark"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
