import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  TUNISIAN_HISTORICAL_ERAS,
  type HistoricalEraExtended,
} from "../data/historicalMapData";
import { usePeriodsCmsConfig } from "../utils/periodsCmsConfig";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import SEO from "../components/SEO";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Calendar,
  Landmark,
  Crown,
  FileText,
  BookOpen,
  GitBranch,
  Image as ImageIcon,
  Radio,
  ExternalLink,
  Shield,
  ShieldCheck,
  ChevronRight,
  Layers,
  MapPin,
  Sparkles,
  HelpCircle,
  FolderArchive,
  Eye,
  CheckCircle2,
  Users,
  Building2,
  Scroll,
  History,
  Scale,
  Clock,
  Quote,
} from "lucide-react";
import {
  getEraResearchDossier,
  type EraResearchDossier,
  type HistoricalEraChapter,
} from "../data/eraResearchChapters";

interface EnrichedPeriodSource {
  id: number;
  link_id: number;
  period_id: string;
  source_type: string;
  source_id: number;
  title: string;
  description?: string;
  archive_source?: string;
  document_code?: string;
  location?: string;
  year?: string;
  thumbnail?: string;
  media_url?: string;
  custom_notes?: string;
  created_at?: string;
}

type PeriodTabKey =
  | "research_chapters"
  | "sources"
  | "leaders_families"
  | "tunis_institutions"
  | "context_lineages"
  | "tribes"
  | "divisions";

const DETAIL_UI_BY_LOCALE: Record<
  string,
  {
    home: string;
    periods: string;
    periodWord: string;
    stateLabel: string;
    capitalLabel: string;
    archivesLabel: string;
    documentsWord: string;
    viewMapCta: string;
    viewSourcesCta: string;
    kpiLeaders: string;
    kpiFigures: string;
    kpiFamilies: string;
    kpiDynasties: string;
    kpiDivisions: string;
    kpiPoles: string;
    kpiArchives: string;
    centralPowerBadge: string;
    tunisRolePrefix: string;
    tunisRoleHeading: string;
    tabChapters: string;
    tabSources: string;
    tabLeaders: string;
    tabTunis: string;
    tabContext: string;
    tabTribes: string;
    tabDivisions: string;
    // Tab 0: Research Chapters
    monographEyebrow: string;
    learningObjectivesTitle: string;
    tocTitle: string;
    chaptersWord: string;
    chapterWord: string;
    minRead: string;
    chapterSummaryTitle: string;
    archivalRefBadge: string;
    keyTakeawaysTitle: string;
    primarySourcesCitedTitle: string;
    prevChapter: string;
    viewLinkedDocs: string;
    nextChapter: string;
    // Tab 1: Sources
    sourcesSectionTitle: string;
    sourcesSectionSub: (eraTitle: string) => string;
    filterAll: string;
    filterDocuments: string;
    filterTrees: string;
    filterBooks: string;
    filterPhotos: string;
    filterAudios: string;
    loadingSourcesText: string;
    noSourcesTitle: string;
    noSourcesDesc: string;
    viewAllArchivesCta: string;
    viewDocumentsGalleryCta: string;
    defaultSourceDesc: string;
    refCodeLabel: string;
    openInGalleryCta: string;
    typeDocument: string;
    typeTree: string;
    typeBook: string;
    typeGallery: string;
    typeAudio: string;
    typeArchive: string;
    // Tab 2: Leaders & Families
    sovereigntyEyebrow: string;
    leadersHeading: string;
    leadersSub: string;
    genealogyEyebrow: string;
    familiesHeading: string;
    familiesSub: string;
    cradleLabel: string;
    searchLineageTreesCta: string;
    // Tab 3: Tunis & Institutions
    tunisSectionHeading: string;
    tunisSectionSub: (eraTitle: string) => string;
    seatOfPowerLabel: string;
    coordsLabel: string;
    sovereignEntityLabel: string;
    designationLabel: string;
    centerMapOnCapitalCta: string;
    tunisArchivesCta: string;
    // Tab 4: Context, Treaties & Registers
    politicalOrgHeading: string;
    treatiesBordersHeading: string;
    notarialSystemHeading: string;
    referencedCorpusHeading: string;
    // Tab 5: Tribes
    sociologyEyebrow: string;
    tribesHeading: string;
    tribesSub: (eraTitle: string) => string;
    confederationBadge: string;
    fractionsLabel: string;
    locateTerritoryCta: string;
    // Tab 6: Divisions & Cities
    territorialMeshEyebrow: string;
    divisionsSub: (eraTitle: string) => string;
    historicalDivisionBadge: string;
    seatCityLabel: string;
    heritageEyebrow: string;
    keyCitiesHeading: string;
    keyCitiesSub: string;
    // Bottom Navigation
    prevPeriodLabel: string;
    viewAll12PeriodsCta: string;
    nextPeriodLabel: string;
  }
