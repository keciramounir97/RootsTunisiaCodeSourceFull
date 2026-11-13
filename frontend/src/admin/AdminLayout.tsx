import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";
import Breadcrumb from "./components/Breadcrumb";
import { useSiteImages } from "../hooks/useSiteImages";
import { useTranslation } from "../context/TranslationContext";

export default function AdminLayout() {
  const { dir, isRtl: contextIsRtl } = useTranslation();
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    if (window.innerWidth < 1024) return false;
    const saved = localStorage.getItem("admin_sidebar_open");
    if (saved !== null) return saved === "true";
    return true;
  });
  const { backgroundImage } = useSiteImages();

  useEffect(() => {
    try {
      localStorage.setItem("admin_sidebar_open", String(open));
    } catch {
      // ignore storage errors
    }
  }, [open]);

  const isRtl = Boolean(contextIsRtl || dir === "rtl");

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="bg-[var(--background)] text-[var(--foreground)] min-h-screen bg-cover bg-center bg-fixed bg-no-repeat transition-colors duration-300 relative text-start"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background Opacity Translucent Overlay */}
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[2px] pointer-events-none z-0" />

      <div className="relative z-10">
        <AdminHeader sidebarOpen={open} onToggleSidebar={() => setOpen((v) => !v)} />
        <AdminSidebar open={open} onClose={() => setOpen(false)} onToggle={() => setOpen((v) => !v)} />
        <main
          className={`transition-all duration-300 pt-16 sm:pt-20 pb-12 px-2.5 sm:px-6 lg:px-8 overflow-x-hidden ${
            open
              ? isRtl
                ? "lg:pr-72 lg:pl-0"
                : "lg:pl-72 lg:pr-0"
              : "lg:pl-0 lg:pr-0"
          }`}
        >
          <div className={`mx-auto space-y-6 transition-all duration-300 ${open ? "max-w-7xl" : "max-w-[98%] w-full"}`}>
            <Breadcrumb />
            <div dir={isRtl ? "rtl" : "ltr"} className="surface-card p-3 sm:p-6 lg:p-8 shadow-xl border border-[var(--gold)]/30 backdrop-blur-md w-full overflow-x-auto text-start">
              <Outlet context={{ sidebarOpen: open }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
