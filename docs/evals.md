# 📊 Evals — Google Photos Memory Search MVP

> Defining how we measure whether the MVP successfully demonstrates that AI-generated sensory tags bridge the cognitive mismatch in photo search.

---

## 1. Evaluation Framework

### What Are We Evaluating?

This MVP tests a single core hypothesis:

> **Hypothesis:** If we enrich photos with AI-generated visual and sensory tags (subjects, moods, textures, colors), users can successfully retrieve photos using natural language descriptions of what they *remember* — without needing exact dates, locations, or keywords.

We evaluate across **three dimensions:**

| Dimension | Question It Answers |
|-----------|---------------------|
| **Tag Quality** | Are the AI-generated tags specific, accurate, and differentiated enough? |
| **Search Effectiveness** | Can users find the right photos with sensory/visual queries? |
| **User Experience** | Does the app feel fast, intuitive, and delightful? |

---

## 2. Tag Quality Evaluation

### 2.1 Tag Accuracy Audit

**Method:** Manual review of a random sample of 20 photos (25% of dataset).

| Metric | How to Measure | Target |
|--------|---------------|--------|
| **Subject accuracy** | Do `primary_subjects` correctly identify the main objects in the photo? | ≥ 90% of subjects are correct |
| **Sensory relevance** | Do `sensory_cues` describe plausible textures, temperatures, or feelings evoked by the photo? | ≥ 80% of cues are relevant |
| **Mood accuracy** | Does `mood_and_tone` match the emotional atmosphere a human would perceive? | ≥ 80% alignment |
| **Color accuracy** | Do `dominant_colors` match the actual prominent colors in the photo? | ≥ 90% match |
| **Alt-text quality** | Is `alt_text` a faithful one-line description of the scene? | ≥ 90% accurate |
| **Story coherence** | Does `micro_story` feel natural, personal, and relevant to the photo? | ≥ 75% rated as "good" or better |

### 2.2 Tag Specificity Score

**Problem:** Generic tags (e.g., `"beautiful"`, `"nice"`, `"travel"`) dilute search quality.

**Method:** For each photo, count the number of tags that are **unique to ≤ 3 photos** in the dataset vs. tags that appear in **>10 photos**.

| Metric | How to Measure | Target |
|--------|---------------|--------|
| **Specificity ratio** | (Unique tags per photo) / (Total tags per photo) | ≥ 60% of tags are unique to ≤3 photos |
| **Generic tag count** | Tags appearing in >50% of all photos | ≤ 2 generic tags per photo |

**Evaluation script concept:**
```python
from collections import Counter

# Count tag frequency across all photos
all_tags = []
for photo in tags_data['photos']:
    for field in ['primary_subjects', 'descriptive_tags', 'sensory_cues', 'mood_and_tone']:
        all_tags.extend(photo[field])

tag_freq = Counter(all_tags)
total_photos = len(tags_data['photos'])

# Flag tags appearing in >50% of photos
generic_tags = [tag for tag, count in tag_freq.items() if count > total_photos * 0.5]
print(f"Generic tags (>50% frequency): {generic_tags}")
```

### 2.3 Tag Differentiation Across Cities

**Goal:** Tags should vary meaningfully between cities — Udaipur tags should feel distinct from Manali tags.

| Metric | How to Measure | Target |
|--------|---------------|--------|
| **City-unique tags** | Tags that appear only in photos from one city | ≥ 15 unique tags per city |
| **Cross-city overlap** | Tags shared across all 4 cities | ≤ 5 shared tags |

---

## 3. Search Effectiveness Evaluation

### 3.1 Benchmark Query Test Suite

A predefined set of queries that should return specific, expected results.

| # | Query | Expected Top Result(s) | Pass Criteria |
|---|-------|----------------------|---------------|
| 1 | `calm lake palace` | Udaipur lake/palace photos | ≥ 1 relevant photo in top 3 |
| 2 | `snow mountains road` | Manali mountain photos | ≥ 1 relevant photo in top 3 |
| 3 | `big rocks temple ruins` | Hampi boulder/temple photos | ≥ 1 relevant photo in top 3 |
| 4 | `golden sunset beach` | Goa sunset/beach photos | ≥ 1 relevant photo in top 3 |
| 5 | `boarding pass flight` | Travel utility photos | ≥ 1 relevant photo in top 3 |
| 6 | `serene peaceful warm` | Udaipur or Goa sunset photos | ≥ 1 relevant photo in top 5 |
| 7 | `cold crisp adventure` | Manali mountain/snow photos | ≥ 1 relevant photo in top 5 |
| 8 | `ancient stone heritage` | Hampi temple/ruins photos | ≥ 1 relevant photo in top 5 |
| 9 | `food spicy colorful` | Food photos from any city | ≥ 1 relevant photo in top 5 |
| 10 | `xyznonexistent` | Empty state shown | Friendly empty state renders correctly |