> = {
  fr: {
    home: "Accueil",
    periods: "Périodes Historiques",
    periodWord: "Période",
    stateLabel: "État :",
    capitalLabel: "Capitale :",
    archivesLabel: "Archives Répertoriées :",
    documentsWord: "document(s)",
    viewMapCta: "Voir les Frontières sur la Carte",
    viewSourcesCta: "Consulter les Dépôts d'Archives",
    kpiLeaders: "Dirigeants & Souverains",
    kpiFigures: "Figures",
    kpiFamilies: "Grandes Familles",
    kpiDynasties: "Dynasties",
    kpiDivisions: "Divisions & Cités",
    kpiPoles: "Pôles",
    kpiArchives: "Actes & Archives",
    centralPowerBadge: "Capitale & Pouvoir Central",
    tunisRolePrefix: "Rôle de la Cité de Tunis sous",
    tunisRoleHeading: "Le Rayonnement & les Institutions de Tunis",
    tabChapters: "Dossier de Recherche & Chapitres",
    tabSources: "Documents & Sources Liés",
    tabLeaders: "Dirigeants & Grandes Familles",
    tabTunis: "Tunis & Institutions d'État",
    tabContext: "Contexte, Traités & Registres",
    tabTribes: "Tribus & Peuplement",
    tabDivisions: "Divisions & Cités",
    monographEyebrow: "Monographie Académique & Dossier Pédagogique",
    learningObjectivesTitle: "Objectifs Pédagogiques du Dossier",
    tocTitle: "Sommaire de l'Époque",
    chaptersWord: "chapitres",
    chapterWord: "Chapitre",
    minRead: "min de lecture",
    chapterSummaryTitle: "Synthèse Pédagogique du Chapitre",
    archivalRefBadge: "Cote d'Archives & Référence",
    keyTakeawaysTitle: "Points Clés pour la Recherche Historique & Généalogique",
    primarySourcesCitedTitle: "Sources Primaires, Manuscrits & Registres Cités",
    prevChapter: "Chapitre Précédent",
    viewLinkedDocs: "Consulter les Documents Liés",
    nextChapter: "Chapitre Suivant",
    sourcesSectionTitle: "Fonds Documentaires & Pièces d'Archives Liées",
    sourcesSectionSub: (eraTitle) =>
      `Archives certifiées, manuscrits, actes et arbres répertoriés pour l'époque ${eraTitle}.`,
    filterAll: "Toutes",
    filterDocuments: "Documents",
    filterTrees: "Arbres",
    filterBooks: "Livres",
    filterPhotos: "Photos",
    filterAudios: "Audios",
    loadingSourcesText: "Chargement des sources documentaires liées...",
    noSourcesTitle: "Aucune archive spécifique dans cette catégorie",
    noSourcesDesc:
      "Notre équipe d'historiens et d'archivistes indexe continuellement de nouveaux fonds. Vous pouvez consulter la vue d'ensemble des fonds d'archives.",
    viewAllArchivesCta: "Voir les 28 Fonds d'Archives",
    viewDocumentsGalleryCta: "Galerie des Actes",
    defaultSourceDesc: "Pièce d'archive authentifiée rattachée à cette période historique.",
    refCodeLabel: "Cote :",
    openInGalleryCta: "Consulter la Pièce dans la Galerie",
    typeDocument: "Document / Manuscrit",
    typeTree: "Arbre Généalogique",
    typeBook: "Livre / Monographie",
    typeGallery: "Photographie / Plan",
    typeAudio: "Récit Oral",
    typeArchive: "Archive",
    sovereigntyEyebrow: "Souveraineté & Gouvernance",
    leadersHeading: "Souverains & Dirigeants Majeurs",
    leadersSub:
      "Les figures fondatrices, généraux, émirs, califes, beys et hommes d'État ayant exercé le pouvoir suprême.",
    genealogyEyebrow: "Généalogie & Aristocratie d'État",
    familiesHeading: "Grandes Familles & Dynasties Régnantes",
    familiesSub:
      "Maisons royales, patriciens de la Médina, oulémas de la Zitouna et lignées makhzen ayant façonné le pays.",
    cradleLabel: "Berceau & Fief :",
    searchLineageTreesCta: "Rechercher les arbres de cette lignée",
    tunisSectionHeading: "Tunis, Capitale Historique & Cœur Institutionnel",
    tunisSectionSub: (eraTitle) =>
      `Souveraineté, institutions administratives, mosquées et arsenaux sous ${eraTitle}`,
    seatOfPowerLabel: "Siège du Pouvoir",
    coordsLabel: "Coordonnées cartographiques :",
    sovereignEntityLabel: "Entité Souveraine",
    designationLabel: "Appellation :",
    centerMapOnCapitalCta: "Centrer la Carte Interactive sur la Capitale",
    tunisArchivesCta: "Dépôts d'Archives de Tunis (Kasbah & 9-Avril)",
    politicalOrgHeading: "Organisation Politique & Évolution Historique",
    treatiesBordersHeading: "Traités, Accords & Délimitation des Frontières",
    notarialSystemHeading: "Système Notarié, Registres & Filiation d'Époque",
    referencedCorpusHeading: "Corpus & Sources Primaires Référencées",
    sociologyEyebrow: "Sociologie & Foyers Territoriaux",
    tribesHeading: "Tribus & Confédérations d'Époque",
    tribesSub: (eraTitle) =>
      `Territoires tribaux, fractions déclarées, rôles de la Majba et localisation cartographique sous ${eraTitle}.`,
    confederationBadge: "Confédération",
    fractionsLabel: "Fractions & Clans :",
    locateTerritoryCta: "Localiser le Carré & Territoire",
    territorialMeshEyebrow: "Maillage Territorial",
    divisionsSub: (eraTitle) =>
      `Kouras, outans, caïdats, duchés ou gouvernorats structurant la souveraineté sous ${eraTitle}.`,
    historicalDivisionBadge: "Division Historique",
    seatCityLabel: "Chef-lieu / Siège :",
    heritageEyebrow: "Patrimoine & Fortifications",
    keyCitiesHeading: "Cités Principales & Places Fortes",
    keyCitiesSub: "Cités impériales, ribats, arsenaux et monuments majeurs préservés de cette époque.",
    prevPeriodLabel: "Période Précédente",
    viewAll12PeriodsCta: "Voir l'ensemble des 12 périodes historiques",
    nextPeriodLabel: "Période Suivante",
  },
  en: {
    home: "Home",
    periods: "Historical Periods",
    periodWord: "Period",
    stateLabel: "State:",
    capitalLabel: "Capital:",
    archivesLabel: "Cataloged Archives:",
    documentsWord: "record(s)",
    viewMapCta: "View Borders on Interactive Map",
    viewSourcesCta: "Browse Archival Repositories",
    kpiLeaders: "Rulers & Sovereigns",
    kpiFigures: "Figures",
    kpiFamilies: "Notable Families",
    kpiDynasties: "Dynasties",
    kpiDivisions: "Divisions & Cities",
    kpiPoles: "Centers",
    kpiArchives: "Deeds & Archives",
    centralPowerBadge: "Capital & Central Power",
    tunisRolePrefix: "Role of the City of Tunis during",
    tunisRoleHeading: "Prominence & Institutions of Tunis",
    tabChapters: "Research Dossier & Chapters",
    tabSources: "Linked Documents & Sources",
    tabLeaders: "Rulers & Notable Families",
    tabTunis: "Tunis & State Institutions",
    tabContext: "Context, Treaties & Registers",
    tabTribes: "Tribes & Settlement",
    tabDivisions: "Divisions & Cities",
    monographEyebrow: "Academic Monograph & Pedagogical Dossier",
    learningObjectivesTitle: "Dossier Learning Objectives",
    tocTitle: "Period Table of Contents",
    chaptersWord: "chapters",
    chapterWord: "Chapter",
    minRead: "min read",
    chapterSummaryTitle: "Chapter Pedagogical Summary",
    archivalRefBadge: "Archival Reference & Call Number",
    keyTakeawaysTitle: "Key Takeaways for Historical & Genealogical Research",
    primarySourcesCitedTitle: "Primary Sources, Manuscripts & Cited Registers",
    prevChapter: "Previous Chapter",
    viewLinkedDocs: "View Linked Documents",
    nextChapter: "Next Chapter",
    sourcesSectionTitle: "Documentary Holdings & Linked Archival Records",
    sourcesSectionSub: (eraTitle) =>
      `Certified archives, manuscripts, deeds and family trees cataloged for ${eraTitle}.`,
    filterAll: "All",
    filterDocuments: "Documents",
    filterTrees: "Trees",
    filterBooks: "Books",
    filterPhotos: "Photos",
    filterAudios: "Audios",
    loadingSourcesText: "Loading linked documentary sources...",
    noSourcesTitle: "No specific archives in this category",
    noSourcesDesc:
      "Our team of historians and archivists continuously indexes new holdings. You can browse all national and international archival repositories.",
    viewAllArchivesCta: "Browse All 28 Archival Holdings",
    viewDocumentsGalleryCta: "Documents Gallery",
    defaultSourceDesc: "Authenticated archival record linked to this historical period.",
    refCodeLabel: "Ref:",
    openInGalleryCta: "View Record in Gallery",
    typeDocument: "Document / Manuscript",
    typeTree: "Family Tree",
    typeBook: "Book / Monograph",
    typeGallery: "Photograph / Map",
    typeAudio: "Oral History",
    typeArchive: "Archive",
    sovereigntyEyebrow: "Sovereignty & Governance",
    leadersHeading: "Sovereigns & Major Rulers",
    leadersSub:
      "Founding figures, generals, emirs, caliphs, beys and statesmen who exercised supreme authority.",
    genealogyEyebrow: "Genealogy & State Aristocracy",
    familiesHeading: "Notable Families & Ruling Dynasties",
    familiesSub:
      "Royal houses, Medina patricians, Zitouna scholars and Makhzen lineages that shaped the country.",
    cradleLabel: "Origin & Seat:",
    searchLineageTreesCta: "Search family trees of this lineage",
    tunisSectionHeading: "Tunis, Historical Capital & Institutional Heart",
    tunisSectionSub: (eraTitle) =>
      `Sovereignty, administrative institutions, mosques and arsenals during ${eraTitle}`,
    seatOfPowerLabel: "Seat of Power",
    coordsLabel: "Map coordinates:",
    sovereignEntityLabel: "Sovereign Entity",
    designationLabel: "Designation:",
    centerMapOnCapitalCta: "Center Interactive Map on Capital",
    tunisArchivesCta: "Tunis Archival Repositories (Kasbah & 9-Avril)",
    politicalOrgHeading: "Political Organization & Historical Evolution",
    treatiesBordersHeading: "Treaties, Agreements & Border Delimitation",
    notarialSystemHeading: "Notarial System, Registers & Period Lineages",
    referencedCorpusHeading: "Referenced Primary Corpus & Sources",
    sociologyEyebrow: "Sociology & Territorial Homelands",
    tribesHeading: "Tribes & Confederations of the Period",
    tribesSub: (eraTitle) =>
      `Tribal territories, documented fractions, Majba fiscal rolls and cartographic locations during ${eraTitle}.`,
    confederationBadge: "Confederation",
    fractionsLabel: "Fractions & Clans:",
    locateTerritoryCta: "Locate Territory on Map",
    territorialMeshEyebrow: "Territorial Network",
    divisionsSub: (eraTitle) =>
      `Kouras, outans, caïdats, duchies or governorates structuring sovereignty during ${eraTitle}.`,
    historicalDivisionBadge: "Historical Division",
    seatCityLabel: "Administrative Seat:",
    heritageEyebrow: "Heritage & Fortifications",
    keyCitiesHeading: "Major Cities & Strongholds",
    keyCitiesSub: "Imperial cities, ribats, arsenals and major monuments preserved from this era.",
    prevPeriodLabel: "Previous Period",
    viewAll12PeriodsCta: "View all 12 historical periods",
    nextPeriodLabel: "Next Period",
  },
  ar: {
    home: "الرئيسية",
    periods: "الحقب التاريخية",
    periodWord: "الحقبة",
    stateLabel: "الدولة :",
    capitalLabel: "العاصمة :",
    archivesLabel: "الوثائق الموثقة :",
    documentsWord: "وثيقة",
    viewMapCta: "عرض الحدود على الخريطة التفاعلية",
    viewSourcesCta: "تصفح مراكز الأرشيف",
    kpiLeaders: "الحكام والسلاطين",
    kpiFigures: "شخصيات",
    kpiFamilies: "الأسر والبيوتات الكبرى",
    kpiDynasties: "سلالات",
    kpiDivisions: "الأقاليم والحواضر",
    kpiPoles: "حواضر",
    kpiArchives: "العقود والأرشيفات",
    centralPowerBadge: "العاصمة والسلطة المركزية",
    tunisRolePrefix: "دور حاضرة تونس خلال",
    tunisRoleHeading: "إشعاع مدينة تونس ومؤسساتها",
    tabChapters: "الملف البحثي والفصول",
    tabSources: "الوثائق والمصادر المرتبطة",
    tabLeaders: "الحكام والأسر الكبرى",
    tabTunis: "تونس ومؤسسات الدولة",
    tabContext: "السياق والمعاهدات والسجلات",
    tabTribes: "القبائل والعمران",
    tabDivisions: "الأقاليم والمدن",
    monographEyebrow: "دراسة أكاديمية وملف بيداغوجي",
    learningObjectivesTitle: "الأهداف البيداغوجية للملف",
    tocTitle: "فهرس الحقبة",
    chaptersWord: "فصول",
    chapterWord: "الفصل",
    minRead: "دقائق قراءة",
    chapterSummaryTitle: "الخلاصة البيداغوجية للفصل",
    archivalRefBadge: "الرمز الأرشيفي والمرجع",
    keyTakeawaysTitle: "النقاط الأساسية للبحث التاريخي والجينيالوجي",
    primarySourcesCitedTitle: "المصادر الأولية والمخطوطات والدفاتر المذكورة",
    prevChapter: "الفصل السابق",
    viewLinkedDocs: "تصفّح الوثائق المرتبطة",
    nextChapter: "الفصل التالي",
    sourcesSectionTitle: "الأرصدة الوثائقية والوثائق الأرشيفية المرتبطة",
    sourcesSectionSub: (eraTitle) =>
      `أرشيفات موثّقة ومخطوطات وعقود وشجرات أنساب مسجّلة لحقبة ${eraTitle}.`,
    filterAll: "الكل",
    filterDocuments: "الوثائق",
    filterTrees: "الشجرات",
    filterBooks: "الكتب",
    filterPhotos: "الصور",
    filterAudios: "التسجيلات",
    loadingSourcesText: "جاري تحميل المصادر الوثائقية المرتبطة...",
    noSourcesTitle: "لا توجد وثائق محددة في هذه الفئة",
    noSourcesDesc:
      "يقوم فريق المؤرخين والأرشيفيين بفهرسة أرصدة جديدة باستمرار. يمكنكم تصفّح الدليل الكامل لمراكز الأرشيف.",
    viewAllArchivesCta: "عرض جميع الأرصدة الـ 28",
    viewDocumentsGalleryCta: "معرض العقود والوثائق",
    defaultSourceDesc: "وثيقة أرشيفية موثّقة مرتبطة بهذه الحقبة التاريخية.",
    refCodeLabel: "الرمز :",
    openInGalleryCta: "تصفّح الوثيقة في المعرض",
    typeDocument: "وثيقة / مخطوط",
    typeTree: "شجرة عائلة",
    typeBook: "كتاب / دراسة",
    typeGallery: "صورة / خريطة",
    typeAudio: "رواية شفوية",
    typeArchive: "أرشيف",
    sovereigntyEyebrow: "السيادة والحكم",
    leadersHeading: "الملوك والحكام والأمراء البارزون",
    leadersSub:
      "الشخصيات المؤسسة والقادة والأمراء والخلفاء والبايات ورجال الدولة الذين مارسوا السلطة العليا.",
    genealogyEyebrow: "الأنساب وأعيان الدولة",
    familiesHeading: "الأسر الكبرى والسلالات الحاكمة",
    familiesSub:
      "البيوتات الملكية وأعيان الحاضرة وعلماء الزيتونة وعائلات المخزن التي شكّلت تاريخ البلاد.",
    cradleLabel: "الموطن والمركز :",
    searchLineageTreesCta: "البحث عن شجرات هذه السلالة",
    tunisSectionHeading: "تونس، العاصمة التاريخية والقلب المؤسساتي",
    tunisSectionSub: (eraTitle) =>
      `السيادة والمؤسسات الإدارية والجوامع ودور الصناعة خلال ${eraTitle}`,
    seatOfPowerLabel: "مقرّ الحكم",
    coordsLabel: "الإحداثيات الجغرافية :",
    sovereignEntityLabel: "الكيان السيادي",
    designationLabel: "التسمية الرسمية :",
    centerMapOnCapitalCta: "تمركز الخريطة التفاعلية حول العاصمة",
    tunisArchivesCta: "دور الأرشيف بتونس (القصبة و 9 أفريل)",
    politicalOrgHeading: "التنظيم السياسي والتطور التاريخي",
    treatiesBordersHeading: "المعاهدات والاتفاقيات وتحديد الحدود",
    notarialSystemHeading: "النظام التوثيقي العدلي والدفاتر والأنساب",
    referencedCorpusHeading: "المدوّنة والمصادر الأولية المعتمدة",
    sociologyEyebrow: "العمران والمجالات القبلية",
    tribesHeading: "القبائل والكونفدراليات في هذه الحقبة",
    tribesSub: (eraTitle) =>
      `المجالات القبلية والعروش والفرق المسجّلة في دفاتر المججبى ومواقعها الجغرافية خلال ${eraTitle}.`,
    confederationBadge: "كونفدرالية قبلية",
    fractionsLabel: "العروش والفرق :",
    locateTerritoryCta: "تحديد المجال القبلي على الخريطة",
    territorialMeshEyebrow: "التقسيم الترابي",
    divisionsSub: (eraTitle) =>
      `الكور والأوطان والقيادات والمقاطعات والولايات التي نظّمت السيادة خلال ${eraTitle}.`,
    historicalDivisionBadge: "مقاطعة تاريخية",
    seatCityLabel: "المركز / الحاضرة :",
    heritageEyebrow: "التراث والتحصينات",
    keyCitiesHeading: "الحواضر الكبرى والقلاع الاستراتيجية",
    keyCitiesSub: "المدن السلطانية والرباطات والترسانات والمعالم الكبرى المحفوظة من هذه الحقبة.",
    prevPeriodLabel: "الحقبة السابقة",
    viewAll12PeriodsCta: "عرض جميع الحقب التاريخية الـ 12",
    nextPeriodLabel: "الحقبة التالية",
  },
  es: {
    home: "Inicio",
    periods: "Períodos Históricos",
    periodWord: "Período",
    stateLabel: "Estado:",
    capitalLabel: "Capital:",
    archivesLabel: "Archivos Registrados:",
    documentsWord: "documento(s)",
    viewMapCta: "Ver Fronteras en el Mapa",
    viewSourcesCta: "Consultar Depósitos de Archivos",
    kpiLeaders: "Gobernantes y Soberanos",
    kpiFigures: "Figuras",
    kpiFamilies: "Grandes Familias",
    kpiDynasties: "Dinastías",
    kpiDivisions: "Divisiones y Ciudades",
    kpiPoles: "Centros",
    kpiArchives: "Actas y Archivos",
    centralPowerBadge: "Capital y Poder Central",
    tunisRolePrefix: "Papel de la Ciudad de Túnez bajo",
    tunisRoleHeading: "Proyección e Instituciones de Túnez",
    tabChapters: "Dossier de Investigación y Capítulos",
    tabSources: "Documentos y Fuentes Vinculados",
    tabLeaders: "Gobernantes y Grandes Familias",
    tabTunis: "Túnez e Instituciones de Estado",
    tabContext: "Contexto, Tratados y Registros",
    tabTribes: "Tribus y Poblamiento",
    tabDivisions: "Divisiones y Ciudades",
    monographEyebrow: "Monografía Académica y Dossier Pedagógico",
    learningObjectivesTitle: "Objetivos Pedagógicos del Dossier",
    tocTitle: "Índice de la Época",
    chaptersWord: "capítulos",
    chapterWord: "Capítulo",
    minRead: "min de lectura",
    chapterSummaryTitle: "Síntesis Pedagógica del Capítulo",
    archivalRefBadge: "Signatura de Archivo y Referencia",
    keyTakeawaysTitle: "Puntos Clave para la Investigación Histórica y Genealógica",
    primarySourcesCitedTitle: "Fuentes Primarias, Manuscritos y Registros Citados",
    prevChapter: "Capítulo Anterior",
    viewLinkedDocs: "Consultar Documentos Vinculados",
    nextChapter: "Capítulo Siguiente",
    sourcesSectionTitle: "Fondos Documentales y Piezas de Archivo Vinculadas",
    sourcesSectionSub: (eraTitle) =>
      `Archivos certificados, manuscritos, actas y árboles registrados para la época ${eraTitle}.`,
    filterAll: "Todos",
    filterDocuments: "Documentos",
    filterTrees: "Árboles",
    filterBooks: "Libros",
    filterPhotos: "Fotos",
    filterAudios: "Audios",
    loadingSourcesText: "Cargando fuentes documentales vinculadas...",
    noSourcesTitle: "Ningún archivo específico en esta categoría",
    noSourcesDesc:
      "Nuestro equipo de historiadores y archiveros indexa continuamente nuevos fondos. Puede consultar el directorio general de archivos.",
    viewAllArchivesCta: "Ver los 28 Fondos de Archivos",
    viewDocumentsGalleryCta: "Galería de Actas",
    defaultSourceDesc: "Pieza de archivo autenticada vinculada a este período histórico.",
    refCodeLabel: "Signatura:",
    openInGalleryCta: "Consultar Pieza en la Galería",
    typeDocument: "Documento / Manuscrito",
    typeTree: "Árbol Genealógico",
    typeBook: "Libro / Monografía",
    typeGallery: "Fotografía / Mapa",
    typeAudio: "Relato Oral",
    typeArchive: "Archivo",
    sovereigntyEyebrow: "Soberanía y Gobernanza",
    leadersHeading: "Soberanos y Gobernantes Principales",
    leadersSub:
      "Las figuras fundadoras, generales, emires, califas, beyes y estadistas que ejercieron el poder supremo.",
    genealogyEyebrow: "Genealogía y Aristocracia de Estado",
    familiesHeading: "Grandes Familias y Dinastías Reinantes",
    familiesSub:
      "Casas reales, patricios de la Medina, ulemas de la Zitouna y linajes makhzen que forjaron el país.",
    cradleLabel: "Cuna y Feudo:",
    searchLineageTreesCta: "Buscar árboles de este linaje",
    tunisSectionHeading: "Túnez, Capital Histórica y Corazón Institucional",
    tunisSectionSub: (eraTitle) =>
      `Soberanía, instituciones administrativas, mezquitas y arsenales bajo ${eraTitle}`,
    seatOfPowerLabel: "Sede del Poder",
    coordsLabel: "Coordenadas cartográficas:",
    sovereignEntityLabel: "Entidad Soberana",
    designationLabel: "Denominación:",
    centerMapOnCapitalCta: "Centrar el Mapa Interactivo en la Capital",
    tunisArchivesCta: "Depósitos de Archivos de Túnez (Kasbah y 9-Avril)",
    politicalOrgHeading: "Organización Política y Evolución Histórica",
    treatiesBordersHeading: "Tratados, Acuerdos y Delimitación de Fronteras",
    notarialSystemHeading: "Sistema Notarial, Registros y Filiación de Época",
    referencedCorpusHeading: "Corpus y Fuentes Primarias Referenciadas",
    sociologyEyebrow: "Sociología y Territorios Tribales",
    tribesHeading: "Tribus y Confederaciones de la Época",
    tribesSub: (eraTitle) =>
      `Territorios tribales, fracciones declaradas, padrones de la Majba y localización cartográfica bajo ${eraTitle}.`,
    confederationBadge: "Confederación",
    fractionsLabel: "Fracciones y Clanes:",
    locateTerritoryCta: "Localizar Territorio en el Mapa",
    territorialMeshEyebrow: "Red Territorial",
    divisionsSub: (eraTitle) =>
      `Kouras, outans, caidatos, ducados o gobernaciones que estructuraban la soberanía bajo ${eraTitle}.`,
    historicalDivisionBadge: "División Histórica",
    seatCityLabel: "Capital / Sede:",
    heritageEyebrow: "Patrimonio y Fortificaciones",
    keyCitiesHeading: "Ciudades Principales y Plazas Fuertes",
    keyCitiesSub: "Ciudades imperiales, ribats, arsenales y monumentos principales conservados de esta época.",
    prevPeriodLabel: "Período Anterior",
    viewAll12PeriodsCta: "Ver los 12 períodos históricos",
    nextPeriodLabel: "Período Siguiente",
  },
  it: {
    home: "Home",
    periods: "Epoche Storiche",
    periodWord: "Epoca",
    stateLabel: "Stato:",
    capitalLabel: "Capitale:",
    archivesLabel: "Archivi Censiti:",
    documentsWord: "documento/i",
    viewMapCta: "Vedi Confini sulla Mappa",
    viewSourcesCta: "Consulta i Depositi d'Archivio",
    kpiLeaders: "Sovrani e Governanti",
    kpiFigures: "Figure",
    kpiFamilies: "Grandi Famiglie",
    kpiDynasties: "Dinastie",
    kpiDivisions: "Divisioni e Città",
    kpiPoles: "Centri",
    kpiArchives: "Atti e Archivi",
    centralPowerBadge: "Capitale e Potere Centrale",
    tunisRolePrefix: "Ruolo della Città di Tunisi sotto",
    tunisRoleHeading: "Splendore e Istituzioni di Tunisi",
    tabChapters: "Dossier di Ricerca e Capitoli",
    tabSources: "Documenti e Fonti Collegati",
    tabLeaders: "Sovrani e Grandi Famiglie",
    tabTunis: "Tunisi e Istituzioni di Stato",
    tabContext: "Contesto, Trattati e Registri",
    tabTribes: "Tribù e Insediamento",
    tabDivisions: "Divisioni e Città",
    monographEyebrow: "Monografia Accademica e Dossier Pedagogico",
    learningObjectivesTitle: "Obiettivi Pedagogici del Dossier",
    tocTitle: "Sommario dell'Epoca",
    chaptersWord: "capitoli",
    chapterWord: "Capitolo",
    minRead: "min di lettura",
    chapterSummaryTitle: "Sintesi Pedagogica del Capitolo",
    archivalRefBadge: "Segnatura d'Archivio e Riferimento",
    keyTakeawaysTitle: "Punti Chiave per la Ricerca Storica e Genealogica",
    primarySourcesCitedTitle: "Fonti Primarie, Manoscritti e Registri Citati",
    prevChapter: "Capitolo Precedente",
    viewLinkedDocs: "Consulta i Documenti Collegati",
    nextChapter: "Capitolo Successivo",
    sourcesSectionTitle: "Fondi Documentari e Documenti d'Archivio Collegati",
    sourcesSectionSub: (eraTitle) =>
      `Archivi certificati, manoscritti, atti e alberi genealogici censiti per l'epoca ${eraTitle}.`,
    filterAll: "Tutti",
    filterDocuments: "Documenti",
    filterTrees: "Alberi",
    filterBooks: "Libri",
    filterPhotos: "Foto",
    filterAudios: "Audio",
    loadingSourcesText: "Caricamento delle fonti documentarie collegate...",
    noSourcesTitle: "Nessun archivio specifico in questa categoria",
    noSourcesDesc:
      "Il nostro team di storici e archivisti indicizza continuamente nuovi fondi. Puoi consultare il repertorio generale degli archivi.",
    viewAllArchivesCta: "Vedi i 28 Fondi d'Archivio",
    viewDocumentsGalleryCta: "Galleria degli Atti",
    defaultSourceDesc: "Documento d'archivio autenticato collegato a questo periodo storico.",
    refCodeLabel: "Segnatura:",
    openInGalleryCta: "Consulta il Documento nella Galleria",
    typeDocument: "Documento / Manoscritto",
    typeTree: "Albero Genealogico",
    typeBook: "Libro / Monografia",
    typeGallery: "Fotografia / Mappa",
    typeAudio: "Racconto Orale",
    typeArchive: "Archivio",
    sovereigntyEyebrow: "Sovranità e Governo",
    leadersHeading: "Sovrani e Governanti Principali",
    leadersSub:
      "Le figure fondatrici, generali, emiri, califfi, bey e statisti che hanno esercitato il potere supremo.",
    genealogyEyebrow: "Genealogia e Aristocrazia di Stato",
    familiesHeading: "Grandi Famiglie e Dinastie Regnanti",
    familiesSub:
      "Case reali, patrizi della Medina, ulema della Zitouna e lignaggi makhzen che hanno plasmato il paese.",
    cradleLabel: "Origine e Feudo:",
    searchLineageTreesCta: "Cerca gli alberi di questo lignaggio",
    tunisSectionHeading: "Tunisi, Capitale Storica e Cuore Istituzionale",
    tunisSectionSub: (eraTitle) =>
      `Sovranità, istituzioni amministrative, moschee e arsenali sotto ${eraTitle}`,
    seatOfPowerLabel: "Sede del Potere",
    coordsLabel: "Coordinate cartografiche:",
    sovereignEntityLabel: "Entità Sovrana",
    designationLabel: "Denominazione:",
    centerMapOnCapitalCta: "Centra la Mappa Interattiva sulla Capitale",
    tunisArchivesCta: "Depositi d'Archivio di Tunisi (Kasbah e 9-Avril)",
    politicalOrgHeading: "Organizzazione Politica ed Evoluzione Storica",
    treatiesBordersHeading: "Trattati, Accordi e Delimitazione dei Confini",
    notarialSystemHeading: "Sistema Notarile, Registri e Filiazione d'Epoca",
    referencedCorpusHeading: "Corpus e Fonti Primarie Riferite",
    sociologyEyebrow: "Sociologia e Territori Tribali",
    tribesHeading: "Tribù e Confederazioni dell'Epoca",
    tribesSub: (eraTitle) =>
      `Territori tribali, frazioni dichiarate, ruoli della Majba e localizzazione cartografica sotto ${eraTitle}.`,
    confederationBadge: "Confederazione",
    fractionsLabel: "Frazioni e Clan:",
    locateTerritoryCta: "Localizza Territorio sulla Mappa",
    territorialMeshEyebrow: "Rete Territoriale",
    divisionsSub: (eraTitle) =>
      `Koura, outan, caidati, ducati o governatorati che strutturavano la sovranità sotto ${eraTitle}.`,
    historicalDivisionBadge: "Divisione Storica",
    seatCityLabel: "Capoluogo / Sede:",
    heritageEyebrow: "Patrimonio e Fortificazioni",
    keyCitiesHeading: "Città Principali e Piazzeforti",
    keyCitiesSub: "Città imperiali, ribat, arsenali e monumenti principali conservati di quest'epoca.",
    prevPeriodLabel: "Epoca Precedente",
    viewAll12PeriodsCta: "Vedi tutte le 12 epoche storiche",
    nextPeriodLabel: "Epoca Successiva",
  },
  mt: {
    home: "Paġna Ewlenija",
    periods: "Perjodi Storiċi",
    periodWord: "Epoka",
    stateLabel: "Stat:",
    capitalLabel: "Kapitali:",
    archivesLabel: "Arkivji Dokumentati:",
    documentsWord: "dokument(i)",
    viewMapCta: "Ara l-Fruntieri fuq il-Mappa",
    viewSourcesCta: "Ikkonsulta l-Arkivji",
    kpiLeaders: "Mexxejja u Sovrani",
    kpiFigures: "Figuri",
    kpiFamilies: "Familji Notabbli",
    kpiDynasties: "Dinastiji",
    kpiDivisions: "Diviżjonijiet u Bliet",
    kpiPoles: "Ċentri",
    kpiArchives: "Atti u Arkivji",
    centralPowerBadge: "Kapitali u Poter Ċentrali",
    tunisRolePrefix: "Ir-Rwol tal-Belt ta' Tuneż matul",
    tunisRoleHeading: "L-Istituzzjonijiet u l-Irwol ta' Tuneż",
    tabChapters: "Dossier ta' Riċerka u Kapitli",
    tabSources: "Dokumenti u Sorsi Marbuta",
    tabLeaders: "Mexxejja u Familji Kbar",
    tabTunis: "Tuneż u Istituzzjonijiet tal-Istat",
    tabContext: "Kuntest, Trattati u Reġistri",
    tabTribes: "Tribujiet u Popolazzjoni",
    tabDivisions: "Diviżjonijiet u Bliet",
    monographEyebrow: "Monografija Akkademika u Dossier Pedagoġiku",
    learningObjectivesTitle: "Objettivi Pedagoġiċi tad-Dossier",
    tocTitle: "Werrej tal-Perjodu",
    chaptersWord: "kapitli",
    chapterWord: "Kapitlu",
    minRead: "min qari",
    chapterSummaryTitle: "Sintesi Pedagoġika tal-Kapitlu",
    archivalRefBadge: "Referenza tal-Arkivju",
    keyTakeawaysTitle: "Punti Ewlenin għar-Riċerka Storika u Ġenealoġika",
    primarySourcesCitedTitle: "Sorsi Primarji, Manoskritti u Reġistri Kwotati",
    prevChapter: "Kapitlu Preċedenti",
    viewLinkedDocs: "Ara d-Dokumenti Marbuta",
    nextChapter: "Kapitlu Li Jmiss",
    sourcesSectionTitle: "Fondi Dokumentarji u Dokumenti tal-Arkivji Marbuta",
    sourcesSectionSub: (eraTitle) =>
      `Arkivji ċċertifikati, manoskritti, atti u siġar tal-familja rreġistrati għall-perjodu ${eraTitle}.`,
    filterAll: "Kollha",
    filterDocuments: "Dokumenti",
    filterTrees: "Siġar",
    filterBooks: "Kotba",
    filterPhotos: "Ritratti",
    filterAudios: "Awdjo",
    loadingSourcesText: "Qed jitgħabbew is-sorsi dokumentarji marbuta...",
    noSourcesTitle: "L-ebda arkivju speċifiku f'din il-kategorija",
    noSourcesDesc:
      "It-tim tagħna ta' storiċi u arkivisti jkompli jindiċizza fondi ġodda. Tista' tikkonsulta d-direttorju ġenerali tal-arkivji.",
    viewAllArchivesCta: "Ara t-28 Fond tal-Arkivji",
    viewDocumentsGalleryCta: "Gallerija tad-Dokumenti",
    defaultSourceDesc: "Dokument tal-arkivju awtentikat marbut ma' dan il-perjodu storiku.",
    refCodeLabel: "Referenza:",
    openInGalleryCta: "Ara d-Dokument fil-Gallerija",
    typeDocument: "Dokument / Manoskritt",
    typeTree: "Siġra tal-Familja",
    typeBook: "Ktieb / Monografija",
    typeGallery: "Ritratt / Mappa",
    typeAudio: "Rakkont Orali",
    typeArchive: "Arkivju",
    sovereigntyEyebrow: "Sovranità u Governanza",
    leadersHeading: "Sovrani u Mexxejja Ewlenin",
    leadersSub:
      "Il-figuri fundaturi, ġenerali, emiri, kaliffi, beys u statisti li eżerċitaw il-poter suprem.",
    genealogyEyebrow: "Ġenealoġija u Aristokrazija tal-Istat",
    familiesHeading: "Familji Kbar u Dinastiji Rjali",
    familiesSub:
      "Djar rjali, patrizji tal-Medina, studjużi taż-Żitouna u familji makhzen li sawru l-pajjiż.",
    cradleLabel: "Oriġini u Sede:",
    searchLineageTreesCta: "Fittex is-siġar tal-familja ta' din il-linja",
    tunisSectionHeading: "Tuneż, Kapitali Storika u Qalb Istituzzjonali",
    tunisSectionSub: (eraTitle) =>
      `Sovranità, istituzzjonijiet amministrattivi, moskej u arsenali matul ${eraTitle}`,
    seatOfPowerLabel: "Sede tal-Poter",
    coordsLabel: "Koordinati kartografiċi:",
    sovereignEntityLabel: "Entità Sovrana",
    designationLabel: "Denominazzjoni:",
    centerMapOnCapitalCta: "Iċċentra l-Mappa Interattiva fuq il-Kapitali",
    tunisArchivesCta: "Depożiti tal-Arkivji ta' Tuneż (Kasbah u 9-Avril)",
    politicalOrgHeading: "Organizzazzjoni Politika u Evoluzzjoni Storika",
    treatiesBordersHeading: "Trattati, Ftehimiet u Delimitazzjoni tal-Fruntieri",
    notarialSystemHeading: "Sistema Nutarili, Reġistri u Linji tal-Familja",
    referencedCorpusHeading: "Korpus u Sorsi Primarji Referenzjati",
    sociologyEyebrow: "Soċjoloġija u Territorji Tribali",
    tribesHeading: "Tribujiet u Konfederazzjonijiet tal-Perjodu",
    tribesSub: (eraTitle) =>
      `Territorji tribali, frazzjonijiet iddikjarati, reġistri tal-Majba u lokalizzazzjoni kartografika matul ${eraTitle}.`,
    confederationBadge: "Konfederazzjoni",
    fractionsLabel: "Frazzjonijiet u Klans:",
    locateTerritoryCta: "Sib it-Territorju fuq il-Mappa",
    territorialMeshEyebrow: "Netwerk Territorjali",
    divisionsSub: (eraTitle) =>
      `Kouras, outans, caïdats, dukati jew gvernatorati li strutturaw is-sovranità matul ${eraTitle}.`,
    historicalDivisionBadge: "Diviżjoni Storika",
    seatCityLabel: "Belt Kapitali / Sede:",
    heritageEyebrow: "Wirt u Fortifikazzjonijiet",
    keyCitiesHeading: "Bliet Ewlenin u Fortizzi",
    keyCitiesSub: "Bliet imperjali, ribats, arsenali u monumenti ewlenin ippreservati minn din l-epoka.",
    prevPeriodLabel: "Perjodu Preċedenti",
    viewAll12PeriodsCta: "Ara t-12-il perjodu storiku kollha",
    nextPeriodLabel: "Perjodu Li Jmiss",
  },
};

