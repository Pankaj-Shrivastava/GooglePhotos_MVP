# ⚠️ Edge Cases — Google Photos Memory Search MVP

> Cataloging scenarios where the app might break, behave unexpectedly, or deliver a poor experience — and how to handle each.

---

## 1. Search Edge Cases

### 1.1 Single-Character Queries

| Scenario | User types a single character like `"a"` or `"s"` |
|----------|---------------------------------------------------|
| **Risk** | Matches nearly every photo (most tags contain common letters), flooding the grid with irrelevant results |
| **Handling** | Set a **minimum query length of 2 characters**. Below that, show all photos (treat as empty query). Display a subtle hint: *"Keep typing to search…"* |

### 1.2 Very Long Queries

| Scenario | User pastes or types a paragraph-length query |
|----------|-----------------------------------------------|
| **Risk** | Tokenizer creates dozens of keywords; scoring becomes noisy; performance may degrade |
| **Handling** | **Cap tokens at 10 words.** Silently ignore words beyond the 10th. For 80-100 photos, performance is still fine up to ~20 tokens, but relevance degrades beyond 10. |

### 1.3 Special Characters & Symbols

| Scenario | User types `"beach!!"`, `"sunset @goa"`, `"#manali"`, or emoji `"🏖️"` |
|----------|------------------------------------------------------------------------|
| **Risk** | Special characters don't match any tags; search returns empty |
| **Handling** | **Strip non-alphanumeric characters** (except spaces) before tokenizing. Emojis are stripped silently. |

### 1.4 Partial Word Matches

| Scenario | User types `"mount"` expecting to find `"mountains"` |
|----------|------------------------------------------------------|
| **Risk** | Exact token matching fails; `"mount"` ≠ `"mountains"` |
| **Handling** | Use **substring matching** (`includes()`) instead of exact word matching. `"mount"` will match `"mountains"`, `"mountain road"`, etc. |

### 1.5 Synonym & Semantic Gaps

| Scenario | User searches `"ocean"` but tags contain `"sea"` and `"beach"` |
|----------|----------------------------------------------------------------|
| **Risk** | Zero results despite semantically relevant photos existing |
| **Handling (MVP)** | Accept as a **known limitation**. The empty state's suggestion pill helps redirect the user. |
| **Handling (Future)** | Add a synonym map: `{ "ocean": ["sea", "beach", "coast"], "hill": ["mountain", "peak"], "rocks": ["boulders", "stones"] }` |

### 1.6 Query Matches Only `micro_story`

| Scenario | User types a word that exists only in `micro_story` but not in searchable fields |
|----------|---------------------------------------------------------------------------------|
| **Risk** | Photo isn't surfaced, even though the story mentions the term |
| **Handling** | By design, `micro_story` is **excluded from search** (display-only). This is intentional — stories are narrative, not indexable. If this becomes a recurring gap, consider adding key story nouns to `descriptive_tags` during generation. |

### 1.7 All Photos Match

| Scenario | User types a very generic term like `"India"` or `"travel"` |
|----------|-------------------------------------------------------------|
| **Risk** | Every photo matches; grid looks unchanged; user thinks search is broken |
| **Handling** | Show a **result count badge** near the search bar: *"Showing 87 of 90 photos"*. This confirms the search is working. |

---

## 2. Photo & Image Edge Cases

### 2.1 Broken Image / Failed Load

| Scenario | A photo file is missing, corrupted, or fails to load from the server |
|----------|----------------------------------------------------------------------|
| **Risk** | Broken image icon appears in the grid, breaking the visual experience |
| **Handling** | Use an `onError` handler on `<img>` to replace with a **placeholder** — a dark card with a muted camera icon and text *"Photo unavailable"*. Style it to blend with the grid. |

### 2.2 Inconsistent Image Aspect Ratios

| Scenario | Some photos are landscape (16:9), others portrait (9:16), others square |
|----------|-------------------------------------------------------------------------|
| **Risk** | Grid layout becomes jagged and visually uneven |
| **Handling** | Use `object-cover` with a **fixed aspect ratio** on all card containers (e.g., `aspect-square` or `aspect-[3/4]`). Photos crop to fit uniformly. |

### 2.3 Very Large Image Files

| Scenario | Some downloaded photos are 5MB+ (high-res from Unsplash) |
|----------|----------------------------------------------------------|
| **Risk** | Slow initial page load; excessive bandwidth on mobile |
| **Handling** | During build-time (Task 5.5), resize all photos to **max 1200px width** and compress to **80% JPEG quality**. Target: ~100-200KB per photo. Total dataset: <20MB. |

### 2.4 Slow Image Loading on Scroll

| Scenario | User scrolls quickly; many images start loading simultaneously |
|----------|---------------------------------------------------------------|
| **Risk** | Network congestion; janky scroll experience |
| **Handling** | `<img loading="lazy">` + `IntersectionObserver` with a **root margin** of `200px` (start loading slightly before images enter viewport). Consider using blurred low-res placeholders during loading. |

---

## 3. Card Flip Edge Cases

### 3.1 Rapid Double-Tap

| Scenario | User double-taps a card quickly |
|----------|--------------------------------|
| **Risk** | Card flips and immediately flips back; feels glitchy |
| **Handling** | **Debounce the flip toggle** — ignore clicks within 600ms of the last flip (matching the CSS transition duration). |

### 3.2 Flip While Scrolling

