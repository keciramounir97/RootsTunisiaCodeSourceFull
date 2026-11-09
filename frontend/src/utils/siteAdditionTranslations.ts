/**
 * New UI strings (public cards, forum, public content manager, admin categories…)
 * in the six supported locales. Entries are declared once as
 * [en, fr, ar, es, it, mt] and expanded into per-locale dictionaries.
 * Only NEW keys live here, so merging order is irrelevant.
 */
type Row = [string, string, string, string, string, string];

const ROWS: Record<string, Row> = {
  /* ---------- Public cards (sources / archives) ---------- */
  card_open_link: ["Open link", "Ouvrir le lien", "فتح الرابط", "Abrir enlace", "Apri il link", "Iftaħ il-link"],
  cards_empty: [
    "No cards have been published yet.",
    "Aucune fiche n'a encore été publiée.",
    "لم يتم نشر أي بطاقة بعد.",
    "Aún no se ha publicado ninguna ficha.",
    "Nessuna scheda è stata ancora pubblicata.",
    "Għadu ma ġiet ippubblikata l-ebda karta.",
  ],
  pc_title_archive: [
    "Archives Public Content",
    "Contenu public des Archives",
    "المحتوى العام للأرشيفات",
    "Contenido público de Archivos",
    "Contenuto pubblico degli Archivi",
    "Kontenut pubbliku tal-Arkivji",
  ],
  pc_title_source: [
    "Sources Public Content",
    "Contenu public des Sources",
    "المحتوى العام للمصادر",
    "Contenido público de Fuentes",
    "Contenuto pubblico delle Fonti",
    "Kontenut pubbliku tas-Sorsi",
  ],
  pc_subtitle_archive: [
    "Add, edit or delete the archive cards shown on the public Archives page. Each card has a name, a description and a link.",
    "Ajoutez, modifiez ou supprimez les fiches d'archives affichées sur la page publique. Chaque fiche a un nom, une description et un lien.",
    "أضف أو عدّل أو احذف بطاقات الأرشيف المعروضة في الصفحة العامة. لكل بطاقة اسم ووصف ورابط.",
    "Añada, edite o elimine las fichas de archivos de la página pública. Cada ficha tiene un nombre, una descripción y un enlace.",
    "Aggiungi, modifica o elimina le schede degli archivi mostrate nella pagina pubblica. Ogni scheda ha un nome, una descrizione e un link.",
    "Żid, editja jew ħassar il-karti tal-arkivji murija fil-paġna pubblika. Kull karta għandha isem, deskrizzjoni u link.",
  ],
  pc_subtitle_source: [
    "Add, edit or delete the source cards shown on the public Sources page. Each card has a name, a description and a link.",
    "Ajoutez, modifiez ou supprimez les fiches de sources affichées sur la page publique. Chaque fiche a un nom, une description et un lien.",
    "أضف أو عدّل أو احذف بطاقات المصادر المعروضة في الصفحة العامة. لكل بطاقة اسم ووصف ورابط.",
    "Añada, edite o elimine las fichas de fuentes de la página pública. Cada ficha tiene un nombre, una descripción y un enlace.",
    "Aggiungi, modifica o elimina le schede delle fonti mostrate nella pagina pubblica. Ogni scheda ha un nome, una descrizione e un link.",
    "Żid, editja jew ħassar il-karti tas-sorsi murija fil-paġna pubblika. Kull karta għandha isem, deskrizzjoni u link.",
  ],
  pc_add: ["Add a card", "Ajouter une fiche", "إضافة بطاقة", "Añadir una ficha", "Aggiungi una scheda", "Żid karta"],
  pc_edit: ["Edit card", "Modifier la fiche", "تعديل البطاقة", "Editar ficha", "Modifica scheda", "Editja l-karta"],
  pc_delete: ["Delete", "Supprimer", "حذف", "Eliminar", "Elimina", "Ħassar"],
  pc_save: ["Save", "Enregistrer", "حفظ", "Guardar", "Salva", "Issejvja"],
  pc_cancel: ["Cancel", "Annuler", "إلغاء", "Cancelar", "Annulla", "Ikkanċella"],
  pc_name: ["Name (title)", "Nom (titre)", "الاسم (العنوان)", "Nombre (título)", "Nome (titolo)", "Isem (titlu)"],
  pc_description: ["Description", "Description", "الوصف", "Descripción", "Descrizione", "Deskrizzjoni"],
  pc_link: ["Link (button destination)", "Lien (destination du bouton)", "الرابط (وجهة الزر)", "Enlace (destino del botón)", "Link (destinazione del pulsante)", "Link (destinazzjoni tal-buttuna)"],
  pc_link_hint: [
    "https://… or a site path such as /gallery/trees",
    "https://… ou un chemin du site comme /gallery/trees",
    "https://… أو مسار داخل الموقع مثل /gallery/trees",
    "https://… o una ruta del sitio como /gallery/trees",
    "https://… o un percorso del sito come /gallery/trees",
    "https://… jew rotta tas-sit bħal /gallery/trees",
  ],
  pc_default_text: ["Default text (French)", "Texte par défaut (français)", "النص الافتراضي (الفرنسية)", "Texto por defecto (francés)", "Testo predefinito (francese)", "Test awtomatiku (Franċiż)"],
  pc_translations: ["Translations", "Traductions", "الترجمات", "Traducciones", "Traduzioni", "Traduzzjonijiet"],
  pc_translations_hint: [
    "Leave a language empty to use the English or default text.",
    "Laissez une langue vide pour utiliser le texte anglais ou par défaut.",
    "اترك اللغة فارغة لاستخدام النص الإنجليزي أو الافتراضي.",
    "Deje un idioma vacío para usar el texto en inglés o por defecto.",
    "Lascia vuota una lingua per usare il testo inglese o predefinito.",
    "Ħalli lingwa vojta biex jintuża t-test bl-Ingliż jew awtomatiku.",
  ],
  pc_published: ["Visible on the website", "Visible sur le site", "ظاهرة في الموقع", "Visible en el sitio", "Visibile sul sito", "Viżibbli fuq is-sit"],
  pc_hidden: ["Hidden", "Masquée", "مخفية", "Oculta", "Nascosta", "moħbija"],
  pc_confirm_delete: [
    "Delete this card? It will disappear from the public page.",
    "Supprimer cette fiche ? Elle disparaîtra de la page publique.",
    "حذف هذه البطاقة؟ ستختفي من الصفحة العامة.",
    "¿Eliminar esta ficha? Desaparecerá de la página pública.",
    "Eliminare questa scheda? Scomparirà dalla pagina pubblica.",
    "Ħassar din il-karta? Se tisparixxi mill-paġna pubblika.",
  ],
  pc_empty: [
    "No cards yet. Click “Add a card” to create the first one.",
    "Aucune fiche. Cliquez sur « Ajouter une fiche » pour créer la première.",
    "لا توجد بطاقات. انقر على «إضافة بطاقة» لإنشاء الأولى.",
    "Aún no hay fichas. Pulse «Añadir una ficha» para crear la primera.",
    "Nessuna scheda. Fai clic su «Aggiungi una scheda» per creare la prima.",
    "Ma hemmx karti. Ikklikkja “Żid karta” biex toħloq l-ewwel waħda.",
  ],
  pc_saved: ["Card saved and published.", "Fiche enregistrée et publiée.", "تم حفظ البطاقة ونشرها.", "Ficha guardada y publicada.", "Scheda salvata e pubblicata.", "Il-karta ġiet issejvjata u ppubblikata."],
  pc_deleted: ["Card deleted.", "Fiche supprimée.", "تم حذف البطاقة.", "Ficha eliminada.", "Scheda eliminata.", "Il-karta tħassret."],
  pc_error: ["Something went wrong.", "Une erreur est survenue.", "حدث خطأ ما.", "Algo salió mal.", "Qualcosa è andato storto.", "Xi ħaġa marret ħażin."],
  pc_preview: ["Live preview", "Aperçu en direct", "معاينة مباشرة", "Vista previa en vivo", "Anteprima dal vivo", "Preview dirett"],
  pc_open_public: ["Open public page", "Ouvrir la page publique", "فتح الصفحة العامة", "Abrir página pública", "Apri la pagina pubblica", "Iftaħ il-paġna pubblika"],
  pc_move_up: ["Move up", "Monter", "تحريك للأعلى", "Subir", "Sposta su", "Ċaqlaq 'il fuq"],
  pc_move_down: ["Move down", "Descendre", "تحريك للأسفل", "Bajar", "Sposta giù", "Ċaqlaq 'l isfel"],
  pc_count: ["cards", "fiches", "بطاقات", "fichas", "schede", "karti"],

  /* ---------- Admin Sidebar Categories ---------- */
  admin_cat_overview: [
    "Overview & Monitoring",
    "Vue Générale & Suivi",
    "نظرة عامة ومتابعة",
    "Resumen y Seguimiento",
    "Panoramica e Monitoraggio",
    "Ħarsa Ġenerali u Monitoraġġ",
  ],
  admin_cat_genealogy: [
    "Genealogy & Research",
    "Généalogie & Recherche",
    "الأنساب والبحوث",
    "Genealogía e Investigación",
    "Genealogia e Ricerca",
    "Ġenealoġija u Riċerka",
  ],
  admin_cat_media: [
    "Media Library & Heritage",
    "Médiathèque & Patrimoine",
    "المكتبة والوسائط التراثية",
    "Mediateca y Patrimonio",
    "Mediateca e Patrimonio",
    "Medjateka u Wirt",
  ],
  admin_cat_content: [
    "Public Site Content",
    "Gestion du Contenu Public",
    "إدارة المحتوى العام",
    "Gestión de Contenido Público",
    "Gestione dei Contenuti Pubblici",
    "Ġestjoni tal-Kontenut Pubbliku",
  ],
  admin_cat_users: [
    "Users & Administration",
    "Utilisateurs & Administration",
    "المستخدمون والإدارة",
    "Usuarios y Administración",
    "Utenti e Amministrazione",
    "Utenti u Amministrazzjoni",
  ],
  admin_cat_finance: [
    "Finances & Settings",
    "Finances & Paramètres",
    "المالية والإعدادات",
    "Finanzas y Configuración",
    "Finanze e Impostazioni",
    "Finanzi u Settings",
  ],
  archives_public_content: [
    "Archives Public Content",
    "Contenu Public des Archives",
    "المحتوى العام للأرشيفات",
    "Contenido Público de Archivos",
    "Contenuto Pubblico degli Archivi",
    "Kontenut Pubbliku tal-Arkivji",
  ],
  sources_public_content: [
    "Sources Public Content",
    "Contenu Public des Sources",
    "المحتوى العام للمصادر",
    "Contenido Público de Fuentes",
    "Contenuto Pubblico delle Fonti",
    "Kontenut Pubbliku tas-Sorsi",
  ],
};

const LOCALE_INDEX: Record<string, number> = { en: 0, fr: 1, ar: 2, es: 3, it: 4, mt: 5 };

function expand(): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = { en: {}, fr: {}, ar: {}, es: {}, it: {}, mt: {} };
  for (const [key, row] of Object.entries(ROWS)) {
    for (const [locale, index] of Object.entries(LOCALE_INDEX)) {
      out[locale][key] = row[index];
    }
  }
  return out;
}

export const ADDITION_TRANSLATIONS = expand();

