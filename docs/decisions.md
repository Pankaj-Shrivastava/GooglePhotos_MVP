# 📝 Decisions — Google Photos Memory Search MVP

> An Architectural Decision Record (ADR) log capturing every significant choice made during planning, with rationale, alternatives considered, and trade-offs accepted.

---

## Decision Log

| # | Decision | Date | Status |
|---|----------|------|--------|
| D-001 | [Focus on visual & sensory metadata only](#d-001) | 2026-10-03 | ✅ Accepted |
| D-002 | [Choose Solution C (AI story + tags)](#d-002) | 2026-10-03 | ✅ Accepted |
| D-003 | [Pre-compute all tags as static JSON](#d-003) | 2026-10-03 | ✅ Accepted |
| D-004 | [Use Groq API for tag generation](#d-004) | 2026-10-03 | ✅ Accepted |
| D-005 | [Download 80–100 photos from stock sites](#d-005) | 2026-10-03 | ✅ Accepted |
| D-006 | [Use React + Vite for frontend](#d-006) | 2026-10-03 | ✅ Accepted |
| D-007 | [Use Tailwind CSS for styling](#d-007) | 2026-10-03 | ✅ Accepted |
| D-008 | [Client-side keyword search over JSON](#d-008) | 2026-10-03 | ✅ Accepted |
| D-009 | [Phone frame on desktop, native on mobile](#d-009) | 2026-10-03 | ✅ Accepted |
| D-010 | [Onboarding toast over modal](#d-010) | 2026-10-03 | ✅ Accepted |
| D-011 | [Exclude micro_story from search](#d-011) | 2026-10-03 | ✅ Accepted |
| D-012 | [Deploy on Vercel](#d-012) | 2026-10-03 | ✅ Accepted |
| D-013 | [4 Indian cities for photo dataset](#d-013) | 2026-10-03 | ✅ Accepted |
| D-014 | [Card flip for tag reveal](#d-014) | 2026-10-03 | ✅ Accepted |

---

## D-001 — Focus on Visual & Sensory Metadata Only {#d-001}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

The [MetadataExtraction.txt](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos_MVP/docs/MetadataExtraction.txt) outlines a two-part extraction approach:
1. **AI Prompt** — Visual & sensory metadata (subjects, tags, sensory cues, mood, colors)
2. **Code Logic** — Technical/EXIF metadata (date taken, GPS coordinates, camera model)

### Decision

Focus exclusively on Part 1 (visual & sensory) for this MVP. Skip Part 2 (EXIF/technical) entirely.

### Rationale

- Photos are downloaded from the internet → **EXIF data is stripped** by stock photo sites
- The **core hypothesis** is about bridging cognitive mismatch via sensory cues — EXIF metadata is what Google Photos *already does well*
- Tighter scope → more polished demo
- Technical metadata can be added in a future iteration if real user photos are used

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Generate fake EXIF data (random dates, GPS coords) | Misleading; adds no value to the hypothesis test |
| Use both approaches with real photos | Requires users to upload personal photos; scope creep |

### Trade-offs Accepted

- ❌ Cannot demo date-based or location-based search
- ✅ Clean, focused demo of the sensory tag concept

---

## D-002 — Choose Solution C (AI Story + Tags) {#d-002}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

The [NL_GooglePhotos.pdf](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos_MVP/docs/NL_GooglePhotos.pdf) evaluated three possible solutions to the cognitive mismatch problem.

### Decision

Implement **Solution C**: AI associates a brief story to each photo and extracts sensory cue tags as metadata.

### Rationale

| Option | Approach | Verdict |
|--------|----------|---------|
| A | Surface "Add to Collection" prompts | ❌ Increases cognitive load on user |
| B | Filter options on object tags (like shopping apps) | ❌ Fails for complex/contextual queries |
| **C** | **AI generates story + extracts sensory tags** | **✅ Zero cognitive load; addresses root cause** |

Solution C is the only option that works *without* requiring the user to do anything. The AI enriches metadata silently in the background.

### Trade-offs Accepted

- ❌ Depends on AI model quality for tag accuracy
- ❌ Stories may occasionally feel generic
- ✅ User has zero additional cognitive burden

---

## D-003 — Pre-Compute All Tags as Static JSON {#d-003}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

Tags could be generated in real-time (on photo upload or on search) or pre-computed offline.

### Decision

Generate all tags offline using a Python script, store as a static `tags.json` file bundled with the app.

### Rationale

- **Zero runtime latency** — search is instant (in-memory filtering)
- **No API costs** at runtime — Groq free tier only used during build
- **No backend needed** — entire app is a static SPA
- **Deterministic** — same tags every time; easy to review and validate
- **Offline-capable** — app works without internet after initial load

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Real-time AI tagging on each search query | Too slow (2-5s per query); burns API quota; defeats "instant search" goal |
| Server-side tag generation with database | Over-engineered for an MVP with 80-100 fixed photos |
| Embed a local AI model (WASM/ONNX) | Complex; large download; unreliable on mobile devices |

### Trade-offs Accepted

- ❌ Tags cannot be regenerated without re-running the script
- ❌ Adding new photos requires re-running the pipeline
- ✅ Zero runtime complexity; instant search

---

## D-004 — Use Groq API for Tag Generation {#d-004}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

Need a Vision-Language model to analyze photos and extract structured metadata. Must be free.

### Decision

Use Groq's free tier API with a vision-capable model (LLaVA or Llama 3.2 Vision).

### Rationale

- **Free tier available** — essential for MVP budget
- **Fast inference** — Groq's LPU delivers sub-second responses
- **Vision model support** — can process images and return structured JSON
- **Good JSON adherence** — models follow structured output prompts well

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| OpenAI GPT-4o Vision | Costs money; overkill for tag extraction |
| Google Gemini 1.5 Flash | Free tier exists but rate limits are strict for batch processing |
| Local model (LLaVA via Ollama) | Requires GPU; slow on CPU; inconsistent across machines |
| Hugging Face Inference API | Free tier has strict rate limits; model selection limited |

### Trade-offs Accepted

- ❌ Groq free tier has rate limits (may need batching with delays)
- ❌ Model selection limited to what's available on Groq
- ✅ Free, fast, and sufficient quality for MVP

---

## D-005 — Download 80–100 Photos from Stock Sites {#d-005}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

Need a realistic photo dataset representing Priya's travel photo library (~5,000 photos, scaled down for MVP).

### Decision

Download 80–100 royalty-free photos from Unsplash → Pexels → Pixabay (fallback chain).

### Rationale

- **Free and legal** — all three platforms offer royalty-free licenses
- **High quality** — especially Unsplash; photos look professional
- **Programmatic access** — all have APIs for batch downloading
- **80-100 is sufficient** — enough to demonstrate search across 4 cities without overwhelming the demo

### Why 80–100 (not more or fewer)?

| Count | Assessment |
|-------|-----------|
| 30-50 | Too few; search results feel sparse; hard to differentiate cities |
| **80-100** | **Sweet spot — 20-25 per city provides variety; total dataset is manageable (~15-20MB)** |
| 150-200 | Diminishing returns; more curation effort; larger deploy size; same demo impact |

### Trade-offs Accepted

- ❌ Stock photos lack the personal, candid feel of real travel photos
- ❌ No EXIF metadata available
- ✅ High quality, diverse, legally clear

---

## D-006 — Use React + Vite for Frontend {#d-006}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

Need a frontend framework that handles: responsive grid, card flip animations, real-time search filtering, lazy loading.

### Decision

React (via Vite) as the frontend framework.

### Rationale

- **Component model** — ideal for PhotoCard, PhotoGrid, SearchBar as reusable components
- **State management** — React's `useState` handles search query → filtered results cleanly
- **Vite** — fast dev server (HMR), optimized production builds, excellent Tailwind integration
- **Ecosystem** — widely supported; easy to deploy on Vercel

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Vanilla HTML/CSS/JS | No component model; manual DOM manipulation for grid/flip is tedious |
| Vue + Vite | Equally capable, but React is more familiar and widely reviewed |
| Next.js | SSR/SSG overkill for a static SPA with no API routes |
| Svelte | Smaller bundle, but less ecosystem support for MVP showcase |

### Trade-offs Accepted

- ❌ React's bundle size is larger than Svelte/vanilla
- ✅ Mature ecosystem; easy to find solutions; Vite keeps dev experience fast

---

## D-007 — Use Tailwind CSS for Styling {#d-007}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

Initially planned Vanilla CSS. Changed to Tailwind CSS per user preference.

### Decision

Use Tailwind CSS for all styling.

### Rationale

- **Utility-first** — rapid prototyping; no context-switching between JSX and CSS files
- **Responsive design** — built-in breakpoint utilities (`sm:`, `md:`, `lg:`)
- **Dark mode** — `dark:` variant makes theming trivial
- **Glassmorphism** — `backdrop-blur-xl`, `bg-white/10` are built-in utilities
- **Tree-shaking** — unused styles purged in production; small CSS bundle

### Trade-offs Accepted

- ❌ Inline utility classes can make JSX verbose
- ❌ Adds build-time dependency (PostCSS)
- ✅ Dramatically faster styling iteration

---

## D-008 — Client-Side Keyword Search Over JSON {#d-008}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

Need a search mechanism that feels instant and handles natural language queries like *"golden sunset beach"*.

### Decision

Client-side JavaScript search: tokenize query → substring match across tag fields → score by match count → rank results.

### Rationale

- **Instant** — no network round-trip; sub-millisecond for 80-100 records
- **Simple** — ~30 lines of code; no external library needed
- **Sufficient** — keyword matching works well for 80-100 photos with rich tags
- **No backend** — keeps the app fully static

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Algolia / Typesense | External service; overkill for <100 records |
| Fuse.js (fuzzy search library) | Adds dependency; fuzzy matching can return too many false positives |
| Embedding-based semantic search | Requires vector DB or runtime model; way beyond MVP scope |
| Backend search (Elasticsearch) | Needs a server; defeats static SPA architecture |

### Trade-offs Accepted

- ❌ No synonym matching (`"ocean"` won't find `"sea"`)
- ❌ No typo tolerance
- ❌ No semantic understanding
- ✅ Instant, zero-dependency, works offline

---

## D-009 — Phone Frame on Desktop, Native on Mobile {#d-009}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

The MVP is mobile-first (Priya uses a Pixel 8), but will be demoed on desktop screens.

### Decision

Render the app inside a realistic phone device frame on desktop/tablet viewports (>480px). On mobile (≤480px), remove the frame and load edge-to-edge.

### Rationale

- **Demo context** — stakeholders viewing on laptop see the app *as Priya would* on her phone
- **Mobile-native feel** — the content is designed for a narrow viewport; a phone frame prevents it from stretching unnaturally on wide screens
- **Clean presentation** — gradient backdrop behind the frame looks professional

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Responsive layout (fill desktop width) | Content stretches; 2-column grid on a 1440px screen looks wrong |
| Embedded iframe | Complex; cross-origin issues; scroll synchronization problems |
| "View on mobile" QR code | Extra step for the viewer; loses immediacy |

### Trade-offs Accepted

- ❌ Desktop users see a smaller viewport (375×812px)
- ❌ Extra CSS complexity for the bezel/notch
- ✅ Authentic mobile experience on any device

---

## D-010 — Onboarding Toast Over Modal {#d-010}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

The card-flip interaction isn't immediately discoverable. Need to hint users that tapping a photo reveals AI tags.

### Decision

Use a dismissable floating toast notification instead of a modal dialog.

### Rationale

- **Non-blocking** — user can start exploring immediately while the toast is visible
- **Less intrusive** — a modal forces the user to acknowledge before proceeding
- **Contextual** — appears at the bottom near where photos are, not in the center
- **Auto-dismisses** — disappears after 8 seconds if user doesn't interact

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Modal dialog | Blocks interaction; feels heavy for a simple hint |
| Tooltip on first photo | Only visible if user hovers/focuses on the exact right element |
| Pulsing animation on first card | Subtle; easily missed; doesn't explain what happens on tap |
| In-app tutorial walkthrough | Over-engineered for a single interaction |

### Trade-offs Accepted

- ❌ Toast may be missed if user scrolls immediately
- ❌ Auto-dismiss might fire before user reads it
- ✅ Clean, modern, non-intrusive

---

## D-011 — Exclude `micro_story` from Search {#d-011}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

Each photo has a `micro_story` field — a 1-2 line narrative. It contains keywords that *could* match search queries.

### Decision

Exclude `micro_story` from the searchable fields. It is display-only (shown on card flip).

### Rationale

- **Stories are narrative, not indexable** — they contain filler words, names, and phrases that would generate false positives
- **Search should match structured tags** — subjects, cues, moods, and colors are curated for search relevance
- **Clean separation** — tags power search; stories power delight

### Trade-offs Accepted

- ❌ A query matching a story keyword won't surface that photo
- ✅ Cleaner, more precise search results

---

## D-012 — Deploy on Vercel {#d-012}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

Need a hosting platform for the static React/Vite app. Must be free, fast, and easy to set up.

### Decision

Deploy on Vercel (free tier). Netlify as backup.

### Rationale

- **Zero config** — auto-detects Vite; no `vercel.json` needed
- **Free tier** — 100GB bandwidth, 100 deploys/day; sufficient for demo
- **Git-push deploys** — push to `main` → live in ~30 seconds
- **Global CDN** — fast load times worldwide
- **Preview deploys** — each PR gets its own URL for review

### Alternatives Considered

| Alternative | Why Not Primary |
|-------------|----------------|
| Netlify | Equally good; kept as backup — drop-in replacement |
| GitHub Pages | No SPA routing support without workarounds; slower builds |
| Cloudflare Pages | Good, but less polished DX for Vite projects |
| Firebase Hosting | Requires Firebase CLI setup; more configuration |

### Trade-offs Accepted

- ❌ Vendor lock-in (minimal — can switch to Netlify trivially)
- ✅ Fastest path from code to live URL

---

## D-013 — 4 Indian Cities for Photo Dataset {#d-013}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

Need to select cities that represent diverse travel experiences for Priya's persona (28, Bangalore, travels 2-3x/year to Indian destinations).

### Decision

Udaipur, Manali, Hampi, Goa — covering 4 distinct sensory environments.

### Rationale

| City | Sensory Palette | Why Chosen |
|------|----------------|-----------|
| **Udaipur** | Serene, golden, royal, marble, water | Lake + palace — rich visual contrast |
| **Manali** | Cold, crisp, snowy, pine, adventure | Mountains — completely different from others |
| **Hampi** | Ancient, rugged, boulder, warm, heritage | Ruins + rocks — unique texture |
| **Goa** | Beachy, tropical, vibrant, salty, sunset | Coast — familiar travel destination |

These cities maximize **tag differentiation** — searches for `"snow"` should only surface Manali; `"boulders"` should only surface Hampi.

### Trade-offs Accepted

- ❌ Only 4 cities; Priya's real library would have more variety
- ❌ No international destinations
- ✅ Strong sensory diversity within a tight scope

---

## D-014 — Card Flip for Tag Reveal {#d-014}

**Date:** 2026-10-03 | **Status:** ✅ Accepted

### Context

Need a way to show AI-generated story and tags without leaving the grid view.

### Decision

Click/tap a photo card to flip it with a 3D CSS animation, revealing the story and tags on the back.

### Rationale

- **Inline interaction** — no page navigation, no modal overlay
- **Delightful** — 3D flip animation feels premium and tactile
- **Progressive disclosure** — user sees photos first; tags on demand
- **Familiar pattern** — flashcard apps, product card flips

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Lightbox/modal overlay | Obscures the grid; feels heavy; extra dismiss logic |
| Slide-out side panel | Needs more horizontal space; doesn't work in phone frame |
| Hover tooltip | Doesn't work on mobile (no hover); too small for story + tags |
| Bottom sheet (drawer) | Good option but more complex; considered for future |

### Trade-offs Accepted

- ❌ Back face has limited space for many tags
- ❌ Not immediately discoverable (hence the onboarding toast)
- ✅ Elegant, inline, zero-navigation interaction

---

## Decision Template (for Future Additions)

```markdown
## D-XXX — [Title] {#d-xxx}

**Date:** YYYY-MM-DD | **Status:** 🟡 Proposed / ✅ Accepted / ❌ Rejected / 🔄 Superseded

### Context
What is the situation? What problem needs solving?

### Decision
What was decided?

### Rationale
Why this option? Key reasons.

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|-------------|
| ... | ... |

### Trade-offs Accepted
- ❌ What we give up
- ✅ What we gain
```

---

## References

- [context.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos_MVP/docs/context.md) — Solution rationale, tech stack, scope decisions
- [architecture.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos_MVP/docs/architecture.md) — Technical architecture decisions, deployment
- [NL_GooglePhotos.pdf](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos_MVP/docs/NL_GooglePhotos.pdf) — Original problem statement and solution evaluation
- [MetadataExtraction.txt](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos_MVP/docs/MetadataExtraction.txt) — Two-part extraction approach
