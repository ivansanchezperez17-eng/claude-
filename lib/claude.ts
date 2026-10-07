import Anthropic from "@anthropic-ai/sdk";
import { barichairaGuide } from "./barichara-guide";
import type { Business } from "./types";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const CHAT_MODEL = "claude-haiku-4-5-20251001";

export function buildSystemPrompt(locale: string, businesses: Business[]) {
  const guide =
    locale === "en" ? barichairaGuide.en : barichairaGuide.es;

  const directory = businesses
    .map((b) => {
      const description =
        locale === "en" ? b.description_en : b.description_es;
      return `- [${b.category}] ${b.name}${b.zone ? ` (${b.zone})` : ""}${
        b.price_range ? ` — ${b.price_range}` : ""
      }${description ? `: ${description}` : ""}`;
    })
    .join("\n");

  const language = locale === "en" ? "English" : "Spanish";

  return `You are the friendly tourist guide chatbot for "Visit Barichara", a
directory website for Barichara, Santander, Colombia. Always answer in
${language}. Keep answers concise and warm.

${guide}

Current businesses listed on the site (only recommend from this list, and
say so if nothing fits what the visitor is asking for):
${directory || "(no businesses listed yet)"}`;
}
