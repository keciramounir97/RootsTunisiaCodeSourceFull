import { useState, useMemo } from "react";
import {
  Check,
  ShieldCheck,
  Zap,
  Lock,
  RefreshCw,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  Mail,
  FileCheck,
  X,
  Sparkles,
  Layers,
  Users,
  Download,
  BookOpen,
  Crown,
  Coins,
  Globe,
  Radio,
  FileText,
  Image as ImageIcon,
  FolderTree,
} from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../admin/components/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { Link, useNavigate } from "react-router-dom";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import medina from "../assets/medina-tunis.jpg";
import SEO from "../components/SEO";

type ComparisonCell = string | boolean;

interface ComparisonRow {
  feature: string;
  basic: ComparisonCell;
  premium: ComparisonCell;
  historian: ComparisonCell;
}

export default function Subscriptions() {
  const { t, isRtl } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currencies, selectedCurrency, setCurrencyCode, convertPrice } = useCurrency();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // User subscription status
  const currentTierId = Number(user?.tier_id ?? 1);

  // 3 Exact Tiers matching the screenshot and database quotas:
  // Basic ($0.00), Premium ($9.99), Family Historian ($19.99)
  const tiers = useMemo(() => {
    const isAnnual = billingCycle === "annual";
    // Annual gives 2 months free: 10 * monthly price
    const premiumBaseUSD = isAnnual ? 9.99 * 10 : 9.99;
    const historianBaseUSD = isAnnual ? 19.99 * 10 : 19.99;

    const premiumConverted = convertPrice(premiumBaseUSD);
    const historianConverted = convertPrice(historianBaseUSD);
    const basicConverted = convertPrice(0);

    return [
      {
        id: 1,
        slug: "basic",
        name: "Basic",
        nameKey: "tier_basic_name",
        priceUSD: 0,
        priceDisplay: basicConverted.formatted,
        amountRaw: basicConverted.amount,
        currencyCode: basicConverted.code,
        period: isAnnual ? t("per_year", "/ year") : t("per_month", "/ month"),
        limits: {
          trees: 25,
          individuals: 25,
          sources: 25,
          notes: 25,
          tasks: 25,
          gallery: 25,
          audios: 25,
          documents: 25,
        },
        highlight: false,
        isCurrent: !user || currentTierId === 1,
      },
      {
        id: 2,
        slug: "premium",
        name: "Premium",
        nameKey: "tier_premium_name",
        priceUSD: premiumBaseUSD,
        priceDisplay: premiumConverted.formatted,
        amountRaw: premiumConverted.amount,
        currencyCode: premiumConverted.code,
        period: isAnnual ? t("per_year", "/ year") : t("per_month", "/ month"),
        limits: {
          trees: 300,
          individuals: 300,
          sources: 300,
          notes: 300,
          tasks: 300,
          gallery: 300,
          audios: 300,
          documents: 300,
        },
        highlight: true,
        badge: t("most_popular", "الأكثر شعبية"),
        isCurrent: user && currentTierId === 2,
      },
      {
        id: 3,
        slug: "historian",
        name: "Family Historian",
        nameKey: "tier_historian_name",
        priceUSD: historianBaseUSD,
        priceDisplay: historianConverted.formatted,
        amountRaw: historianConverted.amount,
        currencyCode: historianConverted.code,
        period: isAnnual ? t("per_year", "/ year") : t("per_month", "/ month"),
        limits: {
          trees: 3000,
          individuals: 3000,
          sources: 3000,
          notes: 3000,
          tasks: 3000,
          gallery: 3000,
          audios: 3000,
          documents: 3000,
        },
        highlight: false,
        badge: t("ultimate_research", "البحث الأكاديمي الشامل"),
        isCurrent: user && currentTierId === 3,
      },
    ];
  }, [billingCycle, convertPrice, user, currentTierId, t]);

  const featureLabels = [
    { key: "trees", label: t("max_trees", "شجرات العائلة المتاحة"), icon: FolderTree },
    { key: "individuals", label: t("max_individuals", "أفراد العائلة والأشخاص"), icon: Users },
    { key: "sources", label: t("max_saved_sources", "المصادر والمراجع المحفوظة"), icon: BookOpen },
    { key: "notes", label: t("max_research_notes", "الملاحظات والمسودات البحثية"), icon: FileText },
    { key: "tasks", label: t("max_research_tasks", "مهام البحث والتوثيق"), icon: Zap },
    { key: "gallery", label: t("max_gallery_images", "صور المعرض التاريخي"), icon: ImageIcon },
    { key: "audios", label: t("max_audio_files", "التسجيلات الصوتية والشهادات"), icon: Radio },
    { key: "documents", label: t("max_documents", "الوثائق والمخطوطات المؤرشفة"), icon: FileCheck },
  ];

  const comparisonRows: ComparisonRow[] = [
    {
      feature: t("comp_max_trees", "عدد شجرات العائلة المسموح بها"),
      basic: "25",
      premium: "300",
      historian: "3000",
    },
    {
      feature: t("comp_max_members", "الأفراد وسجلات النسب الموثقة"),
      basic: "25",
      premium: "300",
      historian: "3000",
    },
    {
      feature: t("comp_archive_access", "الوصول إلى السجلات والأرشيف الوطني"),
      basic: t("comp_val_read_only", "استعراض أساسي"),
      premium: t("comp_val_full_24_gov", "كامل 24 ولاية"),
      historian: t("comp_val_full_24_gov", "كامل 24 ولاية + أولوية الفهرسة"),
    },
    {
      feature: t("comp_gedcom", "استيراد وتصدير ملفات GEDCOM"),
      basic: true,
      premium: true,
      historian: true,
    },
    {
      feature: t("comp_export", "تصدير عالي الدقة للطباعة والمخطوطات"),
      basic: false,
      premium: true,
      historian: true,
    },
    {
      feature: t("comp_support", "الدعم المباشر ومساعدة التوثيق"),
      basic: t("comp_support_community", "مجتمعي"),
      premium: t("comp_support_priority", "أولوية عبر البريد"),
      historian: t("comp_support_dedicated", "مستشار نسابة مخصص"),
    },
  ];

  const faqs = [
    {
      qKey: "faq_q1",
      defaultQ: "كيف يتم تطبيق أسعار الصرف وتحويل العملات؟",
      aKey: "faq_a1",
      defaultA:
        "يتم تحويل الأسعار بدقة وفورية بالدينار التونسي (TND) واليورو والدولار وجميع العملات العالمية وفقاً لأسعار الصرف المعتمدة رسمياً من إدارة المنصة، دون أي رسوم خفية.",
    },
    {
      qKey: "faq_q2",
      defaultQ: "ما هي وسائل الدفع التونسية والدولية المتاحة؟",
      aKey: "faq_a2",
      defaultA:
        "نوفر وسائل دفع متعددة تشمل التحويل البنكي (RIB / IBAN)، وتطبيقات الدفع الإلكتروني (Flouci, Konnect)، وحوالات البريد التونسي (D17 / Mandat)، بالإضافة إلى التحويلات الدولية للمغتربين.",
    },
    {
      qKey: "faq_q3",
      defaultQ: "هل يمكنني ترقية أو تغيير خطتي في أي وقت؟",
      aKey: "faq_a3",
      defaultA:
        "نعم، يمكنك الترقية فوراً من لوحة تحكم حسابك وستحصل على السعات الجديدة مباشرة مع الاحتفاظ بكافة شجراتك وسجلاتك التاريخية.",
    },
    {
      qKey: "faq_q4",
      defaultQ: "هل بيانات عائلتي وشجراتي محمية؟",
      aKey: "faq_a4",
      defaultA:
        "بياناتك محمية بتشفير عالي الأمان ومطابقة لمعايير حماية الخصوصية. شجراتك وسجلاتك تظل ملكك الخاص ولا يمكن لأحد تعديلها.",
    },
  ];

  const handleSelectTier = (tier: (typeof tiers)[0]) => {
    if (tier.id === 1) {
      if (!user) navigate("/signup");
      else navigate("/admin/trees");
      return;
    }

    // Lead directly to payment page with tier, amount, and currency!
    const query = new URLSearchParams({
      tier: String(tier.id),
      plan: tier.slug,
      amount: String(tier.amountRaw),
      currency: tier.currencyCode,
      interval: billingCycle,
    });
    navigate(`/payment?${query.toString()}`);
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("seo_subscriptions_title", "خطط الاشتراكات والترقية — جذور تونس")}
        description="اختر الخطة المناسبة لاحتياجاتك البحثية أو الأكاديمية وفعّل سعات متقدمة لشجرات العائلة والأرشيف التونسي."
        keywords={["Roots Tunisia pricing", "اشتراكات جذور تونس", "شجرة العائلة تونس"]}
      />

      {/* Hero Banner */}
      <PageHero
        eyebrow={t("subscriptions_eyebrow", "خطط الاشتراكات والترقية")}
        title={t("subscriptions_hero_title", "استكشف أصولك العائلية بسعات متقدمة")}
        subtitle={t("subscriptions_hero_subtitle", "اختر الباقة المناسبة لاحتياجاتك البحثية أو الأكاديمية مع حفظ كامل حقوق وخصوصية سجلاتك.")}
        image={medina}
      />

      <Section>
        {/* Main Section Header matching user screenshot */}
        <div className="surface-card frame-gold p-6 sm:p-8 rounded-2xl shadow-xl max-w-5xl mx-auto -mt-16 sm:-mt-20 relative z-20 bg-[var(--card)]/95 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-start w-full md:w-auto">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 shadow-inner">
                <Crown className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
                  {t("subscription_plans", "خطط الاشتراكات والترقية")}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
                  {t("user_upgrade_desc", "إختر الخطة المناسبة لاحتياجاتك البحثية أو الأكاديمية وفعّل سعات متقدمة")}
                </p>
              </div>
            </div>

            {/* Currency Selector Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
              <div className="flex items-center gap-2 p-1.5 rounded-xl border border-[var(--gold)]/35 bg-[var(--background)] shadow-sm">
                <Coins className="h-4 w-4 text-[var(--gold)] shrink-0 ms-1" />
                <span className="text-[0.68rem] font-bold text-[var(--muted-foreground)] uppercase">
                  {t("currency", "العملة")}:
                </span>
                <select
                  value={selectedCurrency.code}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="bg-transparent text-xs font-bold font-mono text-[var(--foreground)] outline-none cursor-pointer pe-2"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[var(--card)] text-[var(--foreground)]">
                      {c.code} ({c.symbol}) — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Billing Cycle Switch */}
              <div className="flex items-center rounded-xl border border-[var(--gold)]/35 bg-[var(--background)] p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-[var(--gold)] text-[#1f160f] shadow-sm"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {t("monthly", "شهري")}
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`rounded-lg px-3 py-1.5 transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === "annual"
                      ? "bg-[var(--gold)] text-[#1f160f] shadow-sm"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span>{t("annual", "سنوي")}</span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 text-[0.62rem] font-extrabold border border-emerald-500/30">
                    -17%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Tiers Grid — Pixel-perfect alignment with attached screenshot */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-7xl mx-auto">
          {tiers.map((tier) => {
            const isBasic = tier.id === 1;
            const isPremium = tier.id === 2;
            const isHistorian = tier.id === 3;

            return (
              <div
                key={tier.id}
                className={`surface-card frame-gold p-6 sm:p-7 rounded-2xl shadow-xl flex flex-col justify-between relative transition-all duration-300 text-start ${
                  tier.isCurrent
                    ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/40 bg-[var(--card)]"
                    : "border-[var(--gold)]/35 hover:-translate-y-1.5 hover:shadow-2xl bg-[var(--card)]"
                }`}
              >
                {/* Active Plan or Highlight Badge */}
                {tier.isCurrent && (
                  <span className="absolute -top-3.5 start-6 px-3.5 py-1 rounded-full text-[0.68rem] font-extrabold uppercase tracking-wide bg-[var(--gold)] text-[#1f160f] shadow-md border border-[#1f160f]/20">
                    {t("current_active_plan", "الخطة النشطة الحالية")}
                  </span>
                )}
                {!tier.isCurrent && tier.badge && (
                  <span className="absolute -top-3.5 start-6 px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/40 backdrop-blur-sm shadow-sm">
                    {tier.badge}
                  </span>
                )}

                <div>
                  {/* Tier Title */}
                  <h3 className="font-display text-2xl font-bold text-[var(--foreground)] mt-2">
                    {tier.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 my-4 border-b border-[var(--gold)]/20 pb-4">
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--gold)]">
                      {tier.priceDisplay}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] font-semibold">
                      {tier.period}
                    </span>
                  </div>

                  {/* 8 Feature Quota Items (Matching user screenshot) */}
                  <div className="space-y-3 text-xs sm:text-sm text-[var(--foreground)] py-2">
                    {featureLabels.map((f) => {
                      const limit = tier.limits[f.key as keyof typeof tier.limits];
                      return (
                        <div key={f.key} className="flex items-center gap-2.5">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                          <span className="font-bold font-mono text-[var(--gold)] text-sm shrink-0">
                            {limit}
                          </span>
                          <span className="text-[var(--foreground)] font-medium leading-snug">
                            {f.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-6 mt-4 border-t border-[var(--gold)]/20">
                  {tier.isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-xl bg-black/10 dark:bg-white/10 border border-[var(--border)] text-[var(--muted-foreground)] font-bold text-xs sm:text-sm cursor-default text-center shadow-inner"
                    >
                      {t("active_plan_btn", "الباقة الحالية")}
                    </button>
                  ) : isBasic ? (
                    <button
                      type="button"
                      onClick={() => handleSelectTier(tier)}
                      className="w-full py-3 rounded-xl border-2 border-[var(--gold)]/40 hover:border-[var(--gold)] bg-[var(--background)] hover:bg-[var(--gold)]/10 text-[var(--foreground)] text-xs sm:text-sm font-bold text-center cursor-pointer transition-colors shadow-sm"
                    >
                      {t("start_free", "الباقة المجانية")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectTier(tier)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--gold)] to-amber-600 hover:from-amber-500 hover:to-[var(--gold)] text-[#1f160f] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] transition-all"
                    >
                      <Crown className="w-4 h-4 shrink-0 text-[#1f160f]" />
                      <span>
                        {t("upgrade_to", "ترقية إلى")} {tier.name}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-12 text-center text-xs text-[var(--muted-foreground)] flex items-center justify-center gap-2 max-w-xl mx-auto">
          <ShieldCheck className="h-4 w-4 text-[var(--gold)] shrink-0" />
          <span>
            {t(
              "subscriptions_guarantee",
              "دفع آمن ومحمي · إمكانية الإلغاء أو الترقية في أي وقت من إعدادات الحساب · دعم فني متخصص",
            )}
          </span>
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-20">
          <SectionHeading
            center={true}
            eyebrow={t("comparison_eyebrow", "مقارنة دقيقة")}
            title={t("compare_all_features", "مقارنة الميزات والسعات بالتفصيل")}
            intro={t("compare_intro", "جدول تفصيلي يوضح كافة الفروقات بين الباقات لمساعدتك على اختيار الأنسب.")}
          />

          <div className="surface-card frame-gold mt-10 rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--foreground)]">
                    <th className="py-4 px-6 text-start font-bold uppercase tracking-wider text-xs">
                      {t("feature", "الميزة")}
                    </th>
                    <th className="py-4 px-4 text-center font-bold text-xs">Basic</th>
                    <th className="py-4 px-4 text-center font-bold text-xs text-[var(--gold)]">Premium</th>
                    <th className="py-4 px-4 text-center font-bold text-xs">Family Historian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[var(--gold)]/5 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-[var(--foreground)]">
                        {row.feature}
                      </td>

                      {[row.basic, row.premium, row.historian].map((val, cellIdx) => (
                        <td key={cellIdx} className="py-3.5 px-4 text-center">
                          {typeof val === "boolean" ? (
                            val ? (
                              <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-rose-400 mx-auto opacity-60" />
                            )
                          ) : (
                            <span
                              className={`font-semibold ${
                                cellIdx === 1 ? "text-[var(--gold)] font-bold" : "text-[var(--foreground)]"
                              }`}
                            >
                              {val}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Collapsible FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <SectionHeading
            center={true}
            eyebrow={t("faq_eyebrow", "الأسئلة الشائعة")}
            title={t("frequently_asked_questions", "كل ما تحتاج معرفته عن الاشتراكات والدفع")}
            intro={t("faq_intro", "إجابات واضحة ومباشرة حول طرق الدفع وأسعار الصرف وتفعيل السعات.")}
          />

          <div className="mt-10 space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="surface-card frame-gold rounded-xl border border-[var(--gold)]/30 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-start font-bold flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--gold)]/5 transition-colors text-xs sm:text-sm"
                  >
                    <span className="flex items-center gap-2.5 text-[var(--foreground)]">
                      <HelpCircle className="h-4 w-4 text-[var(--gold)] shrink-0" />
                      <span>{t(faq.qKey, faq.defaultQ)}</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[var(--gold)] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed border-t border-[var(--gold)]/10">
                      {t(faq.aKey, faq.defaultA)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Section>
    </div>
  );
}
