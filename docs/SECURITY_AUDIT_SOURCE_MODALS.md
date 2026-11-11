# Audit & Remédiation de Sécurité : Masquage des URLs Backend dans les Modals de Sources

**Projet** : Roots Tunisia  
**Date** : 11 Novembre 2026  
**Type** : Durcissement de Sécurité & Protection de l'Infrastructure (Infrastructure Masking & Data Leakage Prevention)  
**Portée** : Roots Tunisia uniquement (`RootsTunisiaCodeSourceFull`)

---

## 1. Contexte & Diagnostic du Risque

Lors de la consultation des sources et pièces d'archives (via le bouton « Ouvrir » ou « Open Details » dans le constructeur d'arbres généalogiques et la fiche individuelle), le modal de prévisualisation affichait l'adresse URL complète du fichier sous le titre :
```text
https://server.rootstunisia.com/uploads/gallery/gallery-3bfdb7d9139ef02f82604cf0e880be26.jpg
https://server.rootstunisia.com/uploads/gallery/gallery-d438de85fe3cad555e6c7f8fde44326f.jpeg
```

### Vulnérabilités identifiées :
1. **Divulgation de l'infrastructure backend (Information Disclosure)** :  
   Exposition directe du sous-domaine backend interne `server.rootstunisia.com` auprès des visiteurs et utilisateurs publics, permettant le ciblage d'API directes en contournant le frontend ou le CDN.
2. **Fuite des chemins et condensats de hachage de stockage** :  
   Affichage des chemins physiques internes (`/uploads/gallery/`, `/uploads/documents/`) et des noms de fichiers cryptographiques (`gallery-d438de85...`), détruisant l'expérience utilisateur et révélant la structure des répertoires du serveur.
3. **Survol des liens et barre d'état du navigateur** :  
   Les boutons de téléchargement utilisaient des balises `<a href="https://server.rootstunisia.com/...">` qui affichaient l'URL du backend en infobulle dans le coin inférieur gauche du navigateur dès le survol.

---

## 2. Solutions Mises en Œuvre

### A. Suppression définitive de l'URL dans les en-têtes de modals
Dans `TreesBuilder.tsx` et `Individuals.tsx`, la ligne qui imprimait directement l'URL sous le titre :
```tsx
// AVANT (Vulnérable) :
<p className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-1">
  {previewSource.url}
</p>
```
a été **complètement supprimée**.  
Elle est remplacée par un badge d'attestation archivistique institutionnel avec icône vectorielle Lucide (sans émojis) :
```tsx
// APRÈS (Sécurisé) :
<div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
  <span>Source d'Archives Certifiée • Fonds Numérisé</span>
</div>
```

---

### B. Masquage intelligent des libellés (`maskSourceLabel` & `isInternalBackendUrl`)
Une fonction d'assainissement robuste a été implémentée et exportée :
1. `isInternalBackendUrl(urlOrPath)` :  
   Détecte de manière exhaustive :
   - `server.rootstunisia.com`
   - `api.rootstunisia.com`
   - `localhost:5000` / `127.0.0.1:5000`
   - Les préfixes `/uploads/`, `/private_uploads/`, `uploads/gallery`, `uploads/documents`, `uploads/audios`
   - Les motifs de hachage `^(gallery|doc|file|avatar|audio)-[a-f0-9]{8,}`
2. `maskSourceLabel(label, url, kind)` :  
   - Si le libellé est un vrai titre humain archivistique (ex. : *"El Kef, Tunisie - Ville natale de Victor Samuel Brakha, Marie Sabban..."* ou *"Family Portrait"*), il est conservé intact.
   - Si le libellé contient une URL interne, un sous-domaine serveur ou un hash de téléversement brut (ex. : `gallery-d438de85fe3cad555e6c7f8fde44326f.jpeg`), il est automatiquement substitué par une désignation institutionnelle propre :
     - Type image : `"Photographie d'Archive Numérisée"`
     - Type document / livre : `"Acte & Document d'Archives Officiel"`
     - Type audio : `"Enregistrement Oral d'Archive"`
     - Par défaut : `"Source d'Archives Certifiée"`

---

### C. Téléchargement sécurisé par Blob en mémoire (`handleSafeDownloadOrOpen`)
Pour éviter que le navigateur n'expose `server.rootstunisia.com` au survol de la souris ou lors d'un clic droit :
1. Le lien `<a href={previewSource.url}>` a été remplacé par un bouton interactif déclenchant `handleSafeDownloadOrOpen(previewSource.url, previewSource.label)`.
2. La fonction télécharge la ressource en arrière-plan, génère une URL blob locale éphémère (`blob:https://rootstunisia.com/...`), puis déclenche le téléchargement avec un nom de fichier propre dérivé du titre (ex. `el_kef_tunisie.jpeg` ou `document_archive.jpg`).
3. L'URL locale temporaire est révoquée immédiatement après le téléchargement (`URL.revokeObjectURL`).
4. En cas de blocage cross-origin exceptionnel, une ouverture propre en arrière-plan avec `noopener,noreferrer` assure la continuité de service sans divulgation textuelle dans l'interface.

---

## 3. Fichiers Modifiés

| Fichier | Emplacement | Modification |
|---|---|---|
| `TreesBuilder.tsx` | `frontend/src/admin/components/` | Définition de `isInternalBackendUrl`, `maskSourceLabel`, `handleSafeDownloadOrOpen`, suppression de `{previewSource.url}`, ajout du badge `ShieldCheck`, masquage des titres et bouton de téléchargement blob |
| `Individuals.tsx` | `frontend/src/admin/pages/` | Définition de `isInternalBackendUrl`, `maskSourceLabel`, `handleSafeDownloadOrOpen`, suppression de `{previewSource.url}` dans le modal d'aperçu, sécurisation de la liste des liens de l'individu |
| `FamilyCardModal.tsx` | `frontend/src/components/` | Application de `maskSourceLabel` sur le titre du modal de source public et téléchargement sécurisé sans exposition de l'hôte backend |
| `PersonLinksPanel.tsx` | `frontend/src/components/` | Masquage des chemins `/uploads/` et sous-domaines backend internes dans le tiroir latéral des liens de la personne |
| `TreesBuilder.sourceLinks.test.ts` | `frontend/src/admin/components/` | Ajout de la suite de tests automatisés de détection et masquage d'URL |

---

## 4. Tests & Validation

1. **Tests unitaires & intégration** :
   ```bash
   npx vitest run
   ```
   - **Résultat** : 12 suites de tests passées, **57/57 tests réussis** (100%).
   - Les tests valident que `https://server.rootstunisia.com/...` et `gallery-d438de85...` sont correctement interceptés et masqués, et que les vrais titres archivistiques sont préservés.

2. **Compilation de production (Build Vite)** :
   ```bash
   npm run build
   ```
   - **Résultat** : Code de sortie `0`, tous les modules transformés et minifiés sans aucune erreur.

