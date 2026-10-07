import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { anthropic, buildSystemPrompt, CHAT_MODEL } from "@/lib/claude";
import type { Business } from "@/lib/types";

type IncomingMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "El bot no está configurado todavía." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const locale = body?.locale === "en" ? "en" : "es";
  const messages: IncomingMessage[] = Array.isArray(body?.messages)
    ? body.messages
        .filter(
          (m: unknown): m is IncomingMessage =>
            typeof m === "object" &&
            m !== null &&
            ("role" in m) &&
            ((m as IncomingMessage).role === "user" ||
              (m as IncomingMessage).role === "assistant") &&
            typeof (m as IncomingMessage).content === "string",
        )
        .slice(-10)
    : [];

  if (messages.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: businesses } = await supabase
    .from("businesses")
    .select("*")
    .eq("active", true);

  const system = buildSystemPrompt(locale, (businesses ?? []) as Business[]);

  try {
    const response = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 500,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ reply: text });
  } catch {
    return NextResponse.json(
      { error: "No se pudo contactar al bot en este momento." },
      { status: 502 },
    );
  }
}
