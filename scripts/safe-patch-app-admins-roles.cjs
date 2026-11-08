const fs = require("fs");
const path = require("path");

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

function ensureNavigate(src) {
  if (/\bNavigate\b/.test(src.split("\n").slice(0, 40).join("\n"))) return src;
  return src.replace(
    /import \{([^}]+)\} from ["']react-router-dom["']/,
    (m, inner) => `import {${inner}, Navigate } from "react-router-dom"`,
  );
}

function ensureAdminsRolesImport(src) {
  if (src.includes("AdminsRoles")) return src;
  if (src.includes('import AdminManagement from "./admin/pages/AdminManagement"')) {
    return src.replace(
      'import AdminManagement from "./admin/pages/AdminManagement";',
      'import AdminsRoles from "./admin/pages/AdminsRoles";\nimport AdminManagement from "./admin/pages/AdminManagement";',
    );
  }
  if (src.includes('lazy(() => import("./admin/pages/AdminManagement"))')) {
    return src.replace(
      /const AdminManagement = lazy\(\(\) => import\("\.\/admin\/pages\/AdminManagement"\)\);/,
      'const AdminsRoles = lazy(() => import("./admin/pages/AdminsRoles"));\nconst AdminManagement = lazy(() => import("./admin/pages/AdminManagement"));',
    );
  }
  throw new Error("no AdminManagement import");
}

function replaceComponentRoute(src, routePath, componentName, replacement) {
  const needle = `path="${routePath}"`;
  const idx = src.indexOf(needle);
  if (idx < 0) {
    console.warn("missing path", routePath);
    return src;
  }
  const start = src.lastIndexOf("<Route", idx);
  if (start < 0) throw new Error("no Route start for " + routePath);

  // Prefer explicit </Route>, else self-closing Route block ending at indent "        />"
  let end = -1;
  let endLen = 0;
  const closeTag = src.indexOf("</Route>", idx);
  const selfClose = src.indexOf("\n        />", idx);
  if (closeTag >= 0 && (selfClose < 0 || closeTag < selfClose + 20)) {
    // Use </Route> only if it appears before next sibling Route start
    const nextRoute = src.indexOf("\n        <Route", idx + 1);
    if (nextRoute < 0 || closeTag < nextRoute) {
      end = closeTag;
      endLen = "</Route>".length;
    }
  }
  if (end < 0 && selfClose >= 0) {
    end = selfClose;
    endLen = "\n        />".length;
  }
  if (end < 0) throw new Error("no Route end for " + routePath);

  const block = src.slice(start, end + endLen);
  if (componentName && !block.includes(componentName)) {
    console.warn("component mismatch for", routePath, "missing", componentName);
  }
  return src.slice(0, start) + replacement + src.slice(end + endLen);
}

const FUSED = `<Route
          path="admins-roles"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute roles={[3]}>
                <AdminsRoles />
              </ProtectedRoute>
            </Suspense>
          }
        />`;

const REDIR = (p) => `<Route
          path="${p}"
          element={<Navigate to="/admin/admins-roles" replace />}
        />`;

function patchApp(appPath) {
  let src = fs.readFileSync(appPath, "utf8");
  const before = (src.match(/<Route/g) || []).length;
  src = ensureNavigate(src);
  src = ensureAdminsRolesImport(src);

  if (!src.includes('path="admins-roles"')) {
    src = replaceComponentRoute(
      src,
      "admins",
      "AdminManagement",
      `${FUSED}\n        ${REDIR("admins")}`,
    );
  } else {
    console.log("admins-roles already present", appPath);
  }

  if (src.includes('path="admin-management"')) {
    src = replaceComponentRoute(
      src,
      "admin-management",
      "AdminManagement",
      REDIR("admin-management"),
    );
  }

  if (src.includes('path="super-admins"')) {
    src = replaceComponentRoute(src, "super-admins", "SuperAdmins", REDIR("super-admins"));
  }

  if (src.includes('path="role-distribution"')) {
    src = replaceComponentRoute(
      src,
      "role-distribution",
      "RoleDistribution",
      REDIR("role-distribution"),
    );
  }

  const after = (src.match(/<Route/g) || []).length;
  // Expect roughly same count: admins becomes 2 routes (+1), others stay 1
  if (after < before) {
    throw new Error(`route count dropped ${before} -> ${after} in ${appPath}`);
  }
  fs.writeFileSync(appPath, src);
  console.log("ok", appPath, before, "->", after);
}

function patchTranslations(filePath) {
  if (!fs.existsSync(filePath)) return;
  let src = fs.readFileSync(filePath, "utf8");
  if (src.includes("admins_roles:")) {
    console.log("i18n ok", filePath);
    return;
  }
  for (const lang of ["en", "fr", "ar", "es"]) {
    const entries = Object.entries(I18N[lang])
      .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
      .join("\n");
    const re = new RegExp(`(\\n\\s*${lang}:\\s*\\{)`);
    if (re.test(src)) src = src.replace(re, `$1\n${entries}`);
  }
  fs.writeFileSync(filePath, src);
  console.log("i18n patched", filePath);
}

const roots = [
  "C:\\Users\\mounir\\Desktop\\codebases\\RootsEgypt-full-SourceCode-main\\RootsEgypt-full-SourceCode-main",
  "C:\\Users\\mounir\\Desktop\\codebases\\AbrahamRoots-full-code-source-main\\AbrahamRoots-full-code-source-main",
  "C:\\Users\\mounir\\Desktop\\codebases\\RootsMaghrebCodeSource-main\\RootsMaghrebCodeSource-main",
];

for (const root of roots) {
  patchApp(path.join(root, "frontend/src/App.tsx"));
  patchTranslations(path.join(root, "frontend/src/utils/translations.ts"));
}

for (const root of roots.slice(1)) {
  const p = path.join(root, "frontend/src/admin/pages/AdminsRoles.tsx");
  let src = fs.readFileSync(p, "utf8");
  src = src.replace(
    /const isRtl = rtlFlag \?\? dir === "rtl";\n  const \{ user \} = useAuth\(\);\n  const isRtl = dir === "rtl";\n/,
    'const isRtl = rtlFlag ?? dir === "rtl";\n  const { user } = useAuth();\n',
  );
  fs.writeFileSync(p, src);
}

console.log("done");
