export interface CuratedGalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  archiveSource: string;
  location: string;
  year: string;
  imagePath: string;
  createdAt: string;
}

const createdAt = "2026-04-30T00:00:00.000Z";

function buildGalleryItem(
  sequence: string,
  title: string,
  description: string,
  category: string,
  imageFile = `roots-tunisia-gallery-${sequence}.jpeg`,
): CuratedGalleryItem {
  return {
    id: `roots-tunisia-gallery-${sequence}`,
    title,
    description,
    category,
    archiveSource: "Roots Tunisia Photo Collection",
    location: "Tunisia",
    year: "2026",
    imagePath: `/assets/gallery/${imageFile}`,
    createdAt,
  };
}

export const curatedGalleryItems: CuratedGalleryItem[] = [
  buildGalleryItem(
    "01",
    "Roots Tunisia Family Memory I",
    "A preserved gallery image curated to reflect the personal memory, family continuity, and visual heritage at the heart of Roots Tunisia.",
    "Family Memory",
  ),
  buildGalleryItem(
    "02",
    "Roots Tunisia Family Memory II",
    "Part of the Roots Tunisia visual collection, this image supports the platform's mission to keep Tunisian family stories visible and accessible.",
    "Family Memory",
  ),
  buildGalleryItem(
    "03",
    "Roots Tunisia Portrait Study I",
    "An editorial portrait selection prepared for the public gallery to give the collection a warmer, more documentary presentation.",
    "Portrait Archive",
  ),
  buildGalleryItem(
    "04",
    "Roots Tunisia Portrait Study II",
    "Integrated into the gallery as a visual record of heritage, identity, and the lived details that shape family history in Tunisia.",
    "Portrait Archive",
  ),
  buildGalleryItem(
    "08",
    "Roots Tunisia Documentary Frame II",
    "Prepared for display as part of the Roots Tunisia gallery, with metadata and presentation aligned to the site's heritage-first experience.",
    "Documentary Frame",
  ),
  buildGalleryItem(
    "09",
    "Roots Tunisia Heritage Portrait III",
    "A Roots Tunisia visual entry curated to sit naturally beside family trees, books, and archival references across the platform.",
    "Roots Tunisia Collection",
  ),
  buildGalleryItem(
    "10",
    "Roots Tunisia Heritage Portrait IV",
    "Selected to strengthen the gallery with a more complete and polished Roots Tunisia collection built around cultural memory.",
    "Roots Tunisia Collection",
  ),
  buildGalleryItem(
    "11",
    "Roots Tunisia Archive Glimpse I",
    "A small but meaningful gallery addition that supports the wider archival tone of the Roots Tunisia experience.",
    "Archive Glimpse",
  ),
  buildGalleryItem(
    "12",
    "Roots Tunisia Archive Glimpse II",
    "Included to give the public gallery more continuity and to present the supplied collection as a complete visual series.",
    "Archive Glimpse",
  ),
  buildGalleryItem(
    "13",
    "Roots Tunisia Memory Collection XIII",
    "One of the newly integrated supplied images, presented with consistent metadata and a Roots Tunisia-focused documentary tone.",
    "Memory Collection",
  ),
  buildGalleryItem(
    "14",
    "Roots Tunisia Memory Collection XIV",
    "A curated image that expands the gallery beyond the original set and helps the public collection feel fuller and more balanced.",
    "Memory Collection",
  ),
  buildGalleryItem(
    "16",
    "Roots Tunisia Memory Collection XVI",
    "The final image in the integrated sixteen-photo set, helping complete the Roots Tunisia gallery as a polished public collection.",
    "Memory Collection",
  ),
  buildGalleryItem(
    "whatsapp-2026-03-19",
    "Roots Tunisia Shared Memory",
    "A supplied image from the current photos folder, included so the public gallery reflects the exact available collection.",
    "Memory Collection",
    "roots-Tunisia-gallery-whatsapp-2026-03-19.jpeg",
  ),
];
