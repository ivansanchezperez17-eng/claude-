import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const WHATSAPP_MESSAGE = {
  es: "Hola, te encontré en Visit Barichara",
  en: "Hi, I found you on Visit Barichara",
} as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const locale = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "es";

  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("id, whatsapp")
    .eq("slug", slug)
    .eq("status", "aprobado")
    .maybeSingle();

  if (!business?.whatsapp) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  await supabase.from("business_clicks").insert({
    business_id: business.id,
    locale,
  });

  const phone = business.whatsapp.replace(/\D/g, "");
  const text = encodeURIComponent(WHATSAPP_MESSAGE[locale]);

  return NextResponse.redirect(`https://wa.me/${phone}?text=${text}`);
}
