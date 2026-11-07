import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense, useEffect, memo, lazy } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSiteImages } from "./hooks/useSiteImages";

// ===== EAGERLY LOADED (Critical Path) =====
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import { useTranslation } from "./context/TranslationContext";
import ProtectedRoute from "./admin/components/protectedRoute";
import Home from "./pages/home";
import SeoHead from "./seo/SeoHead";
import { splitLocaleFromPath } from "./seo/localeRouting";

// ===== LAZY LOADED ROUTE COMPONENTS =====
const GalleryPage = lazy(() => import("./pages/Gallery"));
const Periods = lazy(() => import("./pages/periods"));
const SourcesAndArchives = lazy(() => import("./pages/SourcesAndArchives"));
const ContactUs = lazy(() => import("./pages/contactUs"));
const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/signup"));
const ResetPassword = lazy(() => import("./pages/resetpassword"));
const ErrorPage = lazy(() => import("./pages/error"));

// ===== GALLERY SUB-PAGES =====
const GalleryTrees = lazy(() => import("./pages/GalleryTrees"));
const GalleryImages = lazy(() => import("./pages/GalleryImages"));
const GalleryBooks = lazy(() => import("./pages/GalleryBooks"));
const GalleryAudios = lazy(() => import("./pages/GalleryAudios"));

// ===== NEW FEATURE PAGES =====
const Subscriptions = lazy(() => import("./pages/subscriptions"));
const Tasks = lazy(() => import("./pages/tasks"));
const Notes = lazy(() => import("./pages/notes"));
const Reminders = lazy(() => import("./pages/reminders"));
const Payment = lazy(() => import("./pages/payment"));

// ===== LEGAL & INFO PAGES =====
const Terms = lazy(() => import("./pages/terms"));
const Privacy = lazy(() => import("./pages/privacy"));
const Cookies = lazy(() => import("./pages/cookies"));
const Refund = lazy(() => import("./pages/refund"));
const Unsubscribe = lazy(() => import("./pages/unsubscribe"));

import { ErrorBoundary } from "./components/ErrorBoundary";
import CookieConsentBanner from "./components/CookieConsentBanner";

// ===== ADMIN ROUTE COMPONENTS =====
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const Usage = lazy(() => import("./admin/pages/Usage"));
const ContactSupport = lazy(() => import("./admin/pages/ContactSupport"));
const Trees = lazy(() => import("./admin/pages/Trees"));
const Individuals = lazy(() => import("./admin/pages/Individuals"));
const AdminGallery = lazy(() => import("./admin/pages/Gallery"));
const AdminBooks = lazy(() => import("./admin/pages/Books"));
const UsersPage = lazy(() => import("./admin/pages/Users"));
const Settings = lazy(() => import("./admin/pages/Settings"));
const ActivityLog = lazy(() => import("./admin/pages/ActivityLog"));

const AdminSourcesAndArchives = lazy(() => import("./admin/pages/SourcesAndArchives"));
const AdminAudios = lazy(() => import("./admin/pages/Audios"));
const AdminDocuments = lazy(() => import("./admin/pages/Documents"));
const NewsletterSubscribers = lazy(() => import("./admin/pages/NewsletterSubscribers"));
const ContactMessages = lazy(() => import("./admin/pages/ContactMessages"));
const SuperAdminApprovals = lazy(() => import("./admin/pages/SuperAdminApprovals"));
const AdminsRoles = lazy(() => import("./admin/pages/AdminsRoles"));
const UserApprovals = lazy(() => import("./admin/pages/UserApprovals"));
const FooterSettings = lazy(() => import("./admin/pages/FooterSettings"));
const HeroImages = lazy(() => import("./admin/pages/HeroImages"));
const BackgroundImages = lazy(() => import("./admin/pages/BackgroundImages"));
const ValidationApprovals = lazy(() => import("./admin/pages/ValidationApprovals"));
const PasswordResetRequests = lazy(() => import("./admin/pages/PasswordResetRequests"));
const AccountDeletionRequests = lazy(() => import("./admin/pages/AccountDeletionRequests"));
const SubscriptionsAdmin = lazy(() => import("./admin/pages/Subscriptions"));
const SubscriptionPayments = lazy(() => import("./admin/pages/SubscriptionPayments"));
const FlaggedPayments = lazy(() => import("./admin/pages/FlaggedPayments"));
const UserUpgrade = lazy(() => import("./admin/pages/UserUpgrade"));
const UserSettings = lazy(() => import("./admin/pages/UserSettings"));
const AdminTasks = lazy(() => import("./admin/pages/AdminTasks"));
const AdminNotes = lazy(() => import("./admin/pages/AdminNotes"));

