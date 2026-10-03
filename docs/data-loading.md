# Data Loading Architecture: tags.json in the Browser

## Overview

`src/data/tags.json` is the **heart of the data pipeline** for this MVP. It is a statically generated file produced by the `scripts/generate_tags.py` Python script using Gemini Vision AI. The React frontend reads this file at build time (via a standard ES module import) to power all search and display features — **no backend server or API is ever called at runtime**.

---

## Current State of tags.json

As of the last validation run:

| Metric | Value |
|---|---|
| Total Photos | 133 (all unique) |
| Model Used | gemini-1.5-pro (via browser), gemini-3.5-flash (via API) |
| Duplicates | 7 found and automatically removed |
| Missing Disk Files | 0 — all photos have JSON entries |
| Schema Violations | 0 — all required fields present |

### Photos by City

| City | Count |
|---|---|
| Goa | 31 |
| Manali | 29 |
| Udaipur | 26 |
| Hampi | 24 |
| Travel | 18 |
| Others | 5 |

---

## How tags.json is Loaded in the Browser

### 1. Static Import (Vite / React — Our Approach)

Since this is a Vite-powered React app, we import the JSON file directly as an ES module. Vite handles the bundling at build time.

```jsx
// In any React component (e.g., App.jsx, SearchBar.jsx)
import tagsData from './data/tags.json';

// tagsData is a plain JavaScript object — no fetch, no async, no loading state needed!
const { photos } = tagsData;
```

**Why this works:**
- Vite has built-in JSON import support.
- The entire JSON is bundled into the JavaScript bundle during `npm run build`.
- Zero network latency for the data at runtime.

### 2. Data Shape Consumed by the UI

Each entry in the `photos` array has this exact shape, which all UI components must use:

```typescript
interface Photo {
  id: string;                  // e.g., "goa_001"
  filename: string;            // e.g., "goa_001.jpg"
  city: string;                // e.g., "Goa"
  primary_subjects: string[];  // Core objects in the photo
  descriptive_tags: string[];  // Visual descriptions
  sensory_cues: string[];      // Texture, temperature, sound tags
  mood_and_tone: string[];     // Emotional descriptors
  dominant_colors: string[];   // Color palette tags
  alt_text: string;            // Single accessible description
  micro_story: string;         // 1-2 sentence first-person narrative
}
```

### 3. Image File Path Resolution

The actual `.jpg` files are served from the `public/photos/` folder. The URL for any photo is resolved at runtime like this:

```js
// The photos folder is structured as: public/photos/{City}/{filename}
// In JSX, a photo's <img src> is built as:
const imgSrc = `/photos/${photo.city}/${photo.filename}`;
```

> **Important:** City names in the folder structure use title case with underscores for multi-word names (e.g., `Western_Ghats`), but the `city` field in the JSON uses spaces (e.g., `"Western Ghats"`). The path must escape or replace spaces: `/photos/${photo.city.replace(/ /g, '_')}/${photo.filename}`.

### 4. Search Logic Overview

All search happens **client-side** using a simple string matching function. The search string is compared against a concatenated text block of all searchable fields:

```js
function buildSearchIndex(photo) {
  return [
    ...photo.primary_subjects,
    ...photo.descriptive_tags,
    ...photo.sensory_cues,
    ...photo.mood_and_tone,
    ...photo.dominant_colors,
    photo.alt_text,
    photo.micro_story,
    photo.city,
  ].join(' ').toLowerCase();
}

function searchPhotos(query, photos) {
  const q = query.toLowerCase().trim();
  if (!q) return photos;
  return photos.filter(photo => buildSearchIndex(photo).includes(q));
}
```

### 5. Performance Notes

- The `tags.json` file is currently ~174KB uncompressed. Gzip compression by Vite will reduce this to ~30-40KB during production build.
- For 133 photos, client-side search is instantaneous (< 1ms).
- If the photo count grows beyond ~2,000, consider migrating to a client-side search library like [Fuse.js](https://fusejs.io/) for fuzzy matching.

---

## Maintenance: Re-running the Data Pipeline

If new photos are added to `public/photos/`:

1. **Add photos** to the appropriate `public/photos/{City}/` subfolder.
2. **Run the script**: `python scripts/generate_tags.py` — it will automatically detect new files and skip already-processed ones.
3. **Validate** the output: `python validate.py`
4. **Rebuild the app**: `npm run build`

---

## Key Design Decision

> The choice to use a static JSON file over a live API was intentional. It eliminates runtime API costs, removes any dependency on external services being up, and makes the app deployable as a simple static site (GitHub Pages, Vercel, Netlify) with zero infrastructure.
