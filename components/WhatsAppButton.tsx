export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.98 1-3.63-.24-.37a9.78 9.78 0 0 1-1.5-5.21c0-5.41 4.41-9.82 9.83-9.82 2.63 0 5.09 1.02 6.95 2.88a9.76 9.76 0 0 1 2.87 6.95c0 5.42-4.41 9.8-9.82 9.8zm8.36-18.16A11.75 11.75 0 0 0 12.04.17C5.5.17.18 5.49.18 12.03c0 2.09.55 4.13 1.59 5.93L.08 24l6.18-1.62a11.82 11.82 0 0 0 5.78 1.47h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.47-8.39z" />
    </svg>
  );
}

const BASE =
  "inline-flex items-center justify-center gap-2.5 rounded-full bg-[#128C7E] px-7 py-4 text-lg font-semibold text-white shadow-md";

export default function WhatsAppButton({
  slug,
  locale,
  label,
  preview = false,
  className = "",
}: {
  slug: string;
  locale: string;
  label: string;
  preview?: boolean;
  className?: string;
}) {
  if (preview) {
    return (
      <span className={`${BASE} cursor-not-allowed opacity-60 ${className}`}>
        <WhatsAppIcon className="h-6 w-6" />
        {label}
      </span>
    );
  }
  return (
    <a
      href={`/go/${encodeURIComponent(slug)}?lang=${locale === "en" ? "en" : "es"}`}
      rel="nofollow"
      className={`${BASE} transition-colors hover:bg-[#0e7266] ${className}`}
    >
      <WhatsAppIcon className="h-6 w-6" />
      {label}
    </a>
  );
}

export function StickyWhatsAppBar(props: {
  slug: string;
  locale: string;
  label: string;
  preview?: boolean;
}) {
  return (
    <>
      <div className="h-24 sm:hidden" aria-hidden="true" />
      <div
        data-sticky-cta
        className="fixed inset-x-0 bottom-0 z-40 border-t border-stone bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden"
      >
        <WhatsAppButton {...props} className="w-full" />
      </div>
    </>
  );
}
