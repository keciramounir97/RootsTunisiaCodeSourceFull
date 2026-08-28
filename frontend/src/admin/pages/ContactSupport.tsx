import { useState } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { useAuth } from "../components/AuthContext";
import { api } from "../../api/client";
import { Headphones, Send, CheckCircle, AlertCircle, Loader2, Mail, MessageSquare, ShieldAlert, LifeBuoy } from "lucide-react";

export default function ContactSupport() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Billing & Subscription Complaint");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: string; msg: string }>({ type: "", msg: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setStatus({ type: "error", msg: "Please enter your support complaint or message." });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", msg: "" });

    try {
      const senderName = user?.fullName || user?.full_name || user?.name || "Registered User";
      const senderEmail = user?.email || "user@example.com";
      const formattedMessage = `[Category: ${category}]\n[Subject: ${subject || "No Subject"}]\n\n${message.trim()}`;

      const res = await api.post("/contact", {
        name: senderName,
        email: senderEmail,
        message: formattedMessage,
      });

      setStatus({
        type: "success",
        msg: res.data?.message || "Your complaint/support message has been delivered to Super Admin support and dispatched via SMTP email!",
      });
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Failed to deliver support message. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
        <div className="p-3 rounded-2xl bg-[#d9a441]/15 text-[#d9a441]">
          <Headphones className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-cinzel text-[var(--text-color)]">
            {t("contact_support", "Contact Support & Complaints")}
          </h1>
          <p className="text-xs text-[var(--text-color)] opacity-70">
            Directly submit support inquiries or complaints to Super Admin. Messages are dispatched directly to admin SMTP email and logged in the admin panel.
          </p>
        </div>
      </div>

      {status.msg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm ${
            status.type === "success"
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-500/30"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-500/30"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{status.msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Form Card */}
        <div className="lg:col-span-2 rounded-3xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] p-6 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Your Full Name:
                </label>
                <input
                  type="text"
                  readOnly
                  value={user?.fullName || user?.full_name || user?.name || "Registered User"}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Your Email Address:
                </label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || "user@example.com"}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Complaint / Ticket Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#d9a441]/30"
              >
                <option value="Billing & Subscription Complaint">Billing & Subscription Complaint</option>
                <option value="Technical Issue / Bug Report">Technical Issue / Bug Report</option>
                <option value="Account & Quotas Inquiry">Account & Quotas Inquiry</option>
                <option value="Feature Request">Feature Request</option>
                <option value="General Support">General Support</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Subject:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your inquiry..."
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#d9a441]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Complaint / Detailed Message: <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                required
                placeholder="Please describe your complaint or support request in detail..."
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#d9a441]/30"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d9a441] to-[#e8c377] text-[#092C2B] font-bold text-xs flex items-center justify-center gap-2 shadow hover:shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Support Ticket</span>
            </button>
          </form>
        </div>

        {/* Info Card Sidebar */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-[var(--border-color)] bg-gradient-to-br from-[#092C2B] to-[#124d4b] text-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <LifeBuoy className="w-6 h-6 text-[#d9a441]" />
              <h3 className="font-bold text-base font-cinzel !text-white" style={{ color: "#ffffff", textShadow: "none" }}>Super Admin Support</h3>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed">
              Your support ticket will be delivered directly to the Super Admin control panel for assistance.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] p-5 shadow-sm text-xs space-y-2">
            <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Need Payment Help?
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              If you have submitted a bank payment proof for subscription upgrade, you can check review status in your account or send a message here with your transaction reference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