// ===== NEW FEATURE PAGES (redesign parity) =====
const GalleryDocuments = lazy(() => import("./pages/GalleryDocuments"));
const GalleryArticles = lazy(() => import("./pages/GalleryArticles"));
const ArticlesPage = lazy(() => import("./pages/articles"));
const AboutPage = lazy(() => import("./pages/about"));
const ResearchPage = lazy(() => import("./pages/Research"));
const GenealogyGallery = lazy(() => import("./pages/genealogy-gallery"));
const AudioPage = lazy(() => import("./pages/audio"));
const MyDownloadRequests = lazy(() => import("./pages/MyDownloadRequests"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));

// ===== NEW ADMIN PAGES (redesign parity) =====
const PaymentSettings = lazy(() => import("./admin/pages/PaymentSettings"));
const Currencies = lazy(() => import("./admin/pages/Currencies"));
const Backups = lazy(() => import("./admin/pages/Backups"));
const AdminSuggestions = lazy(() => import("./admin/pages/Suggestions"));
const LegalContent = lazy(() => import("./admin/pages/LegalContent"));
const ContentManager = lazy(() => import("./admin/pages/ContentManager"));
const Diaporama = lazy(() => import("./admin/pages/Diaporama"));
const EmailTemplates = lazy(() => import("./admin/pages/EmailTemplates"));
const DownloadRequests = lazy(() => import("./admin/pages/DownloadRequests"));
const AdminArticles = lazy(() => import("./admin/pages/Articles"));
const TierFeatures = lazy(() => import("./admin/pages/TierFeatures"));

/** Pages where WhatsApp button should appear */
const WHATSAPP_PAGES = ["/", "/contact", "/subscriptions", "/tasks", "/notes", "/reminders"];

function LocaleSync() {
  const location = useLocation();
  const { setLocale } = useTranslation();

  useEffect(() => {
    const { locale } = splitLocaleFromPath(location.pathname);
    const queryLang = new URLSearchParams(location.search).get("lang");
    if (locale) setLocale(locale);
    else if (queryLang) setLocale(queryLang);
  }, [location.pathname, location.search, setLocale]);

  return null;
}

/** Wrapper that uses useLocation so App stays a valid hook boundary; avoids invalid hook call when router context is missing. */
function AppWithRouter() {
  const location = useLocation();
  const { t } = useTranslation();
  const { path } = splitLocaleFromPath(location.pathname);
  const isAdminRoute = path.startsWith("/admin");
  const showWhatsApp = !isAdminRoute && WHATSAPP_PAGES.includes(path);
  const { backgroundImage } = useSiteImages();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
      offset: 50,
    });
  }, []);

  return (
    <div className="min-h-screen relative bg-[var(--background)] transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--gold)] focus:text-stone-950 focus:font-bold focus:rounded-md focus:shadow-xl focus:outline-none"
      >
        {t("skip_to_main_content", "الانتقال إلى المحتوى الرئيسي")}
      </a>
      <SeoHead />
      <LocaleSync />
      {/* Historic Tunisian Landmark Background with soft opacity across all pages, sections, navbar & admin */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-[0.06] dark:opacity-[0.08]"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="relative z-10">
        {!isAdminRoute && <Navbar />}
        <main id="main-content" className="outline-none" tabIndex={-1}>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <AppRoutes />
            </Suspense>
          </ErrorBoundary>
        </main>
        {!isAdminRoute && <Footer />}
        {showWhatsApp && <WhatsAppButton />}
        <CookieConsentBanner />
      </div>
    </div>
  );
}

/**
 * Loading Fallback Component
 * Memoized to prevent re-renders
 */
const LoadingFallback = memo(function LoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-2 border-[var(--primary)]/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-[var(--gold)] rounded-full animate-spin" />
          <div className="absolute inset-2 border-2 border-transparent border-b-[var(--primary)]/40 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
        </div>
        <p className="text-[var(--gold)] font-display text-lg tracking-widest">
          {t("loading", "Loading archives…")}
        </p>
      </div>
    </div>
  );
});

/**
 * Admin Loading Fallback (smaller, for nested routes)
 */
const AdminLoadingFallback = memo(function AdminLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-3 border-accent-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
});

/**
 * Route definitions
 */