export default function PeriodDetail() {
  const { periodId } = useParams<{ periodId: string }>();
  const navigate = useNavigate();
  const { t, locale, isRtl } = useTranslation();
  const { config } = usePeriodsCmsConfig();
  const detailUi = DETAIL_UI_BY_LOCALE[(locale || "fr").toLowerCase()] || DETAIL_UI_BY_LOCALE.fr;
  const allPeriods = config.periods.length > 0 ? config.periods : TUNISIAN_HISTORICAL_ERAS;

  const [sources, setSources] = useState<EnrichedPeriodSource[]>([]);
  const [loadingSources, setLoadingSources] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<PeriodTabKey>("research_chapters");
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  // Find the era
  const currentEraIndex = useMemo(() => {
    return allPeriods.findIndex(
      (e) => e.id.toLowerCase() === (periodId || "").toLowerCase()
    );
  }, [allPeriods, periodId]);

  const era: HistoricalEraExtended = useMemo(() => {
    if (currentEraIndex >= 0) return allPeriods[currentEraIndex];
    return allPeriods[8] || TUNISIAN_HISTORICAL_ERAS[8]; // Fallback to Ottoman ~1600
  }, [allPeriods, currentEraIndex]);

  // Era research dossier & active chapter
  const dossier: EraResearchDossier = useMemo(() => {
    return getEraResearchDossier(era.id, locale, era);
  }, [era, locale]);

  useEffect(() => {
    setSelectedChapterIndex(0);
  }, [era.id]);

  const activeChapter: HistoricalEraChapter | undefined = useMemo(() => {
    if (!dossier?.chapters || dossier.chapters.length === 0) return undefined;
    return dossier.chapters[selectedChapterIndex] || dossier.chapters[0];
  }, [dossier, selectedChapterIndex]);

  const prevEra = currentEraIndex > 0 ? allPeriods[currentEraIndex - 1] : null;
  const nextEra =
    currentEraIndex >= 0 && currentEraIndex < allPeriods.length - 1
      ? allPeriods[currentEraIndex + 1]
      : null;

  // Fetch linked sources from backend
  useEffect(() => {
    let cancelled = false;
    setLoadingSources(true);

    api
      .get(`/periods/${era.id}/sources`)
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setSources(list);
      })
      .catch((err) => {
        console.error("Failed to load period sources:", err);
      })
      .finally(() => {
        if (!cancelled) setLoadingSources(false);
      });

    return () => {
      cancelled = true;
    };
  }, [era.id]);

  const filteredSources = useMemo(() => {
    if (activeFilter === "all") return sources;
    return sources.filter((s) => s.source_type === activeFilter);
  }, [sources, activeFilter]);

  const getSourceTypeLabel = (type: string) => {
    switch (type) {
      case "document":
        return detailUi.typeDocument;
      case "tree":
        return detailUi.typeTree;
      case "book":
        return detailUi.typeBook;
      case "gallery":
        return detailUi.typeGallery;
      case "audio":
        return detailUi.typeAudio;
      default:
        return detailUi.typeArchive;
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return FileText;
      case "tree":
        return GitBranch;
      case "book":
        return BookOpen;
      case "gallery":
        return ImageIcon;
      case "audio":
        return Radio;
      default:
        return FolderArchive;
    }
  };

  const getSourceGalleryLink = (source: EnrichedPeriodSource) => {
    switch (source.source_type) {
      case "document":
        return `/gallery/documents?highlight=${source.source_id}`;
      case "tree":
        return `/gallery/trees?treeId=${source.source_id}`;
      case "book":
        return `/gallery/books?bookId=${source.source_id}`;
      case "gallery":
        return `/genealogy-gallery?imageId=${source.source_id}`;
      case "audio":
        return `/audio?audioId=${source.source_id}`;
      default:
        return `/sources`;
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-24">
      <SEO
        title={`${era.title} (${era.displayPeriod}) | Histoire & Archives de Tunisie`}
        description={era.description}
        keywords={[era.title, era.devletName, era.capital, "histoire tunisie", "archives nationales de tunisie"]}
      />

      {/* Top Header & Breadcrumbs */}
      <section className="relative overflow-hidden pt-28 pb-12 border-b border-[var(--gold)]/25 bg-gradient-to-b from-[var(--card)]/90 via-[var(--background)] to-[var(--background)]">
        <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-start">
          {/* Breadcrumb Strip */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] mb-6">
            <Link to="/" className="hover:text-[var(--gold)] transition-colors">
              {detailUi.home}
            </Link>
            <span className="text-[var(--gold)]/40">/</span>
            <Link to="/periods" className="hover:text-[var(--gold)] transition-colors">
              {detailUi.periods}
            </Link>
            <span className="text-[var(--gold)]/40">/</span>
            <span className="text-[var(--gold)] truncate max-w-xs">{era.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/15 text-[var(--gold)] text-xs font-mono font-bold mb-3">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{era.displayPeriod}</span>
                <span className="text-[var(--gold)]/40">•</span>
                <span>
                  {detailUi.periodWord} {String(era.stepNumber || currentEraIndex + 1).padStart(2, "0")} / 12
                </span>
              </div>

              <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--foreground)] tracking-tight leading-tight">
                {era.title}
              </h1>

              {locale !== "ar" && (
                <p dir="rtl" className="font-amiri text-lg sm:text-xl text-[var(--gold)] font-bold mt-2 opacity-90">
                  {era.arabicTitle}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-[var(--gold)] shrink-0" />
                  <span>
                    <strong className="text-[var(--foreground)]">{detailUi.stateLabel}</strong> {era.devletName || era.empire}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-[var(--gold)] shrink-0" />
                  <span>
                    <strong className="text-[var(--foreground)]">{detailUi.capitalLabel}</strong> {era.capital}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[var(--gold)] shrink-0" />
                  <span>
                    <strong className="text-[var(--foreground)]">{detailUi.archivesLabel}</strong> {sources.length} {detailUi.documentsWord}
                  </span>
                </span>
              </div>
            </div>

            {/* Direct 1-Click Interactive Map Trigger & Secondary Actions */}
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                to={`/interactive-map?era=${era.id}`}
                className="btn-base btn-gold px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all"
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>{detailUi.viewMapCta}</span>
              </Link>

              <Link
                to="/sources"
                className="btn-base btn-outline px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[var(--gold)] shrink-0" />
                <span>{detailUi.viewSourcesCta}</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[var(--gold)]/20">
            <div className="p-3 rounded-xl bg-[var(--card)]/90 border border-[var(--gold)]/20 text-start">
              <span className="text-[10px] uppercase font-mono text-[var(--muted-foreground)] block">{detailUi.kpiLeaders}</span>
              <span className="font-cinzel text-lg font-bold text-[var(--gold)] mt-0.5 block">
                {era.notableLeaders?.length || 0} {detailUi.kpiFigures}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--card)]/90 border border-[var(--gold)]/20 text-start">
              <span className="text-[10px] uppercase font-mono text-[var(--muted-foreground)] block">{detailUi.kpiFamilies}</span>
              <span className="font-cinzel text-lg font-bold text-[var(--gold)] mt-0.5 block">
                {era.notableFamilies?.length || 0} {detailUi.kpiDynasties}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--card)]/90 border border-[var(--gold)]/20 text-start">
              <span className="text-[10px] uppercase font-mono text-[var(--muted-foreground)] block">{detailUi.kpiDivisions}</span>
              <span className="font-cinzel text-lg font-bold text-[var(--gold)] mt-0.5 block">
                {(era.administrativeDivisions?.length || 0) + (era.keySites?.length || 0)} {detailUi.kpiPoles}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--card)]/90 border border-[var(--gold)]/20 text-start">
              <span className="text-[10px] uppercase font-mono text-[var(--muted-foreground)] block">{detailUi.kpiArchives}</span>
              <span className="font-cinzel text-lg font-bold text-[var(--gold)] mt-0.5 block">
                {sources.length} {detailUi.documentsWord}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Highlight Banner: Strategic Role & Institutions of Tunis */}
        {era.tunisRole && (
          <div className="mb-8 surface-card frame-gold p-6 sm:p-7 rounded-2xl bg-[var(--card)]/95 shadow-md border border-[var(--gold)]/35 text-start">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--gold)]/15 text-[var(--gold)] font-bold border border-[var(--gold)]/30">
                    {detailUi.centralPowerBadge}
                  </span>
                  <span className="text-xs font-semibold text-[var(--muted-foreground)]">
                    {detailUi.tunisRolePrefix} {era.title}
                  </span>
                </div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--foreground)]">
                  {detailUi.tunisRoleHeading}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/85 leading-relaxed font-body">
                  {era.tunisRole}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-[var(--gold)]/20 overflow-x-auto pb-2 mb-8 scrollbar-thin">
          <button
            type="button"
            onClick={() => setActiveTab("research_chapters")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "research_chapters"
                ? "bg-[var(--gold)] text-[#1f160f] shadow-md font-extrabold"
                : "surface-card border border-[var(--gold)]/25 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>{detailUi.tabChapters} ({dossier.chapters.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sources")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "sources"
                ? "bg-[var(--gold)] text-[#1f160f] shadow-md font-extrabold"
                : "surface-card border border-[var(--gold)]/25 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5 shrink-0" />
            <span>{detailUi.tabSources} ({sources.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("leaders_families")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "leaders_families"
                ? "bg-[var(--gold)] text-[#1f160f] shadow-md font-extrabold"
                : "surface-card border border-[var(--gold)]/25 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>{detailUi.tabLeaders} ({(era.notableLeaders?.length || 0) + (era.notableFamilies?.length || 0)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tunis_institutions")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "tunis_institutions"
                ? "bg-[var(--gold)] text-[#1f160f] shadow-md font-extrabold"
                : "surface-card border border-[var(--gold)]/25 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>{detailUi.tabTunis}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("context_lineages")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "context_lineages"
                ? "bg-[var(--gold)] text-[#1f160f] shadow-md font-extrabold"
                : "surface-card border border-[var(--gold)]/25 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Landmark className="w-3.5 h-3.5 shrink-0" />
            <span>{detailUi.tabContext}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tribes")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "tribes"
                ? "bg-[var(--gold)] text-[#1f160f] shadow-md font-extrabold"
                : "surface-card border border-[var(--gold)]/25 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{detailUi.tabTribes} ({era.eraTribes?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("divisions")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "divisions"
                ? "bg-[var(--gold)] text-[#1f160f] shadow-md font-extrabold"
                : "surface-card border border-[var(--gold)]/25 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{detailUi.tabDivisions} ({(era.administrativeDivisions?.length || 0) + (era.keySites?.length || 0)})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 0: HISTORICAL RESEARCH CHAPTERS & PEDAGOGICAL MONOGRAPH               */}
        {/* ========================================================================= */}
        {activeTab === "research_chapters" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 1. ACADEMIC OVERVIEW BANNER */}
            <div className="surface-card frame-gold p-6 sm:p-8 rounded-2xl relative overflow-hidden space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--gold)]/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2.5 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--gold)] font-bold">
                      {detailUi.monographEyebrow}
                    </div>
                    <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                      {dossier.eraTitle}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-xs font-bold text-[var(--gold)]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{dossier.historicalPeriod}</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[var(--foreground)]/90 leading-relaxed font-body">
                {dossier.pedagogicalOverview}
              </p>

              {/* Epigraph Quote if available */}
              {dossier.epigraphQuote && (
                <div className="p-4 sm:p-5 rounded-xl border-l-4 border-l-[var(--gold)] border border-[var(--gold)]/20 bg-[var(--gold)]/5 space-y-2">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 text-[var(--gold)] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="italic text-xs sm:text-sm text-[var(--foreground)]/90 leading-relaxed font-display">
                        « {dossier.epigraphQuote.text} »
                      </p>
                      <div className="text-[11px] font-semibold text-[var(--gold)]">
                        — {dossier.epigraphQuote.author},{" "}
                        <span className="text-[var(--muted-foreground)] font-normal">
                          {dossier.epigraphQuote.source}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Learning Objectives Grid */}
              {dossier.learningObjectives && dossier.learningObjectives.length > 0 && (
                <div className="pt-2 border-t border-[var(--gold)]/15 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{detailUi.learningObjectivesTitle}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {dossier.learningObjectives.map((obj, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[var(--background)]/60 border border-[var(--gold)]/20 flex items-start gap-2.5 text-xs text-[var(--foreground)]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                        <span className="leading-snug">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. MULTI-CHAPTER STUDY STUDIO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: CHAPTERS SELECTOR (SOMMAIRE) */}
              <div className="lg:col-span-4 surface-card frame-gold p-4 sm:p-5 rounded-2xl space-y-3 lg:sticky lg:top-24">
                <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-3">
                  <div className="font-cinzel text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                    <Scroll className="w-4 h-4 text-[var(--gold)]" />
                    <span>{detailUi.tocTitle}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] font-bold">
                    {dossier.chapters.length} {detailUi.chaptersWord}
                  </span>
                </div>

                <div className="space-y-2">
                  {dossier.chapters.map((ch, idx) => {
                    const isSelected = idx === selectedChapterIndex;
                    return (
                      <button
                        key={ch.id || idx}
                        type="button"
                        onClick={() => setSelectedChapterIndex(idx)}
                        className={`w-full text-start p-3 rounded-xl transition-all border cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? "bg-[var(--gold)]/15 border-[var(--gold)] shadow-sm scale-[1.01]"
                            : "bg-[var(--background)]/50 border-[var(--gold)]/15 hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/5"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-mono font-bold text-xs ${
                            isSelected
                              ? "bg-[var(--gold)] text-[#1f160f]"
                              : "bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30"
                          }`}
                        >
                          {ch.romanNumber}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div
                            className={`text-xs font-bold leading-tight line-clamp-1 ${
                              isSelected ? "text-[var(--foreground)] font-extrabold" : "text-[var(--foreground)]/85"
                            }`}
                          >
                            {ch.title}
                          </div>
                          <div className="text-[10px] text-[var(--muted-foreground)] line-clamp-1">
                            {ch.subtitle}
                          </div>
                          <div className="flex items-center gap-1.5 pt-0.5 text-[9px] text-[var(--gold)] font-semibold">
                            <Clock className="w-3 h-3" />
                            <span>{ch.readingTimeMinutes} min</span>
                          </div>
                        </div>
                        {isSelected && (
                          <ChevronRight className="w-4 h-4 text-[var(--gold)] shrink-0 self-center" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: ACTIVE CHAPTER STUDY VIEW */}
              {activeChapter && (
                <div className="lg:col-span-8 space-y-6">
                  <div className="surface-card frame-gold p-6 sm:p-8 rounded-2xl space-y-6">
                    {/* Chapter Header */}
                    <div className="space-y-3 border-b border-[var(--gold)]/20 pb-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded bg-[var(--gold)]/15 text-[var(--gold)] uppercase border border-[var(--gold)]/30">
                          {detailUi.chapterWord} {activeChapter.romanNumber}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] font-semibold">
                          <Clock className="w-3.5 h-3.5 text-[var(--gold)]" />
                          <span>{activeChapter.readingTimeMinutes} {detailUi.minRead}</span>
                        </div>
                      </div>

                      <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight">
                        {activeChapter.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-[var(--gold)] font-medium">
                        {activeChapter.subtitle}
                      </p>

                      {/* Theme Badges */}
                      {activeChapter.keyThemes && activeChapter.keyThemes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {activeChapter.keyThemes.map((theme, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--gold)]/10 text-[var(--foreground)] border border-[var(--gold)]/20 font-medium"
                            >
                              #{theme}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pedagogical Summary */}
                    <div className="p-4 sm:p-5 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 space-y-1.5">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{detailUi.chapterSummaryTitle}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed font-body">
                        {activeChapter.summary}
                      </p>
                    </div>

                    {/* Chapter Sections */}
                    <div className="space-y-6 pt-2">
                      {activeChapter.sections.map((sec, sIdx) => (
                        <div key={sIdx} className="space-y-3">
                          <h4 className="font-cinzel text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[var(--gold)] rounded-full"></span>
                            <span>{sec.heading}</span>
                          </h4>
                          <div className="space-y-2.5">
                            {sec.paragraphs.map((para, pIdx) => (
                              <p
                                key={pIdx}
                                className="text-xs sm:text-sm text-[var(--foreground)]/85 leading-relaxed font-body"
                              >
                                {para}
                              </p>
                            ))}
                          </div>

                          {sec.archivalNote && (
                            <div className="p-3.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)]/70 flex items-start gap-2.5 mt-3">
                              <FolderArchive className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                              <div className="space-y-0.5 text-xs">
                                <span className="font-bold text-[var(--gold)] uppercase text-[10px] tracking-wider block">
                                  {detailUi.archivalRefBadge}
                                </span>
                                <span className="text-[var(--foreground)]/90 leading-snug">
                                  {sec.archivalNote}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Key Takeaways Card */}
                    {activeChapter.keyTakeaways && activeChapter.keyTakeaways.length > 0 && (
                      <div className="p-5 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/5 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[var(--gold)]" />
                          <span>{detailUi.keyTakeawaysTitle}</span>
                        </div>
                        <div className="space-y-2">
                          {activeChapter.keyTakeaways.map((takeaway, tkIdx) => (
                            <div
                              key={tkIdx}
                              className="flex items-start gap-2 text-xs text-[var(--foreground)]"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{takeaway}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Primary Sources Cited Card */}
                    {activeChapter.primarySourcesReferenced && activeChapter.primarySourcesReferenced.length > 0 && (
                      <div className="p-4 sm:p-5 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/60 space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-2">
                          <Scroll className="w-4 h-4 text-[var(--gold)]" />
                          <span>{detailUi.primarySourcesCitedTitle}</span>
                        </div>
                        <div className="space-y-1.5">
                          {activeChapter.primarySourcesReferenced.map((src, srcIdx) => (
                            <div
                              key={srcIdx}
                              className="p-2.5 rounded-lg border border-[var(--gold)]/15 bg-[var(--background)] text-xs text-[var(--foreground)] font-mono flex items-center gap-2"
                            >
                              <FileText className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                              <span className="leading-snug">{src}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Chapter Navigation Footer */}
                    <div className="pt-4 border-t border-[var(--gold)]/20 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        disabled={selectedChapterIndex === 0}
                        onClick={() => setSelectedChapterIndex((prev) => Math.max(0, prev - 1))}
                        className={`btn-base text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer ${
                          selectedChapterIndex === 0
                            ? "opacity-40 cursor-not-allowed border border-[var(--gold)]/10 text-[var(--muted-foreground)]"
                            : "btn-outline-ink hover:border-[var(--gold)]"
                        }`}
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{detailUi.prevChapter}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab("sources")}
                        className="btn-base btn-gold text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <FolderArchive className="w-3.5 h-3.5" />
                        <span>{detailUi.viewLinkedDocs} ({sources.length})</span>
                      </button>

                      <button
                        type="button"
                        disabled={selectedChapterIndex >= dossier.chapters.length - 1}
                        onClick={() =>
                          setSelectedChapterIndex((prev) =>
                            Math.min(dossier.chapters.length - 1, prev + 1)
                          )
                        }
                        className={`btn-base text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer ${
                          selectedChapterIndex >= dossier.chapters.length - 1
                            ? "opacity-40 cursor-not-allowed border border-[var(--gold)]/10 text-[var(--muted-foreground)]"
                            : "btn-outline-ink hover:border-[var(--gold)]"
                        }`}
                      >
                        <span>{detailUi.nextChapter}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: LINKED SOURCES & ARCHIVES (LIVE API INTEGRATION)                   */}
        {/* ========================================================================= */}
        {activeTab === "sources" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="text-start">
                <h3 className="font-cinzel text-xl font-bold text-[var(--foreground)]">
                  {detailUi.sourcesSectionTitle}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  {detailUi.sourcesSectionSub(era.title)}
                </p>
              </div>

              {/* Source Type Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {[
                  { key: "all", label: detailUi.filterAll },
                  { key: "document", label: detailUi.filterDocuments },
                  { key: "tree", label: detailUi.filterTrees },
                  { key: "book", label: detailUi.filterBooks },
                  { key: "gallery", label: detailUi.filterPhotos },
                  { key: "audio", label: detailUi.filterAudios },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeFilter === f.key
                        ? "bg-[var(--gold)] text-[#1f160f] font-bold shadow-xs"
                        : "bg-[var(--background)] border border-[var(--gold)]/20 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingSources && (
              <div className="py-16 text-center text-xs text-[var(--muted-foreground)]">
                {detailUi.loadingSourcesText}
              </div>
            )}

            {!loadingSources && filteredSources.length === 0 && (
              <div className="surface-card p-10 rounded-2xl border border-[var(--gold)]/25 text-center max-w-xl mx-auto my-8">
                <FolderArchive className="w-12 h-12 text-[var(--gold)]/40 mx-auto mb-3" />
                <h4 className="font-cinzel text-base font-bold text-[var(--foreground)]">
                  {detailUi.noSourcesTitle}
                </h4>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                  {detailUi.noSourcesDesc}
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <Link to="/sources" className="btn-base btn-gold text-xs py-2 px-4">
                    {detailUi.viewAllArchivesCta}
                  </Link>
                  <Link to="/gallery/documents" className="btn-base btn-outline text-xs py-2 px-4">
                    {detailUi.viewDocumentsGalleryCta}
                  </Link>
                </div>
              </div>
            )}

            {!loadingSources && filteredSources.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSources.map((source) => {
                  const Icon = getSourceIcon(source.source_type);
                  const targetLink = getSourceGalleryLink(source);

                  return (
                    <article
                      key={source.link_id || source.id}
                      className="surface-card frame-gold group flex h-full flex-col justify-between p-6 rounded-xl shadow-md bg-[var(--card)]/95 backdrop-blur-sm text-start transition-all hover:border-[var(--gold)] hover:-translate-y-1"
                    >
                      <div className="space-y-3">
                        {/* Top Category Badge */}
                        <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-3">
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30 font-bold flex items-center gap-1.5">
                            <Icon className="w-3 h-3 shrink-0" />
                            <span>{getSourceTypeLabel(source.source_type)}</span>
                          </span>

                          {source.year && (
                            <span className="font-mono text-[11px] font-bold text-[var(--gold)]">
                              {source.year}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="font-display text-base sm:text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors leading-snug">
                          {source.title}
                        </h4>

                        {/* Description or Notes */}
                        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed font-body line-clamp-3">
                          {source.custom_notes || source.description || detailUi.defaultSourceDesc}
                        </p>

                        {/* Metadata Strip */}
                        <div className="pt-2 space-y-1 text-[11px] text-[var(--muted-foreground)]">
                          {source.archive_source && (
                            <div className="flex items-center gap-1.5">
                              <Landmark className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                              <span className="truncate">{source.archive_source}</span>
                            </div>
                          )}
                          {source.document_code && (
                            <div className="flex items-center gap-1.5 font-mono">
                              <FileText className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                              <span>{detailUi.refCodeLabel} {source.document_code}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* External Action Button */}
                      <div className="mt-6 pt-4 border-t border-[var(--gold)]/15">
                        <Link
                          to={targetLink}
                          className="btn-base btn-gold w-full py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 shrink-0" />
                          <span>{detailUi.openInGalleryCta}</span>
                          <ArrowRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: DIRIGEANTS & GRANDES FAMILLES                                     */}
        {/* ========================================================================= */}
        {activeTab === "leaders_families" && (
          <div className="space-y-10 text-start">
            {/* Section 1: Notable Leaders */}
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)] font-bold">
                  {detailUi.sovereigntyEyebrow}
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-0.5">
                  {detailUi.leadersHeading} ({era.notableLeaders?.length || 0})
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {detailUi.leadersSub}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(era.notableLeaders || []).map((leader, lIdx) => (
                  <article
                    key={lIdx}
                    className="surface-card frame-gold p-6 rounded-xl border border-[var(--gold)]/30 bg-[var(--card)]/95 shadow-md space-y-4 hover:border-[var(--gold)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-[var(--gold)]/20 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 font-bold inline-block">
                          {leader.role}
                        </span>
                        <h4 className="font-display text-lg sm:text-xl font-bold text-[var(--foreground)] mt-1.5">
                          {locale === "ar" && leader.arabicName ? leader.arabicName : leader.name}
                        </h4>
                      </div>

                      {leader.arabicName && locale !== "ar" && (
                        <p dir="rtl" className="font-amiri text-base font-bold text-[var(--gold)] shrink-0">
                          {leader.arabicName}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--gold)]">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{leader.reignOrDates}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                      {leader.achievements}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* Section 2: Notable Families & Dynasties */}
            <div className="pt-6 border-t border-[var(--gold)]/20">
              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)] font-bold">
                  {detailUi.genealogyEyebrow}
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-0.5">
                  {detailUi.familiesHeading} ({era.notableFamilies?.length || 0})
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {detailUi.familiesSub}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(era.notableFamilies || []).map((fam, fIdx) => (
                  <article
                    key={fIdx}
                    className="surface-card frame-gold p-6 rounded-xl border border-[var(--gold)]/30 bg-[var(--card)]/95 shadow-md flex flex-col justify-between hover:border-[var(--gold)] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 border-b border-[var(--gold)]/20 pb-2.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)] font-bold">
                          {fam.role}
                        </span>
                        {fam.arabicName && locale !== "ar" && (
                          <span dir="rtl" className="font-amiri text-sm font-bold text-[var(--gold)]">
                            {fam.arabicName}
                          </span>
                        )}
                      </div>

                      <h4 className="font-display text-base sm:text-lg font-bold text-[var(--foreground)]">
                        {locale === "ar" && fam.arabicName ? fam.arabicName : fam.name}
                      </h4>

                      <div className="p-2.5 rounded-lg bg-[var(--background)]/80 border border-[var(--gold)]/15 text-xs text-[var(--muted-foreground)]">
                        <strong className="text-[var(--gold)] font-semibold">{detailUi.cradleLabel}</strong> {fam.origin}
                      </div>

                      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed font-body">
                        {fam.lineageNotes}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[var(--gold)]/15">
                      <Link
                        to="/gallery/trees"
                        className="text-xs font-bold text-[var(--gold)] hover:underline flex items-center gap-1.5"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>{detailUi.searchLineageTreesCta}</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TUNIS & INSTITUTIONS D'ÉTAT                                       */}
        {/* ========================================================================= */}
        {activeTab === "tunis_institutions" && (
          <div className="space-y-6 text-start max-w-4xl mx-auto">
            <div className="surface-card frame-gold p-6 sm:p-8 rounded-2xl bg-[var(--card)]/95 shadow-lg border border-[var(--gold)]/35 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                    {detailUi.tunisSectionHeading}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {detailUi.tunisSectionSub(era.title)}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--background)]/80 border border-[var(--gold)]/20 text-xs sm:text-sm text-[var(--foreground)]/90 leading-relaxed font-body">
                {era.tunisRole || era.description}
              </div>

              {/* Capital and Coordinates card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[var(--background)]/70 border border-[var(--gold)]/20 space-y-1 text-xs">
                  <span className="text-[10px] font-mono uppercase text-[var(--gold)] font-bold">{detailUi.seatOfPowerLabel}</span>
                  <div className="text-sm font-bold text-[var(--foreground)]">{era.capital}</div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">
                    {detailUi.coordsLabel} {era.capitalCoords?.[0]}° N, {era.capitalCoords?.[1]}° E
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--background)]/70 border border-[var(--gold)]/20 space-y-1 text-xs">
                  <span className="text-[10px] font-mono uppercase text-[var(--gold)] font-bold">{detailUi.sovereignEntityLabel}</span>
                  <div className="text-sm font-bold text-[var(--foreground)]">{era.devletName || era.empire}</div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">
                    {detailUi.designationLabel} {era.tunisiaEntityName}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[var(--gold)]/20 flex flex-wrap items-center gap-3">
                <Link
                  to={`/interactive-map?era=${era.id}`}
                  className="btn-base btn-gold text-xs py-2.5 px-4 font-bold flex items-center gap-2"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{detailUi.centerMapOnCapitalCta}</span>
                </Link>
                <Link
                  to="/sources"
                  className="btn-base btn-outline text-xs py-2.5 px-4 flex items-center gap-2"
                >
                  <Landmark className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>{detailUi.tunisArchivesCta}</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CONTEXTE, TRAITÉS & SYSTÈME ARCHIVISTIQUE                         */}
        {/* ========================================================================= */}
        {activeTab === "context_lineages" && (
          <div className="space-y-6 text-start max-w-4xl mx-auto">
            {/* Political context and borders */}
            <div className="surface-card frame-gold p-6 sm:p-8 rounded-2xl bg-[var(--card)]/95 shadow-md border border-[var(--gold)]/30 space-y-4">
              <h3 className="font-cinzel text-xl font-bold text-[var(--foreground)]">
                {detailUi.politicalOrgHeading}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--foreground)]/85 leading-relaxed font-body">
                {era.description}
              </p>

              <div className="pt-4 border-t border-[var(--gold)]/20">
                <h4 className="font-cinzel text-sm font-bold text-[var(--gold)] uppercase tracking-wider mb-1.5">
                  {detailUi.treatiesBordersHeading}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/80 leading-relaxed font-body">
                  {era.treatiesAndBorders}
                </p>
              </div>
            </div>

            {/* Genealogic registers and archival system */}
            {era.lineagesSummary && (
              <div className="surface-card frame-gold p-6 sm:p-8 rounded-2xl bg-[var(--card)]/95 shadow-md border border-[var(--gold)]/30 space-y-3">
                <div className="flex items-center gap-2 text-[var(--gold)]">
                  <Scroll className="w-5 h-5" />
                  <h4 className="font-cinzel text-base font-bold text-[var(--foreground)]">
                    {detailUi.notarialSystemHeading}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/85 leading-relaxed font-body">
                  {era.lineagesSummary}
                </p>
              </div>
            )}

            {/* Archival Sources List */}
            {era.archivalSources && era.archivalSources.length > 0 && (
              <div className="surface-card p-6 sm:p-8 rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)]/95 shadow-md">
                <h4 className="font-cinzel text-base font-bold text-[var(--gold)] uppercase tracking-wider mb-3">
                  {detailUi.referencedCorpusHeading}
                </h4>
                <ul className="space-y-2 text-xs text-[var(--foreground)]/85">
                  {era.archivalSources.map((srcText, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2.5 p-2 rounded-lg bg-[var(--background)]/60 border border-[var(--gold)]/10">
                      <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{srcText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TRIBUS & PEUPLEMENT                                               */}
        {/* ========================================================================= */}
        {activeTab === "tribes" && (
          <div className="text-start">
            <div className="mb-6">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)] font-bold">
                {detailUi.sociologyEyebrow}
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-0.5">
                {detailUi.tribesHeading} ({era.eraTribes?.length || 0})
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                {detailUi.tribesSub(era.title)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(era.eraTribes || []).map((tribe) => (
                <article
                  key={tribe.id}
                  className="surface-card frame-gold rounded-xl border border-[var(--gold)]/30 bg-[var(--card)]/95 p-6 shadow-md hover:border-[var(--gold)] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-[var(--gold)]/20 pb-2.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)] font-bold flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5" />
                        <span>{detailUi.confederationBadge}</span>
                      </span>
                      {tribe.caidat1881 && (
                        <span className="text-[10px] font-mono text-[var(--muted-foreground)] truncate max-w-[150px]">
                          {tribe.caidat1881.split("(")[0]}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                        {locale === "ar" && tribe.arabicName ? tribe.arabicName : tribe.name}
                      </h4>
                      {tribe.arabicName && locale !== "ar" && (
                        <span dir="rtl" className="font-amiri text-sm font-bold text-[var(--gold)]">
                          {tribe.arabicName}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed font-body">
                      {tribe.homelandDescription}
                    </p>

                    {tribe.fractions && tribe.fractions.length > 0 && (
                      <div className="pt-2 border-t border-[var(--gold)]/15">
                        <span className="text-[10px] font-mono font-bold uppercase text-[var(--gold)] block mb-1">
                          {detailUi.fractionsLabel}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {tribe.fractions.slice(0, 5).map((frac, frIdx) => (
                            <span
                              key={frIdx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--background)] text-[var(--foreground)]/80 border border-[var(--border)]"
                            >
                              {frac}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-[var(--gold)]/20">
                    <Link
                      to={`/interactive-map?tribu=${tribe.id}&era=${era.id}`}
                      className="btn-base btn-gold w-full py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Compass className="w-3.5 h-3.5 shrink-0" />
                      <span>{detailUi.locateTerritoryCta}</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: DIVISIONS TERRITORIALES & CITÉS STRATÉGIQUES                      */}
        {/* ========================================================================= */}
        {activeTab === "divisions" && (
          <div className="space-y-10 text-start">
            {/* Section 1: Administrative Divisions */}
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)] font-bold">
                  {detailUi.territorialMeshEyebrow}
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-0.5">
                  {era.divisionsTitle} ({era.administrativeDivisions?.length || 0})
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {detailUi.divisionsSub(era.title)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(era.administrativeDivisions || []).map((div) => (
                  <article
                    key={div.id}
                    className="surface-card frame-gold rounded-xl border border-[var(--gold)]/30 bg-[var(--card)]/95 p-6 shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b border-[var(--gold)]/20 pb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)] font-bold">
                          {detailUi.historicalDivisionBadge}
                        </span>
                        {div.arabicName && locale !== "ar" && (
                          <span dir="rtl" className="font-amiri text-sm font-bold text-[var(--gold)]">
                            {div.arabicName}
                          </span>
                        )}
                      </div>

                      <h4 className="font-display text-base font-bold text-[var(--foreground)]">
                        {locale === "ar" && div.arabicName ? div.arabicName : div.name}
                      </h4>

                      <div className="p-2.5 rounded-lg bg-[var(--background)]/80 border border-[var(--gold)]/15 text-xs text-[var(--foreground)]">
                        <strong className="text-[var(--gold)] font-semibold">{detailUi.seatCityLabel}</strong> {div.seat}
                      </div>

                      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed font-body">
                        {div.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Section 2: Key Historical Sites */}
            {era.keySites && era.keySites.length > 0 && (
              <div className="pt-6 border-t border-[var(--gold)]/20">
                <div className="mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)] font-bold">
                    {detailUi.heritageEyebrow}
                  </span>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-0.5">
                    {detailUi.keyCitiesHeading} ({era.keySites.length})
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    {detailUi.keyCitiesSub}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {era.keySites.map((site, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 rounded-xl surface-card border border-[var(--gold)]/20 bg-[var(--card)]/90 flex items-start gap-3 shadow-xs"
                    >
                      <MapPin className="w-4 h-4 text-[var(--gold)] shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-xs text-[var(--foreground)] leading-tight">
                          {locale === "ar" && site.arabicName ? site.arabicName : site.name}{" "}
                          {site.arabicName && locale !== "ar" && (
                            <span className="font-amiri text-[var(--gold)]">({site.arabicName})</span>
                          )}
                        </p>
                        <p className="text-[0.72rem] text-[var(--muted-foreground)] mt-1 leading-snug">
                          {site.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chronological Navigation Bar (Prev / Next Era) */}
        <div className="mt-16 pt-8 border-t border-[var(--gold)]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevEra ? (
            <Link
              to={`/periods/${prevEra.id}`}
              className="flex items-center gap-3 surface-card p-3.5 rounded-xl border border-[var(--gold)]/25 hover:border-[var(--gold)] text-start w-full sm:w-auto transition-all group"
            >
              <ArrowLeft className={`w-4 h-4 text-[var(--gold)] shrink-0 group-hover:-translate-x-1 transition-transform ${isRtl ? "rotate-180" : ""}`} />
              <div>
                <span className="text-[0.65rem] text-[var(--muted-foreground)] uppercase font-mono block">
                  {detailUi.prevPeriodLabel}
                </span>
                <span className="text-xs font-cinzel font-bold text-[var(--foreground)] block">
                  {prevEra.title} ({prevEra.displayPeriod.split("–")[0].trim()})
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          <Link
            to="/periods"
            className="text-xs font-semibold text-[var(--gold)] hover:underline flex items-center gap-1.5"
          >
            <span>{detailUi.viewAll12PeriodsCta}</span>
          </Link>

          {nextEra ? (
            <Link
              to={`/periods/${nextEra.id}`}
              className="flex items-center gap-3 surface-card p-3.5 rounded-xl border border-[var(--gold)]/25 hover:border-[var(--gold)] text-end w-full sm:w-auto transition-all group justify-end"
            >
              <div>
                <span className="text-[0.65rem] text-[var(--muted-foreground)] uppercase font-mono block">
                  {detailUi.nextPeriodLabel}
                </span>
                <span className="text-xs font-cinzel font-bold text-[var(--foreground)] block">
                  {nextEra.title} ({nextEra.displayPeriod.split("–")[0].trim()})
                </span>
              </div>
              <ArrowRight className={`w-4 h-4 text-[var(--gold)] shrink-0 group-hover:translate-x-1 transition-transform ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
