import { WhatsAppIcon } from "./WhatsAppButton";

export default function WhatsAppIconLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#128C7E] px-7 py-4 text-lg font-semibold text-white shadow-md transition-colors hover:bg-[#0e7266]"
    >
      <WhatsAppIcon className="h-6 w-6" />
      {label}
    </a>
  );
}
