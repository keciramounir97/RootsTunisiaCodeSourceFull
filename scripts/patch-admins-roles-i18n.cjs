const fs = require("fs");
const path = require("path");

const keys = {
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
  it: {
    admins_roles: "Amministratori e Ruoli",
    admins_roles_title: "Amministratori e Ruoli",
    admins_roles_subtitle:
      "Gestisci admin delle pagine, super admin e accessi per ruolo in un unico posto.",
    admins_roles_eyebrow: "Controllo accessi",
    admins_roles_tab_page_admins: "Admin e Accesso alle Pagine",
    admins_roles_tab_super_admins: "Super Amministratori",
    admins_roles_tab_role_distribution: "Distribuzione dei Ruoli",
  },
  mt: {
    admins_roles: "Amministraturi u Rwoli",
    admins_roles_title: "Amministraturi u Rwoli",
    admins_roles_subtitle:
      "Immaniġġja amministraturi tal-paġni, super-amministraturi u aċċess skont ir-rwol f'post wieħed.",
    admins_roles_eyebrow: "Kontroll tal-aċċess",
    admins_roles_tab_page_admins: "Admins u Aċċess għall-Paġni",
    admins_roles_tab_super_admins: "Super Amministraturi",
    admins_roles_tab_role_distribution: "Distribuzzjoni tar-Rwoli",
  },
};

const dir = path.join(__dirname, "../frontend/src/locales");
for (const [lang, vals] of Object.entries(keys)) {
  const p = path.join(dir, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  Object.assign(data, vals);
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
  console.log("updated", lang);
}
