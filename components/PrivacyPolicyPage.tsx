import { useLocale, useTranslations } from "next-intl";

const CONTACT_EMAIL = "ivansanchezperez17@gmail.com";

export default function PrivacyPolicyPage() {
  const t = useTranslations("privacy");
  const locale = useLocale();
  const isEn = locale === "en";

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-3xl text-clay-dark">{t("title")}</h1>
      <p className="mt-1 text-sm text-foreground/50">{t("updated")}</p>

      {isEn ? (
        <div className="mt-8 flex flex-col gap-5 text-sm leading-relaxed text-foreground/80">
          <p>
            Visit Barichara is a private tourism directory, not affiliated
            with the Barichara municipal government. This page explains, in
            plain terms, what data we collect and why.
          </p>
          <div>
            <h2 className="font-serif text-lg text-clay-dark">What we collect</h2>
            <p className="mt-1">
              When you click a business&apos;s WhatsApp button we log the
              business, the date and your browser language — no name, phone
              number or message content. If you chat with our guide bot, your
              messages are sent to Anthropic (Claude) to generate a reply; we
              don&apos;t store chat history on our servers.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-lg text-clay-dark">Why</h2>
            <p className="mt-1">
              To understand which listings visitors are interested in, and to
              power the chat guide. We never sell this data.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-lg text-clay-dark">Your rights</h2>
            <p className="mt-1">
              Under Colombian law (Ley 1581 de 2012), you can ask us to
              access, correct or delete any personal data we hold about you.
              Write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                {CONTACT_EMAIL}
              </a>{" "}
              and we&apos;ll respond within the legal timeframe.
            </p>
          </div>
          <p className="text-xs text-foreground/50">
            This is a starting template, not legal advice — have it reviewed
            before relying on it for compliance.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-5 text-sm leading-relaxed text-foreground/80">
          <p>
            Visit Barichara es un directorio turístico privado, sin ninguna
            relación con la Alcaldía de Barichara. Esta página explica, en
            términos simples, qué datos recogemos y para qué.
          </p>
          <div>
            <h2 className="font-serif text-lg text-clay-dark">Qué recogemos</h2>
            <p className="mt-1">
              Cuando haces clic en el botón de WhatsApp de un negocio
              registramos el negocio, la fecha y el idioma de tu navegador —
              no tu nombre, número ni el contenido del mensaje. Si usas
              nuestro chat de guía, tus mensajes se envían a Anthropic
              (Claude) para generar la respuesta; no guardamos el historial
              del chat en nuestros servidores.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-lg text-clay-dark">Para qué</h2>
            <p className="mt-1">
              Para entender en qué negocios se interesan los visitantes y
              para que funcione el chat de guía. Nunca vendemos estos datos.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-lg text-clay-dark">Tus derechos</h2>
            <p className="mt-1">
              Según la Ley 1581 de 2012 de Colombia, puedes pedirnos acceder,
              corregir o eliminar cualquier dato personal que tengamos sobre
              ti. Escríbenos a{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                {CONTACT_EMAIL}
              </a>{" "}
              y te responderemos dentro del plazo legal.
            </p>
          </div>
          <p className="text-xs text-foreground/50">
            Esta es una plantilla de partida, no asesoría legal — conviene
            que la revise alguien antes de confiar en ella para cumplimiento.
          </p>
        </div>
      )}
    </div>
  );
}
