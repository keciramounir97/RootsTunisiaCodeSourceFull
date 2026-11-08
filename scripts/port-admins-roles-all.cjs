/**
 * Port fused Admins & Roles page + restore subscription/content sidebar links
 * to Egypt, Abraham, Maghreb. Also patches Tunisia App already done separately.
 */
const fs = require("fs");
const path = require("path");

const TN = "C:\\Users\\mounir\\Desktop\\codebases\\RootsTunisiaCodeSourceFull";
const EG =
  "C:\\Users\\mounir\\Desktop\\codebases\\RootsEgypt-full-SourceCode-main\\RootsEgypt-full-SourceCode-main";
const AB =
  "C:\\Users\\mounir\\Desktop\\codebases\\AbrahamRoots-full-code-source-main\\AbrahamRoots-full-code-source-main";
const MG =
  "C:\\Users\\mounir\\Desktop\\codebases\\RootsMaghrebCodeSource-main\\RootsMaghrebCodeSource-main";

const I18N = {
  en: {
    admins_roles: "Admins & Roles",
    admins_roles_title: "Admins & Roles",
    admins_roles_subtitle:
      "Manage page admins, super administrators, and role page access in one place.",
    admins_roles_eyebrow: "Access Control",
    admins_roles_tab_page_admins: "Page Admins & Access",
    admins_roles_tab_super_admins: "Super Administrators",
    admins_roles_tab_role_distribution: "Role Distribution",
  },
  fr: {
    admins_roles: "Administrateurs & Rôles",
    admins_roles_title: "Administrateurs & Rôles",
    admins_roles_subtitle:
      "Gérez les administrateurs de pages, les super-administrateurs et les accès par rôle au même endroit.",
    admins_roles_eyebrow: "Contrôle d'accès",
    admins_roles_tab_page_admins: "Admins & Accès aux Pages",
    admins_roles_tab_super_admins: "Super Administrateurs",
    admins_roles_tab_role_distribution: "Répartition des Rôles",
  },
  ar: {
    admins_roles: "المشرفون والأدوار",
    admins_roles_title: "المشرفون والأدوار",
    admins_roles_subtitle:
      "إدارة مشرفي الصفحات والمشرفين العامين وصلاحيات الأدوار في مكان واحد.",
    admins_roles_eyebrow: "التحكم في الوصول",
    admins_roles_tab_page_admins: "مشرفو الصفحات والصلاحيات",
    admins_roles_tab_super_admins: "المشرفون العامون",
    admins_roles_tab_role_distribution: "توزيع الأدوار",
  },
  es: {
    admins_roles: "Administradores y Roles",
    admins_roles_title: "Administradores y Roles",
    admins_roles_subtitle:
      "Gestione administradores de páginas, superadministradores y acceso por roles en un solo lugar.",
    admins_roles_eyebrow: "Control de acceso",
    admins_roles_tab_page_admins: "Admins y Acceso a Páginas",
    admins_roles_tab_super_admins: "Superadministradores",
    admins_roles_tab_role_distribution: "Distribución de Roles",
  },
};

