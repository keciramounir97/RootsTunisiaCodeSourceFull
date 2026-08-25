import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";
import Breadcrumb from "./components/Breadcrumb";

export default function AdminLayout() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    const syncSidebarForViewport = () => {
      setOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", syncSidebarForViewport);
    return () => window.removeEventListener("resize", syncSidebarForViewport);
  }, []);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <AdminHeader sidebarOpen={open} onToggleSidebar={() => setOpen((v) => !v)} />
      <AdminSidebar open={open} onClose={() => setOpen(false)} onToggle={() => setOpen((v) => !v)} />
      <main
        className={`transition-all duration-300 pt-20 pb-12 px-4 sm:px-8 ${
          open ? "lg:pl-72" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />
          <div className="surface-card p-6 sm:p-8 shadow-sm">
            <Outlet context={{ sidebarOpen: open }} />
          </div>
        </div>
      </main>
    </div>
  );
}
