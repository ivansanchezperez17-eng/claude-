import { cookies } from "next/headers";

export const DEMO_COOKIE = "vb_demo";

export async function getDemoPassword() {
  const cookieStore = await cookies();
  return cookieStore.get(DEMO_COOKIE)?.value ?? null;
}
