import { useEffect, useState } from "react";
import { Mail, Send, X, SendHorizontal, Users } from "lucide-react";
import { api } from "../../api/client";
import { useThemeStore } from "../../store/theme";
import { useLanguage } from "../../i18n";
import Toast from "../../components/Toast";

interface Subscriber {
  id: number;
  email: string;
  created_at?: string;
  createdAt?: string;
}

export default function NewsletterSubscribers() {
  const { theme } = useThemeStore();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  const pageBg = isDark ? "bg-[#0d1b2a]" : "bg-[#f5f1e8]";
  const text = isDark ? "text-[#f8f5ef]" : "text-[#0d1b2a]";
  const card = isDark ? "bg-[#0d1b2a]" : "bg-white";
  const border = isDark ? "border-white/10" : "border-black/10";
  const muted = isDark ? "text-[#7a8fa3]" : "text-gray-500";

  const [rows, setRows] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" }>({ message: "", tone: "success" });

  // Campaign Modal State
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignContent, setCampaignContent] = useState("");
  const [sendingCampaign, setSendingCampaign] = useState(false);

  // Individual Email Modal State
  const [individualModalOpen, setIndividualModalOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [individualSubject, setIndividualSubject] = useState("");
  const [individualContent, setIndividualContent] = useState("");
  const [sendingIndividual, setSendingIndividual] = useState(false);

  useEffect(() => {
    if (!toast.message) return;
    const timer = setTimeout(() => setToast({ message: "", tone: "success" }), 3500);
    return () => clearTimeout(timer);
  }, [toast.message]);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/admin/newsletter/subscribers");
      setRows(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load subscribers";
      setError(msg);
      setToast({ message: msg, tone: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSubscribers();
  }, []);

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignSubject.trim() || !campaignContent.trim()) return;

    setSendingCampaign(true);
    try {
      const res = await api.post("/admin/newsletter/send-campaign", {
        subject: campaignSubject.trim(),
        content: campaignContent.trim(),
      });
      setToast({ message: res.data?.message || "Campaign sent successfully!", tone: "success" });
      setCampaignModalOpen(false);
      setCampaignSubject("");
      setCampaignContent("");
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || "Failed to send newsletter campaign",
        tone: "error",
      });
    } finally {
      setSendingCampaign(false);
    }
  };

  const handleSendIndividual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail || !individualSubject.trim() || !individualContent.trim()) return;

    setSendingIndividual(true);
    try {
      await api.post("/admin/newsletter/send-individual", {
        email: targetEmail,
        subject: individualSubject.trim(),
        content: individualContent.trim(),
      });
      setToast({ message: `Email sent to ${targetEmail}`, tone: "success" });
      setIndividualModalOpen(false);
      setTargetEmail("");
      setIndividualSubject("");
      setIndividualContent("");
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || `Failed to send email to ${targetEmail}`,
        tone: "error",
      });
    } finally {
      setSendingIndividual(false);
    }
  };

  const openIndividualModal = (email: string) => {
    setTargetEmail(email);
    setIndividualSubject(`Update from Roots Tunisia`);
    setIndividualContent(`Hello,\n\n`);
    setIndividualModalOpen(true);
  };

  return (
    <div className={`min-h-screen ${pageBg} ${text} p-6`}>
      <Toast message={toast.message} tone={toast.tone} />

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-cinzel font-bold flex items-center gap-3">
              <Mail className="w-7 h-7 text-teal" />
              {t("legacy.newsletterSubscribers", "Newsletter Subscribers")}
            </h1>
            <p className={`text-xs mt-1 ${muted}`}>
              Manage newsletter subscribers and dispatch emails or campaign broadcasts.
            </p>
          </div>

          {rows.length > 0 && (
            <button
              onClick={() => setCampaignModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal text-white hover:bg-teal/90 transition text-sm font-semibold shadow-md"
            >
              <SendHorizontal className="w-4 h-4" />
              Send Campaign to All ({rows.length})
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-400 text-center py-12">{error}</p>
        ) : rows.length === 0 ? (
          <p className={`${muted} text-center py-12`}>{t("legacy.noSubscribers", "No subscribers yet")}</p>
        ) : (
          <div className={`${card} border ${border} rounded-xl overflow-hidden shadow-lg`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? "bg-white/5" : "bg-black/5"}>
                  <th className="text-left px-4 py-3">#</th>
                  <th className="text-left px-4 py-3">{t("legacy.email", "Email")}</th>
                  <th className="text-left px-4 py-3">{t("legacy.subscribedAt", "Subscribed At")}</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id} className={`border-t ${border} hover:bg-white/5 transition`}>
                    <td className={`px-4 py-3 ${muted}`}>{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{row.email}</td>
                    <td className={`px-4 py-3 ${muted}`}>
                      {row.created_at || row.createdAt
                        ? new Date(row.created_at || row.createdAt || "").toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openIndividualModal(row.email)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-teal/10 text-teal hover:bg-teal/20 transition text-xs font-semibold"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Campaign Email Modal */}
        {campaignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-lg p-6 rounded-xl border ${border} ${card} shadow-2xl relative`}>
              <button
                onClick={() => setCampaignModalOpen(false)}
                className={`absolute right-4 top-4 ${muted} hover:${text}`}
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-teal" />
                Send Newsletter Campaign
              </h3>
              <p className={`text-xs ${muted} mb-4`}>
                Broadcast an email to all <strong>{rows.length} subscribers</strong> via devteam@rootstunisia.com.
              </p>

              <form onSubmit={handleSendCampaign} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={campaignSubject}
                    onChange={(e) => setCampaignSubject(e.target.value)}
                    placeholder="e.g. Monthly Roots Tunisia Archives Update"
                    className={`w-full px-3 py-2 text-sm rounded border ${border} bg-transparent outline-none focus:border-teal`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Content</label>
                  <textarea
                    rows={6}
                    required
                    value={campaignContent}
                    onChange={(e) => setCampaignContent(e.target.value)}
                    placeholder="Write your email content here..."
                    className={`w-full px-3 py-2 text-sm rounded border ${border} bg-transparent outline-none focus:border-teal`}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCampaignModalOpen(false)}
                    className={`px-4 py-2 text-xs rounded border ${border} hover:bg-white/5`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingCampaign}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs rounded bg-teal text-white font-semibold hover:bg-teal/90 disabled:opacity-50"
                  >
                    <SendHorizontal className="w-4 h-4" />
                    {sendingCampaign ? "Sending Broadcast…" : "Send Campaign"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Individual Email Modal */}
        {individualModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-lg p-6 rounded-xl border ${border} ${card} shadow-2xl relative`}>
              <button
                onClick={() => setIndividualModalOpen(false)}
                className={`absolute right-4 top-4 ${muted} hover:${text}`}
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                <Send className="w-5 h-5 text-teal" />
                Send Individual Email
              </h3>
              <p className={`text-xs ${muted} mb-4`}>
                Recipient: <strong className="text-teal">{targetEmail}</strong>
              </p>

              <form onSubmit={handleSendIndividual} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={individualSubject}
                    onChange={(e) => setIndividualSubject(e.target.value)}
                    placeholder="Email subject"
                    className={`w-full px-3 py-2 text-sm rounded border ${border} bg-transparent outline-none focus:border-teal`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Message</label>
                  <textarea
                    rows={6}
                    required
                    value={individualContent}
                    onChange={(e) => setIndividualContent(e.target.value)}
                    placeholder="Write message content..."
                    className={`w-full px-3 py-2 text-sm rounded border ${border} bg-transparent outline-none focus:border-teal`}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIndividualModalOpen(false)}
                    className={`px-4 py-2 text-xs rounded border ${border} hover:bg-white/5`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingIndividual}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs rounded bg-teal text-white font-semibold hover:bg-teal/90 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {sendingIndividual ? "Sending Email…" : "Send Email"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
