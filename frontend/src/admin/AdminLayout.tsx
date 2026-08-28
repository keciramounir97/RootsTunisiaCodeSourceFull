import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";
import Breadcrumb from "./components/Breadcrumb";
import { useSiteImages } from "../hooks/useSiteImages";

export default function AdminLayout() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("admin_sidebar_open");
    if (saved !== null) return saved === "true";
    return window.innerWidth >= 1024;
  });
  const { backgroundImage } = useSiteImages();

  useEffect(() => {
    try {
      localStorage.setItem("admin_sidebar_open", String(open));
    } catch {
      // ignore storage errors
    }
  }, [open]);

  return (
    <div
      className="bg-[var(--background)] text-[var(--foreground)] min-h-screen bg-cover bg-center bg-fixed bg-no-repeat transition-colors duration-300 relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background Opacity Translucent Overlay */}
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[2px] pointer-events-none z-0" />

      <div className="relative z-10">
        <AdminHeader sidebarOpen={open} onToggleSidebar={() => setOpen((v) => !v)} />
        <AdminSidebar open={open} onClose={() => setOpen(false)} onToggle={() => setOpen((v) => !v)} />
        <main
          className={`transition-all duration-300 pt-20 pb-12 px-4 sm:px-8 ${
            open ? "lg:pl-72" : "lg:pl-0"
          }`}
        >
          <div className={`mx-auto space-y-6 transition-all duration-300 ${open ? "max-w-7xl" : "max-w-[98%] w-full"}`}>
            <Breadcrumb />
            <div className="surface-card p-4 sm:p-8 shadow-xl border border-[var(--gold)]/30 backdrop-blur-md w-full">
              <Outlet context={{ sidebarOpen: open }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
