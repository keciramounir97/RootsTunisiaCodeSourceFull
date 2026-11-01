import { useEffect, useState } from "react";
import { ArchiveRestore, RefreshCw } from "lucide-react";
import { api } from "../../api/client";
import { useTranslation } from "../../context/TranslationContext";

type Backup = {
  id: number;
  tree_id: number;
  reason: string;
  created_at: string;
  restored_at?: string;
};

export default function Backups() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("/admin/backups")
      .then(({ data }) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setMessage(t("backups_load_failed", "تعذر تحميل النسخ الاحتياطية.")))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const restore = async (id: number) => {
    if (!window.confirm(t("restore_backup_confirm", "هل تريد استعادة هذه النسخة الاحتياطية كشجرة جديدة؟"))) return;
    await api.post(`/admin/backups/${id}/restore`);
    setMessage(t("backup_restored", "تمت استعادة النسخة الاحتياطية بنجاح."));
    load();
  };

  return (
    <section className="p-6 space-y-6 text-[var(--text-color)]">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArchiveRestore className="h-7 w-7 text-[#d9a441]" />
          <h1 className="text-2xl font-bold">{t("backups", "النسخ الاحتياطية")}</h1>
        </div>
        <button
          onClick={load}
          className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5 transition"
          title={t("refresh", "تحديث")}
          aria-label={t("refresh", "تحديث")}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </header>

      {message && <p className="text-sm opacity-75">{message}</p>}

      <div className="overflow-hidden rounded-2xl border border-[var(--border-color)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--paper-color)] ltr:text-start rtl:text-end">
              <th className="p-3">{t("id_col", "المعرف")}</th>
              <th className="p-3">{t("tree", "الشجرة")}</th>
              <th className="p-3">{t("reason", "السبب")}</th>
              <th className="p-3">{t("date", "التاريخ")}</th>
              <th className="p-3 text-center">{t("actions", "الإجراءات")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-[var(--border-color)]">
                <td className="p-3 font-mono text-xs">#{item.id}</td>
                <td className="p-3">#{item.tree_id}</td>
                <td className="p-3">{item.reason}</td>
                <td className="p-3">{new Date(item.created_at).toLocaleString()}</td>
                <td className="p-3 text-center">
                  <button
                    disabled={!!item.restored_at}
                    onClick={() => restore(item.id)}
                    className="rounded-full bg-[#d9a441] px-3 py-1 text-xs font-semibold text-[#071827] disabled:opacity-40"
                  >
                    {item.restored_at ? t("restored", "تمت الاستعادة") : t("restore", "استعادة")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && !items.length && (
          <p className="p-6 text-center opacity-60">{t("no_backups", "لا توجد نسخ احتياطية مسجلة.")}</p>
        )}
      </div>
    </section>
  );
}