const LINKS_BLOCK = `const links = [
  { to: "/admin", end: true, labelKey: "dashboard", Icon: LayoutDashboard },
  { to: "/admin/usage", labelKey: "usage_quotas", Icon: Gauge },
  { to: "/admin/trees", labelKey: "trees", Icon: Network },
  { to: "/admin/individuals", labelKey: "individuals", Icon: UserRound, permissionKey: "trees" },
  { to: "/admin/sources-archives", labelKey: "my_sources", Icon: Archive },
  { to: "/admin/tasks", labelKey: "tasks", Icon: ListChecks },
  { to: "/admin/notes", labelKey: "notes", Icon: StickyNote },
  { to: "/admin/gallery", labelKey: "gallery", Icon: Image },
  { to: "/admin/diaporama", labelKey: "diaporama", Icon: SlidersHorizontal },
  { to: "/admin/audios", labelKey: "audios", Icon: Music },
  { to: "/admin/documents", labelKey: "documents", Icon: FileText },
  { to: "/admin/books", labelKey: "books", Icon: BookOpen },
  { to: "/admin/articles", labelKey: "articles", Icon: Newspaper },
  { to: "/admin/users", labelKey: "users", Icon: Users },
  { to: "/admin/admins-roles", labelKey: "admins_roles", Icon: Shield },
  { to: "/admin/contact-messages", labelKey: "contact_messages", Icon: MessageSquare },
  { to: "/admin/newsletter", labelKey: "newsletter", Icon: Mail },
  { to: "/admin/subscriptions", labelKey: "subscriptions", Icon: Crown },
  { to: "/admin/tier-features", labelKey: "tier_features_title", Icon: ListChecks },
  { to: "/admin/subscription-payments", labelKey: "subscription_payments", Icon: Wallet },
  { to: "/admin/flagged-payments", labelKey: "flagged_payments", Icon: Flag },
  { to: "/admin/payment-settings", labelKey: "payment_settings", Icon: Wallet },
  { to: "/admin/currencies", labelKey: "currencies_exchange", Icon: Coins },
  { to: "/admin/legal-content", labelKey: "legal_content", Icon: Scale },
  { to: "/admin/content", labelKey: "public_content_manager", Icon: Layout },
  { to: "/admin/settings", labelKey: "settings", Icon: Settings },
  { to: "/admin/activity", labelKey: "activity", Icon: Activity },
  { to: "/admin/footer-settings", labelKey: "footer_settings", Icon: Globe },
  { to: "/admin/backups", labelKey: "backups", Icon: ArchiveRestore },
];`;

const FALLBACKS_EXTRA = `
  admins_roles: "Administrateurs & Rôles",
  subscriptions: "Abonnements & Limites",
  tier_features_title: "Fonctionnalités & Quotas des Offres",
  subscription_payments: "Paiements d'Abonnement",
  flagged_payments: "Paiements Signalés",
  payment_settings: "Moyens de Paiement",
  currencies_exchange: "Devises & Taux de Change",
  legal_content: "Contenu Juridique",
  public_content_manager: "Gestion du Contenu Public",
  settings: "Paramètres",
`;

function ensureImport(src, symbol) {
  if (src.includes(symbol) || src.includes(`${symbol},`) || src.includes(`${symbol} }`))
    return src;
  // Add after first lucide-react import opening
  return src.replace(
    /from "lucide-react";/,
    `  ${symbol},\n} from "lucide-react";`.replace(
      "} from",
      // fallback won't work - do different approach
      "UNUSED",
    ),
  );
}

