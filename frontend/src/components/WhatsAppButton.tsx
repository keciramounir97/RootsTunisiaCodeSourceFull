import { MessageCircle } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";

export default function WhatsAppButton() {
  const { t } = useTranslation();
  const phone = "+9613626082";
  const message = encodeURIComponent(t("whatsapp_message", "Hi! I need help with Roots Tunisia"));

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center group"
      aria-label={t("whatsapp_support", "Contact Support")}
      title={t("whatsapp_support", "Contact Support")}
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white dark:bg-[var(--teal-dark)] text-[var(--brand-teal)] dark:text-[var(--gold-light)] px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {t("whatsapp_support", "Contact Support")}
      </span>
    </a>
  );
}