### 3.2 Search Quality Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| **Precision@3** | Of the top 3 results, how many are relevant? | ≥ 66% (2 of 3 are relevant) |
| **Precision@5** | Of the top 5 results, how many are relevant? | ≥ 60% (3 of 5 are relevant) |
| **Recall** | Of all relevant photos for a query, how many appear in results? | ≥ 70% |
| **Zero-result rate** | % of reasonable queries that return 0 results | ≤ 10% (for natural queries) |
| **False positive rate** | % of results that are clearly irrelevant to the query | ≤ 20% |

### 3.3 Cross-City Precision

Search should surface photos from the **correct city** when the query has city-specific sensory cues.

| Query Type | Example | Expected |
|-----------|---------|----------|
| Udaipur-specific | `"marble palace lake reflection"` | >70% results are Udaipur photos |
| Manali-specific | `"snow pine cold mountain"` | >70% results are Manali photos |
| Hampi-specific | `"boulder ruins ancient river"` | >70% results are Hampi photos |
| Goa-specific | `"beach sand waves shack"` | >70% results are Goa photos |
| Cross-city | `"sunset golden"` | Mix of cities (acceptable) |

---

## 4. User Experience Evaluation

### 4.1 Performance Metrics

| Metric | How to Measure | Target |
|--------|---------------|--------|
| **Time to First Paint** | Lighthouse or browser DevTools | ≤ 1.5s on fast 3G |
| **Time to Interactive** | All photos in viewport loaded + search functional | ≤ 3s on fast 3G |
| **Search response time** | Time from keystroke to grid update | ≤ 100ms (client-side) |
| **Card flip animation** | Frame rate during flip | 60fps (no jank) |
| **Total page weight** | All assets (HTML, CSS, JS, photos) | ≤ 25MB |

### 4.2 Interaction Completeness

| Interaction | What to Verify |
|-------------|----------------|
| **Search → Results** | Grid updates in real-time as user types |
| **Search → Empty State** | Friendly message appears with suggestion pill |
| **Click suggestion pill** | Auto-fills search bar and triggers search |
| **Clear search** | Full grid restores immediately |
| **Card flip** | Smooth 3D animation, back face shows story + tags |
| **Card flip back** | Second tap returns to photo front |
| **Onboarding toast** | Shows on first visit; dismisses on ✕ or first flip |
| **Toast persistence** | Does not reappear after dismissal (localStorage) |
| **Lazy loading** | Images load as user scrolls; no blank gaps |
| **Device frame (desktop)** | Phone bezel visible, content scrolls inside |
| **Mobile view** | Frame hidden; app fills viewport edge-to-edge |

### 4.3 Visual Quality Checklist

| Element | Check |
|---------|-------|
| Dark mode consistency | No white flashes, no mismatched backgrounds |
| Glassmorphism | Frosted blur visible on search bar, toast, tag overlay |
| Typography | Inter font loaded; heading/body/muted hierarchy clear |
| Tag pills | Color-coded correctly by category |
| Photo grid | Even spacing, no layout shifts on load |
| Phone frame | Notch visible, bezel looks realistic, shadow present |
| Animations | fade-in, slide-up, scale-up are smooth |

---

## 5. Evaluation Process

### When to Run Evals

| Phase | What to Evaluate | Timing |
|-------|-----------------|--------|
| **After M2 (Data Pipeline)** | Tag quality (§2) | Before building UI |
| **After M4 (Search + States)** | Search effectiveness (§3) | Before polish |
| **After M5 (Polish & Demo)** | UX + performance (§4) + full re-run of §2-§3 | Before demo/deployment |

### Eval Execution Checklist

- [ ] Run tag accuracy audit on 20 random photos (§2.1)
- [ ] Run tag specificity script (§2.2)
- [ ] Check city differentiation (§2.3)
- [ ] Execute all 10 benchmark queries (§3.1)
- [ ] Calculate Precision@3 and Precision@5 (§3.2)
- [ ] Test cross-city precision (§3.3)
- [ ] Run Lighthouse audit (§4.1)
- [ ] Walk through all 11 interactions (§4.2)
- [ ] Complete visual quality checklist (§4.3)

---

## 6. Known Limitations (Accepted for MVP)

| Limitation | Impact | Why Accepted |
|-----------|--------|--------------|
| No synonym matching | `"ocean"` won't find `"sea"` photos | Scope control; can add post-MVP |
| No fuzzy/typo tolerance | `"mountan"` won't match `"mountain"` | Client-side fuzzy search adds complexity |
| No semantic understanding | Can't interpret `"where I had dinner"` | Would require NLP model at runtime |
| Scoring is keyword-count based | No TF-IDF or BM25 ranking | Sufficient for 80-100 photos |
| `micro_story` excluded from search | Stories may contain relevant keywords | By design — stories are for reading, not indexing |

---

## References

- [context.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos_MVP/docs/context.md) — Tag schema, search strategy, example queries
- [architecture.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos_MVP/docs/architecture.md) — Search scoring algorithm, performance targets
- [implementation-plan.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos_MVP/docs/implementation-plan.md) — Task 4.6 search test scenarios
- [edge-cases.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos_MVP/docs/edge-cases.md) — Edge case handling that affects eval outcomes