function addLucideImports(src, needed) {
  const m = src.match(/import\s*\{([\s\S]*?)\}\s*from\s*["']lucide-react["']/);
  if (!m) return src;
  const current = m[1];
  const missing = needed.filter((n) => !new RegExp(`\\b${n}\\b`).test(current));
  if (!missing.length) return src;
  const insertion = missing.map((n) => `  ${n},`).join("\n");
  return src.replace(m[0], `import {\n${current.trim().replace(/,?$/, ",")}\n${insertion}\n} from "lucide-react"`);
}

function patchSidebarLinks(filePath, usageLabelKey = "usage_quotas", tasksKey = "tasks", notesKey = "notes", contactKey = "contact_messages") {
  let src = fs.readFileSync(filePath, "utf8");
  src = addLucideImports(src, [
    "Flag",
    "Coins",
    "Scale",
    "Layout",
    "Wallet",
    "Crown",
    "SlidersHorizontal",
    "StickyNote",
    "Archive",
    "ArchiveRestore",
    "Gauge",
  ]);

  let links = LINKS_BLOCK
    .replace('labelKey: "usage_quotas"', `labelKey: "${usageLabelKey}"`)
    .replace('labelKey: "tasks"', `labelKey: "${tasksKey}"`)
    .replace('labelKey: "notes"', `labelKey: "${notesKey}"`)
    .replace('labelKey: "contact_messages"', `labelKey: "${contactKey}"`);

  src = src.replace(/const links = \[[\s\S]*?\];/, links);

  // Ensure fallbacks contain restored keys
  if (!src.includes("admins_roles:")) {
    src = src.replace(
      /const labelFallbacks: Record<string, string> = \{/,
      `const labelFallbacks: Record<string, string> = {\n${FALLBACKS_EXTRA}`,
    );
  }

  // Update superAdminOnlyRoutes
  const superBlock = `const superAdminOnlyRoutes = [
  "/admin/admins-roles",
  "/admin/admins",
  "/admin/super-admins",
  "/admin/role-distribution",
  "/admin/subscriptions",
  "/admin/tier-features",
  "/admin/subscription-payments",
  "/admin/flagged-payments",
  "/admin/payment-settings",
  "/admin/currencies",
  "/admin/legal-content",
  "/admin/content",
  "/admin/settings",
  "/admin/backups",
];`;
  if (src.includes("superAdminOnlyRoutes")) {
    src = src.replace(/const superAdminOnlyRoutes = \[[\s\S]*?\];/, superBlock);
  }

  // Also patch inline superAdminOnly arrays in filter
  src = src.replace(
    /const superAdminOnly = \[[\s\S]*?\];/g,
    `const superAdminOnly = [
      "/admin/admins-roles",
      "/admin/admins",
      "/admin/super-admins",
      "/admin/role-distribution",
    ];`,
  );

  fs.writeFileSync(filePath, src);
  console.log("sidebar patched", filePath);
}

function patchEmbeddedExport(filePath, exportName) {
  let src = fs.readFileSync(filePath, "utf8");
  if (src.includes("embedded = false")) {
    console.log("already embedded", filePath);
    return;
  }

  // Function signature
  const re = new RegExp(
    `export default function ${exportName}\\(\\) \\{`,
  );
  if (!re.test(src)) {
    console.warn("export not found", exportName, filePath);
    return;
  }
  src = src.replace(
    re,
    `export default function ${exportName}({\n  embedded = false,\n}: {\n  embedded?: boolean;\n} = {}) {`,
  );

  // Soften SuperAdmins hardcoded fallback if present
  if (exportName === "SuperAdmins") {
    src = src.replace(
      /catch\s*\{[\s\S]*?setSuperAdmins\(\[[\s\S]*?\]\);[\s\S]*?\} finally/,
      "catch {\n      setSuperAdmins([]);\n    } finally",
    );
    // Normalize name mapping lightly - optional
  }

  // Outer wrapper className for min-h-screen pages
  src = src.replace(
    /className=\{`min-h-screen p-6 \$\{([^}]+)\}`\}/,
    (m, inner) => `className={embedded ? "" : \`min-h-screen p-6 \${${inner}}\`}`,
  );
  src = src.replace(
    /className=\{`min-h-screen p-6 \$\{palette\.page\}`\}/,
    'className={embedded ? "" : `min-h-screen p-6 ${palette.page}`}',
  );

  fs.writeFileSync(filePath, src);
  console.log("embedded patched", filePath);
}

function writeAdminsRoles(root, mode) {
  const tn = fs.readFileSync(
    path.join(TN, "frontend/src/admin/pages/AdminsRoles.tsx"),
    "utf8",
  );
  let out = tn;
  if (mode === "translation") {
    out = out
      .replace(
        'import { useLanguage } from "../../i18n";',
        'import { useTranslation } from "../../context/TranslationContext";',
      )
      .replace(
        "const { t, dir } = useLanguage();",
        "const { t, dir, isRtl: rtlFlag } = useTranslation();\n  const isRtl = rtlFlag ?? dir === \"rtl\";",
      )
      .replace(
        "const isRtl = dir === \"rtl\";\n  const isSuperAdmin",
        "const isSuperAdmin",
      );
  }
  const dest = path.join(root, "frontend/src/admin/pages/AdminsRoles.tsx");
  fs.writeFileSync(dest, out);
  console.log("wrote", dest);
}

function patchApp(root) {
  const appPath = path.join(root, "frontend/src/App.tsx");
  let src = fs.readFileSync(appPath, "utf8");

  if (!src.includes('from "react-router-dom"') && !src.includes("from 'react-router-dom'")) {
    console.warn("no react-router import", appPath);
  }
  if (!src.includes("Navigate")) {
    src = src.replace(
      /import \{([^}]+)\} from ["']react-router-dom["']/,
      (m, inner) => {
        if (inner.includes("Navigate")) return m;
        return `import {${inner}, Navigate } from "react-router-dom"`;
      },
    );
  }

  // Add AdminsRoles import
  if (!src.includes("AdminsRoles")) {
    if (src.includes('lazy(() => import("./admin/pages/AdminManagement"))')) {
      src = src.replace(
        /const AdminManagement = lazy\(\(\) => import\("\.\/admin\/pages\/AdminManagement"\)\);/,
        'const AdminsRoles = lazy(() => import("./admin/pages/AdminsRoles"));',
      );
    } else if (src.includes('import AdminManagement from "./admin/pages/AdminManagement"')) {
      src = src.replace(
        'import AdminManagement from "./admin/pages/AdminManagement";',
        'import AdminsRoles from "./admin/pages/AdminsRoles";',
      );
    } else {
      src = src.replace(
        /import RoleDistribution from "\.\/admin\/pages\/RoleDistribution";/,
        'import AdminsRoles from "./admin/pages/AdminsRoles";\nimport RoleDistribution from "./admin/pages/RoleDistribution";',
      );
    }
  }

  // Remove unused SuperAdmins/RoleDistribution/AdminManagement imports if still referenced only as routes
  // Replace route blocks simply by redirecting paths

  const routeReplacements = [
    [
      /path=["']admins["'][\s\S]*?<\/Route>/,
      `path="admins-roles"\n          element={\n            <Suspense fallback={<AdminLoadingFallback />}>\n              <ProtectedRoute roles={[3]}>\n                <AdminsRoles />\n              </ProtectedRoute>\n            </Suspense>\n          }\n        />\n        <Route path="admins" element={<Navigate to="/admin/admins-roles" replace />} />`,
    ],
  ];

  // If admins-roles already exists skip first
  if (!src.includes('path="admins-roles"') && !src.includes("path='admins-roles'")) {
    // Try replace AdminManagement route
    if (/path=["']admins["']/.test(src)) {
      src = src.replace(
        /<Route\s+path=["']admins["'][\s\S]*?\/>\s*/,
        `<Route
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
        `,
      );
      // Also handle multi-line Route with closing tag
      if (src.includes("<AdminManagement")) {
        src = src.replace(
          /<Route[\s\S]*?path=["']admins["'][\s\S]*?<AdminManagement[\s\S]*?<\/Route>/,
          `<Route
          path="admins-roles"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[3]}>
                <AdminsRoles />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route path="admins" element={<Navigate to="/admin/admins-roles" replace />} />`,
        );
      }
    }
  }

  // Redirect super-admins and role-distribution
  src = src.replace(
    /<Route[\s\S]*?path=["']super-admins["'][\s\S]*?<\/Route>/,
    `<Route path="super-admins" element={<Navigate to="/admin/admins-roles" replace />} />`,
  );
  src = src.replace(
    /<Route[\s\S]*?path=["']role-distribution["'][\s\S]*?<\/Route>/,
    `<Route path="role-distribution" element={<Navigate to="/admin/admins-roles" replace />} />`,
  );

  // Self-closing Route variants
  src = src.replace(
    /<Route\s+path=["']super-admins["'][^/]*\/>/,
    `<Route path="super-admins" element={<Navigate to="/admin/admins-roles" replace />} />`,
  );

  fs.writeFileSync(appPath, src);
  console.log("app patched", appPath);
}

function patchEgyptI18n() {
  for (const lang of ["en", "fr", "ar", "es"]) {
    const p = path.join(EG, `frontend/src/i18n/translations/${lang}.ts`);
    let src = fs.readFileSync(p, "utf8");
    if (src.includes("admins_roles:")) continue;
    const entries = Object.entries(I18N[lang])
      .map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`)
      .join("\n");
    // Insert before final closing of default export object
    src = src.replace(/\n\};\s*$/, `\n${entries}\n};\n`);
    // Also handle `export default {`
    if (!src.includes("admins_roles:")) {
      src = src.replace(/(\nexport default \{)/, `$1\n${entries}`);
    }
    fs.writeFileSync(p, src);
    console.log("eg i18n", lang);
  }
}

function patchTranslationsTs(root) {
  const p = path.join(root, "frontend/src/utils/translations.ts");
  if (!fs.existsSync(p)) {
    console.warn("no translations.ts", p);
    return;
  }
  let src = fs.readFileSync(p, "utf8");
  if (src.includes("admins_roles:")) {
    console.log("i18n already", p);
    return;
  }
  for (const lang of ["en", "fr", "ar", "es"]) {
    const entries = Object.entries(I18N[lang])
      .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
      .join("\n");
    // Find lang block like `en: {` at translations root - insert after opening
    const re = new RegExp(`(\\n\\s*${lang}:\\s*\\{)`);
    if (re.test(src)) {
      src = src.replace(re, `$1\n${entries}`);
    }
  }
  fs.writeFileSync(p, src);
  console.log("translations patched", p);
}

// --- Tunisia locales ---
require("./patch-admins-roles-i18n.cjs");

// --- Egypt ---
writeAdminsRoles(EG, "language");
patchEmbeddedExport(path.join(EG, "frontend/src/admin/pages/AdminManagement.tsx"), "AdminManagement");
patchEmbeddedExport(path.join(EG, "frontend/src/admin/pages/SuperAdmins.tsx"), "SuperAdmins");
patchEmbeddedExport(path.join(EG, "frontend/src/admin/pages/RoleDistribution.tsx"), "RoleDistribution");
patchSidebarLinks(
  path.join(EG, "frontend/src/admin/components/AdminSidebar.tsx"),
  "usage_and_quotas",
  "admin_tasks",
  "admin_notes",
  "contactMessages",
);
patchApp(EG);
patchEgyptI18n();

// --- Abraham ---
writeAdminsRoles(AB, "translation");
patchEmbeddedExport(path.join(AB, "frontend/src/admin/pages/AdminManagement.tsx"), "AdminManagement");
patchEmbeddedExport(path.join(AB, "frontend/src/admin/pages/SuperAdmins.tsx"), "SuperAdmins");
patchEmbeddedExport(path.join(AB, "frontend/src/admin/pages/RoleDistribution.tsx"), "RoleDistribution");
patchSidebarLinks(path.join(AB, "frontend/src/admin/components/AdminSidebar.tsx"));
patchApp(AB);
patchTranslationsTs(AB);

// --- Maghreb ---
writeAdminsRoles(MG, "translation");
patchEmbeddedExport(path.join(MG, "frontend/src/admin/pages/AdminManagement.tsx"), "AdminManagement");
patchEmbeddedExport(path.join(MG, "frontend/src/admin/pages/SuperAdmins.tsx"), "SuperAdmins");
patchEmbeddedExport(path.join(MG, "frontend/src/admin/pages/RoleDistribution.tsx"), "RoleDistribution");
patchSidebarLinks(path.join(MG, "frontend/src/admin/components/AdminSidebar.tsx"));
patchApp(MG);
patchTranslationsTs(MG);

console.log("done");
