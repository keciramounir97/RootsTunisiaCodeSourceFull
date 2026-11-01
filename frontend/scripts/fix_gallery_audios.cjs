const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/pages/GalleryAudios.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Localized audios
const oldInitialAudiosRegex = /const TUNISIAN_INITIAL_AUDIOS: AudioItem\[\] = \[([\s\S]*?)\];/;
const newInitialAudios = `const TUNISIAN_INITIAL_AUDIOS_EN: AudioItem[] = [
  {
    id: "aud-tn-1",
    title: "Malouf Heritage & Andalusian Pedigree Songs of Testour",
    description: "Oral testimony recorded in 1968 detailing family lineages and Andalusian musical traditions brought to Testour in the 17th century.",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 380,
    category: "Oral History & Music",
    governorate: "Béja / Testour",
    archiveSource: "Centre des Musiques Arabes et Méditerranéennes (Ennejma Ezzahra)",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    likes: 54,
    comments: [],
  },
  {
    id: "aud-tn-2",
    title: "Memories of the Beylical Majba & Family Taxes in Sfax (1881)",
    description: "Oral history interview with elders from Sfax sharing generational accounts of Beylical tax registers and coastal maritime trade.",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 512,
    category: "Oral History",
    governorate: "Sfax",
    archiveSource: "Société d'Histoire de Sfax & Archives Nationales",
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    likes: 39,
    comments: [],
  },
  {
    id: "aud-tn-3",
    title: "Djerban Maritime & Caravan Dialect Memories",
    description: "Audio recordings capturing older Djerban Arabic idioms, family waqf terms, and island trade routes across Gabès and Tozeur.",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 420,
    category: "Dialect & Culture",
    governorate: "Médenine / Djerba",
    archiveSource: "Djerba Cultural Heritage Archives",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    likes: 47,
    comments: [],
  },
];

const TUNISIAN_INITIAL_AUDIOS_AR: AudioItem[] = [
  {
    id: "aud-tn-1",
    title: "مالوف تستور وسلاسل الأنساب الأندلسية",
    description: "شهادة شفوية مسجلة سنة 1968 توثق أصول العائلات الأندلسية وأهازيج المالوف المتوارثة في تستور.",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 380,
    category: "تاريخ شفوي وموسيقى",
    governorate: "باجة / تستور",
    archiveSource: "مركز الموسيقى العربية والمتوسطية (النجمة الزهراء)",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    likes: 54,
    comments: [],
  },
  {
    id: "aud-tn-2",
    title: "ذاكرة تجارة صفاقس ودفاتر المجبى (1881 م)",
    description: "حوار مع شيوخ صفاقس حول دفاتر الجباية البايليّة وطرق الملاحة الساحلية والتجارة البحرية.",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 512,
    category: "تاريخ شفوي",
    governorate: "صفاقس",
    archiveSource: "جمعية تاريخ صفاقس والأرشيف الوطني",
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    likes: 39,
    comments: [],
  },
  {
    id: "aud-tn-3",
    title: "لهجة جربة ومسارات قوافل الجنوب",
    description: "تسجيل صوتي يوثق مصطلحات الأحباس الجربية القديمة ولهجة الجزيرة ومسارات التجارة عبر قابس وتوزر.",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 420,
    category: "لهجات وتراث",
    governorate: "مدنين / جربة",
    archiveSource: "أرشيف التراث الثقافي بجربة",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    likes: 47,
    comments: [],
  },
];`;

content = content.replace(oldInitialAudiosRegex, newInitialAudios);

// 2. Localize hook
content = content.replace(
  /const \{ t \} = useTranslation\(\);/g,
  `const { t, locale } = useTranslation();
  const isArabic = locale === "ar";
  const defaultInitialAudios = isArabic ? TUNISIAN_INITIAL_AUDIOS_AR : TUNISIAN_INITIAL_AUDIOS_EN;`
);

content = content.replace(/TUNISIAN_INITIAL_AUDIOS/g, 'defaultInitialAudios');

// 3. Search placeholder
content = content.replace(
  /placeholder=\{t\("search_audio_placeholder",[^)]+\)\}/g,
  `placeholder={t("search_audio_placeholder", isArabic ? "ابحث عن تسجيل صوتي، راوٍ، أو ولاية…" : "Search audio by title, description or governorate…")}`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated GalleryAudios.tsx');