| Scenario | User tries to scroll but accidentally taps a card |
|----------|---------------------------------------------------|
| **Risk** | Card flips unexpectedly; feels unintentional |
| **Handling** | Differentiate between **tap** and **scroll** using touch events. Only trigger flip if `touchmove` distance is <10px (i.e., it's a stationary tap, not a scroll gesture). |

### 3.3 Tag Overflow on Back Face

| Scenario | AI generates many long tags; content exceeds card height |
|----------|----------------------------------------------------------|
| **Risk** | Tags overflow and get clipped or overlap the card boundary |
| **Handling** | Back face has `overflow-y: auto` with a subtle scrollbar. Micro-story is fixed at top; tag pills scroll below. |

### 3.4 Missing or Empty Tags

| Scenario | AI fails to generate a field for a specific photo (e.g., `sensory_cues: []`) |
|----------|-----------------------------------------------------------------------------|
| **Risk** | Tag overlay looks empty/broken for that category |
| **Handling** | **Skip rendering empty categories.** Don't show a section header if the array is empty. The back face still shows whatever data is available. |

---

## 4. Onboarding Toast Edge Cases

### 4.1 localStorage Unavailable

| Scenario | Browser has localStorage disabled (privacy mode, full storage) |
|----------|---------------------------------------------------------------|
| **Risk** | Toast reappears on every visit; `localStorage.setItem` throws error |
| **Handling** | Wrap localStorage calls in a **try-catch**. If unavailable, toast appears every visit (acceptable for MVP — it's just a hint). |

### 4.2 Toast Overlaps Content

| Scenario | On very short phone screens, the toast covers the bottom row of photos |
|----------|----------------------------------------------------------------------|
| **Risk** | User can't see or tap the last visible photo |
| **Handling** | Add **bottom padding** to the photo grid equal to the toast height + spacing when the toast is visible. Remove padding when dismissed. |

---

## 5. Device Frame Edge Cases

### 5.1 Window Resize (Desktop)

| Scenario | User resizes the browser window from desktop-width to mobile-width |
|----------|-------------------------------------------------------------------|
| **Risk** | Frame doesn't disappear; content gets squished inside the bezel |
| **Handling** | Use a **CSS media query** (`max-width: 480px`) to hide the frame. CSS handles this automatically without JS. Verify with `window.matchMedia` if using JS approach. |

### 5.2 Tablet in Landscape

| Scenario | Tablet user rotates to landscape; phone frame looks tiny |
|----------|----------------------------------------------------------|
| **Risk** | Phone frame is centered but surrounded by excessive empty space |
| **Handling** | In landscape on tablet, keep the phone frame but **scale it slightly larger** or add a descriptive caption next to the frame: *"Memory Search — as Priya sees it on her Pixel 8"*. |

### 5.3 Scroll Inside Frame

| Scenario | App content exceeds frame height; user needs to scroll |
|----------|-------------------------------------------------------|
| **Risk** | Frame itself scrolls on the page instead of content scrolling inside the frame |
| **Handling** | Frame container has `overflow-y: auto` on the inner content div. The frame itself is `position: fixed` or centered with `overflow: hidden`. |

---

## 6. Data & tags.json Edge Cases

### 6.1 Duplicate Photo IDs

| Scenario | Two photos accidentally get the same `id` in tags.json |
|----------|-------------------------------------------------------|
| **Risk** | React key warnings; wrong tag data shown on flip |
| **Handling** | Use `{city}_{###}` naming convention strictly. Add a **validation check** in `generate_tags.py` that asserts all IDs are unique before writing the file. |

### 6.2 Photo Exists but No Tag Entry

| Scenario | A photo file exists in `/public/photos/` but has no corresponding entry in `tags.json` |
|----------|----------------------------------------------------------------------------------------|
| **Risk** | Photo renders in grid but shows empty/broken back face on flip |
| **Handling** | At app load, **filter photos** to only show those with matching tag entries. Log a warning in console for any orphan photos. |

### 6.3 Tag Entry Exists but Photo Missing

| Scenario | `tags.json` has an entry but the photo file was deleted or not downloaded |
|----------|-------------------------------------------------------------------------|
| **Risk** | Card renders with a broken image |
| **Handling** | Same as Edge Case 2.1 — `onError` handler shows a placeholder card. |

---

## 7. Performance Edge Cases

### 7.1 First Load on Slow Connection

| Scenario | User opens the app on a 3G connection for the first time |
|----------|----------------------------------------------------------|
| **Risk** | White screen for several seconds while photos load |
| **Handling** | Show a **loading skeleton** (pulsing gray cards) while the grid hydrates. Tags.json loads instantly (small file); photos lazy-load progressively. |

### 7.2 Browser Tab Backgrounded

| Scenario | User switches tabs; comes back later |
|----------|---------------------------------------|
| **Risk** | Toast auto-dismiss timer (8s) fires while tab is backgrounded; user never sees the toast |
| **Handling** | Use `requestAnimationFrame` or check `document.visibilityState` to pause the timer while the tab is hidden. |

---

## Summary Matrix

| Category | Edge Cases | Severity | MVP Priority |
|----------|-----------|----------|--------------|
| **Search** | 7 cases | Medium–High | Must handle 1.1–1.4; accept 1.5–1.7 |
| **Images** | 4 cases | High | Must handle all |
| **Card Flip** | 4 cases | Medium | Must handle 3.1, 3.3–3.4; nice-to-have 3.2 |
| **Toast** | 2 cases | Low | Accept both |
| **Device Frame** | 3 cases | Medium | Must handle 5.1, 5.3; nice-to-have 5.2 |
| **Data** | 3 cases | Medium | Must handle all (via validation) |
| **Performance** | 2 cases | Medium | Must handle 7.1; nice-to-have 7.2 |

---

## References

- [architecture.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos_MVP/docs/architecture.md) — Component specs, search engine, state management
- [context.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos_MVP/docs/context.md) — MVP scope, persona, tag schema
- [implementation-plan.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos_MVP/docs/implementation-plan.md) — Task references for implementation
