/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_CONTACT_PHONE?: string;
    readonly VITE_CONTACT_PHONE_DISPLAY?: string;
    readonly VITE_CONTACT_WHATSAPP?: string;
    readonly VITE_CONTACT_WHATSAPP_DISPLAY?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
