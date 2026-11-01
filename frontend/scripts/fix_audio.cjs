const fs = require('fs');
const path = require('path');

const audioPath = path.join(__dirname, '../src/pages/audio.tsx');
let c = fs.readFileSync(audioPath, 'utf8');

const newRecordings = `const recordings = [
  {
    id: 1,
    titleKey: "audio_rec_1_title",
    titleFallback: "Hajja Zohra on the Souk of Nabeul",
    placeKey: "audio_rec_1_place",
    placeFallback: "Nabeul · 1998 recording",
    length: "42 min",
    bodyKey: "audio_rec_1_body",
    bodyFallback: "Pottery families, apprenticeships, and the marriage networks that linked Nabeul to Tunis.",
  },
  {
    id: 2,
    titleKey: "audio_rec_2_title",
    titleFallback: "Si Mohamed Ben Amor, chechia maker",
    placeKey: "audio_rec_2_place",
    placeFallback: "Medina of Tunis · 2004",
    length: "37 min",
    bodyKey: "audio_rec_2_body",
    bodyFallback: "The chechia guild, workshop hierarchy, and how a trade name became a family surname.",
  },
  {
    id: 3,
    titleKey: "audio_rec_3_title",
    titleFallback: "Uncle Brahim, Matmata Berber memories",
    placeKey: "audio_rec_3_place",
    placeFallback: "Tamezret · 2011",
    length: "55 min",
    bodyKey: "audio_rec_3_body",
    bodyFallback: "Amazigh village lineage, olive terraces, migration to Tunis and seasonal movement.",
  },
  {
    id: 4,
    titleKey: "audio_rec_4_title",
    titleFallback: "Lalla Khadija on the displacement from Cap Bon",
    placeKey: "audio_rec_4_place",
    placeFallback: "Grombalia · 2001",
    length: "29 min",
    bodyKey: "audio_rec_4_body",
    bodyFallback: "Agricultural lands, colonial expropriation, and how branches reassembled after 1956.",
  },
];`;

const recRegex = /const recordings = \[[\s\S]*?\];/;
c = c.replace(recRegex, newRecordings);

c = c.replace(
  '{r.length} {isPlaying && "· Playing"}',
  '{r.length} {isPlaying && ` · ${t("audio_playing", "قيد التشغيل")}`}'
);
c = c.replace(
  '<p className="text-xs text-[var(--muted-foreground)]">{r.place}</p>',
  '<p className="text-xs text-[var(--muted-foreground)]">{t(r.placeKey, r.placeFallback)}</p>'
);
c = c.replace(
  '<h3 className="mt-4 font-display text-xl leading-snug text-[var(--foreground)]">{r.title}</h3>',
  '<h3 className="mt-4 font-display text-xl leading-snug text-[var(--foreground)]">{t(r.titleKey, r.titleFallback)}</h3>'
);
c = c.replace(
  '<p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{r.body}</p>',
  '<p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{t(r.bodyKey, r.bodyFallback)}</p>'
);

fs.writeFileSync(audioPath, c, 'utf8');
console.log('audio.tsx updated with translation keys');
