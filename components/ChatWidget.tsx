"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, messages: nextMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.ok ? data.reply : data.error,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hubo un error de conexión." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-stone bg-white shadow-xl sm:w-96">
          <div className="bg-clay px-4 py-3 text-white">
            <span className="font-serif text-lg">{t("title")}</span>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            <p className="rounded-2xl rounded-tl-sm bg-stone px-3 py-2 text-foreground/80">
              {t("greeting")}
            </p>
            {messages.map((m, i) => (
              <p
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                  m.role === "user"
                    ? "ml-auto rounded-tr-sm bg-sage text-white"
                    : "rounded-tl-sm bg-stone text-foreground/80"
                }`}
              >
                {m.content}
              </p>
            ))}
            {loading && (
              <p className="rounded-2xl rounded-tl-sm bg-stone px-3 py-2 text-foreground/50">
                ...
              </p>
            )}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 border-t border-stone p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 rounded-full border border-stone px-3 py-2 text-sm outline-none focus:border-clay"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-clay px-4 py-2 text-sm font-medium text-white hover:bg-clay-dark disabled:opacity-50"
            >
              {t("send")}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-clay text-white shadow-lg transition-transform hover:scale-105"
        aria-label={t("title")}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