function AppRoutes() {
  const location = useLocation();
  const { path } = splitLocaleFromPath(location.pathname);
  const stripped = { ...location, pathname: path };

  return (
    <Routes location={stripped} key={path}>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/" element={<Home />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/gallery/images" element={<GalleryImages />} />
      <Route path="/gallery/trees" element={<GalleryTrees />} />
      <Route path="/gallery/books" element={<GalleryBooks />} />
      <Route path="/gallery/audios" element={<GalleryAudios />} />
      <Route path="/gallery/documents" element={<GalleryDocuments />} />
      <Route path="/gallery/articles" element={<GalleryArticles />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/research" element={<ResearchPage />} />
      <Route path="/genealogy-gallery" element={<GenealogyGallery />} />
      <Route path="/audio" element={<AudioPage />} />
      <Route path="/my-download-requests" element={<Navigate to="/gallery" replace />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/library" element={<GalleryBooks />} />
      <Route path="/periods" element={<Periods />} />
      {/* Unified Sources & Archives page */}
      <Route path="/archives" element={<SourcesAndArchives />} />
      <Route path="/sources" element={<SourcesAndArchives />} />
      <Route path="/access-reliability" element={<SourcesAndArchives />} />
      <Route path="/sourcesandarchives" element={<SourcesAndArchives />} />
      <Route path="/contact" element={<ContactUs />} />

      {/* ===== AUTH ROUTES ===== */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ResetPassword />} />
      <Route path="/forgotpassword" element={<ResetPassword />} />

      {/* ===== FEATURE PAGES ===== */}
      <Route path="/subscriptions" element={<Subscriptions />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/:tier" element={<Payment />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/reminders" element={<Reminders />} />

      {/* ===== LEGAL & INFO PAGES ===== */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/refund" element={<Refund />} />
      <Route path="/unsubscribe" element={<Unsubscribe />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route
        path="/myprofile"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* ===== ADMIN ROUTES (PROTECTED) ===== */}
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute roles={[1, 2, 3]}>
              <AdminLayout />
            </ProtectedRoute>
          </Suspense>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["dashboard"]}>
                <Dashboard />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="usage"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["usage"]}>
                <Usage />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="support"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["support"]}>
                <ContactSupport />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="sources-archives"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["sources-archives"]}>
                <AdminSourcesAndArchives />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="trees"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["trees"]}>
                <Trees />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="individuals"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["trees"]}>
                <Individuals />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="gallery"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["gallery"]}>
                <AdminGallery />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="books"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["books"]}>
                <AdminBooks />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="users"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["users"]}>
                <UsersPage />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["settings"]}>
                <Settings />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="activity"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["activity"]}>
                <ActivityLog />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="audios"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["audios"]}>
                <AdminAudios />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="documents"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["documents"]}>
                <AdminDocuments />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="newsletter"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["newsletter"]}>
                <NewsletterSubscribers />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="contact-messages"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["contact-messages"]}>
                <ContactMessages />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="approvals"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[3]}>
                <SuperAdminApprovals />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="admins-roles"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[3]}>
                <AdminsRoles />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route path="admins" element={<Navigate to="/admin/admins-roles" replace />} />
        <Route
          path="footer-settings"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["footer-settings", "settings"]}>
                <FooterSettings />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="hero-images"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["hero-images"]}>
                <HeroImages />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="background-images"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["background-images"]}>
                <BackgroundImages />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="validation-approvals"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["validation-approvals"]}>
                <ValidationApprovals />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="password-reset-requests"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[3]}>
                <PasswordResetRequests />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="account-deletion-requests"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[3]}>
                <AccountDeletionRequests />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="role-distribution"
          element={<Navigate to="/admin/admins-roles" replace />}
        />
        <Route
          path="user-approvals"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["validation-approvals"]}>
                <UserApprovals />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="subscriptions"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["subscriptions"]}>
                <SubscriptionsAdmin />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="subscription-payments"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[1, 3]}>
                <SubscriptionPayments />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="flagged-payments"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[1, 3]}>
                <FlaggedPayments />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="user-upgrade"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["user-upgrade"]}>
                <UserUpgrade />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="user-settings"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["user-settings"]}>
                <UserSettings />
              </ProtectedRoute>
            </Suspense>
          }
        />

        <Route
          path="tasks"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["tasks"]}>
                <AdminTasks />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="notes"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["notes"]}>
                <AdminNotes />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="articles"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["articles"]}>
                <AdminArticles />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="tier-features"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[3]}>
                <TierFeatures />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="suggestions"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["suggestions"]}>
                <AdminSuggestions />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="download-requests"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute privileges={["download-requests"]}>
                <DownloadRequests />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="legal-content"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[3]}>
                <LegalContent />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="payment-settings"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[3]}>
                <PaymentSettings />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="currencies"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[3]}>
                <Currencies />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="super-admins"
          element={<Navigate to="/admin/admins-roles" replace />}
        />

        <Route
          path="diaporama"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[1, 3]}>
                <Diaporama />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="emails"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[3]}>
                <EmailTemplates />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="content"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[3]}>
                <ContentManager />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route path="backups" element={<Backups />} />
      </Route>

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

/**
 * Main App Component – delegates to AppWithRouter so useLocation runs inside BrowserRouter.
 */
function App() {
  return <AppWithRouter />;
}

export default App;
