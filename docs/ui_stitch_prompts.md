# Google Stitch Prompt — Memory Search MVP UI Mockups

Use the following 3 prompts one at a time in Google Stitch. Each generates one screen state of the app. Together they form the complete user flow.

---

## Prompt 1: Home State (All Photos, No Search)

```
Design a high-fidelity mobile app UI mockup displayed INSIDE a realistic phone frame, which itself sits centered inside a dark browser window.

BROWSER WINDOW:
- A standard Chrome-style browser window with a dark grey title bar, three colored dots (close/minimize/maximize) on the top-left, and a URL bar showing "memorysearch.vercel.app".
- The browser background behind the phone frame is a rich, dark gradient going from deep navy (#0f172a) through muted indigo (#1e1b4b) back to navy (#0f172a), at a 135-degree angle.
- The phone frame is perfectly centered vertically and horizontally inside this browser window.

PHONE FRAME:
- A realistic smartphone bezel (like an iPhone 15 or Pixel 8) in matte black, with generously rounded corners (~2.5rem radius), a subtle drop shadow behind it, and a small centered notch/dynamic island at the top.
- Screen dimensions approximately 375×812px aspect ratio.
- The screen background inside the phone is a very dark slate (#0f172a).

APP CONTENT INSIDE THE PHONE SCREEN:

1. STATUS BAR (top):
   - A minimal dark status bar showing "9:41", Wi-Fi icon, battery icon — standard mobile style.

2. APP HEADER:
   - Below the status bar, a small app title: "Priya's Memories" in a thin, elegant sans-serif font (Inter or similar), in soft white (#e2e8f0), centered.

3. SEARCH BAR:
   - Directly below the header.
   - A wide, pill-shaped (fully rounded) search input field.
   - Glassmorphism style: semi-transparent white background (rgba(255,255,255,0.08)), a subtle 1px border of rgba(255,255,255,0.15), and a soft backdrop-blur effect.
   - Inside the search bar: a small magnifying glass icon on the left (muted grey), and placeholder text: "Search memories… try 'golden sunset lake'" in muted grey (#94a3b8).
   - The search bar should feel premium, glassy, and slightly glowing.

4. CITY SECTION LABEL:
   - Below the search bar, a small section divider label reading "Goa" in uppercase, muted grey (#64748b), with a thin horizontal line extending to the right.

5. PHOTO GRID:
   - Below the city label, a 2-column masonry-style grid of travel photos.
   - Show 6 visible photo cards (3 rows × 2 columns).
   - Each card has slightly rounded corners (~0.75rem), a very subtle dark border, and shows a vivid, colorful travel photograph — think tropical beaches, palm trees, sunsets, colonial churches, beach shacks.
   - The photos should look like real Goa travel photography: vibrant blues, greens, golden sands, warm sunsets.
   - Cards have a very subtle fade-in stagger animation implied by slight opacity differences (top cards fully opaque, bottom cards at 95%).
   - A thin gap (~8px) between cards.

6. ONBOARDING TOAST (bottom):
   - A small floating toast/banner pinned to the bottom of the phone screen.
   - Glassmorphism style matching the search bar.
   - Text reads: "💡 Tap any photo to see its story" in small white text.
   - A small "✕" dismiss button on the right side.

OVERALL AESTHETIC:
- Dark mode, premium, Apple-level polish.
- The color palette is navy/indigo/slate with vibrant photo colors providing contrast.
- Typography is Inter or a similar clean sans-serif.
- The entire composition should feel like a portfolio-quality product demo screenshot.
```

---

## Prompt 2: Search Results State (Filtered Grid)

```
Design a high-fidelity mobile app UI mockup displayed INSIDE a realistic phone frame, which itself sits centered inside a dark browser window. This is the SEARCH RESULTS state.

BROWSER WINDOW:
- Same Chrome-style browser as before: dark grey title bar, three colored dots, URL bar showing "memorysearch.vercel.app".
- Dark gradient background behind the phone: deep navy (#0f172a) → muted indigo (#1e1b4b) → navy, 135-degree angle.
- Phone frame centered in the browser.

PHONE FRAME:
- Same matte black smartphone bezel, iPhone/Pixel proportions (~375×812px), rounded corners, drop shadow, small notch.

APP CONTENT:

1. STATUS BAR: Standard "9:41", Wi-Fi, battery.

2. APP HEADER: "Priya's Memories" in thin elegant white text, centered.

3. SEARCH BAR (ACTIVE STATE):
   - Same glassmorphism pill-shaped search bar, but now it contains typed text: "golden sunset" in white text.
   - The magnifying glass icon on the left is now slightly brighter/highlighted.
   - A small circular "✕" clear button appears on the right end of the search bar.
   - The search bar has a very subtle glowing border (a faint blue-purple tint, like rgba(139, 92, 246, 0.3)) to indicate it's active.

4. RESULTS COUNT:
   - A tiny line of text below the search bar: "4 memories found" in muted grey (#94a3b8).

5. PHOTO GRID (FILTERED):
   - Only 4 photos are shown now (2 rows × 2 columns), all sunset-themed.
   - The photos should show: a golden beach sunset with silhouettes, a sunset viewed from a beach shack, a dramatic ocean sunset with rocks, and a warm twilight skyline.
   - Same rounded card styling as before.
   - The grid has a subtle slide-up entrance animation feel (cards appear to have risen into place).

6. EMPTY SPACE:
   - Below the 4 results, the remaining phone screen is dark and empty, emphasizing that only matching results are shown.

OVERALL AESTHETIC:
- Same premium dark mode polish.
- The key difference from Prompt 1 is the active search state and the reduced, filtered grid.
- The composition should clearly communicate "intelligent search working" — the user typed something natural and got precise visual results.
```

---

## Prompt 3: Card Flip State (Tag Overlay / Story Reveal)

```
Design a high-fidelity mobile app UI mockup displayed INSIDE a realistic phone frame, which itself sits centered inside a dark browser window. This shows the CARD FLIP state where one photo has been tapped to reveal its AI-generated story and tags.

BROWSER WINDOW:
- Same Chrome-style browser: dark title bar, three dots, URL bar "memorysearch.vercel.app".
- Same dark gradient background.

PHONE FRAME:
- Same matte black bezel, same proportions.

APP CONTENT:

1. STATUS BAR and HEADER: Same as before.

2. SEARCH BAR: Shows "golden sunset" as typed text, same active state styling.

3. PHOTO GRID:
   - 4 cards visible (2×2).
   - The TOP-LEFT card is MID-FLIP or FULLY FLIPPED, showing the BACK FACE instead of the photo.
   - The other 3 cards show their normal photo front faces.

4. THE FLIPPED CARD (back face detail — this is the hero element):
   - The card is the same size as a normal photo card.
   - Background: dark semi-transparent overlay (#0f172a at 90% opacity) with a strong backdrop-blur (glassmorphism).
   - At the top of the card, a small city label: "Goa" in muted uppercase grey text.
   
   - MICRO STORY SECTION:
     - Below the city label, in italic white text (~13px), the AI-generated micro-story:
       "I sat alone at the worn wooden table, a cold drink in hand, watching the sun melt into the ocean through the fringe of the thatched roof."
     - This text should feel literary, evocative, and intimate.
   
   - DIVIDER: A thin horizontal line in rgba(255,255,255,0.1).
   
   - TAG PILLS SECTION:
     - Below the divider, several rows of small rounded pill/chip tags.
     - Each pill has a semi-transparent colored background and matching text color:
       • Blue pills (subjects): "sunset", "ocean", "beach shack"
       • Amber pills (sensory): "warm fading heat", "cold glass bottle"
       • Purple pills (mood): "peaceful", "nostalgic"
       • Emerald pills (colors): "golden sepia", "silhouetted black"
       • Grey pills (descriptive): "golden hour coastal view"
     - Pills are small (~11px text), rounded-full, with ~4px horizontal padding, and wrap naturally across multiple lines.
     - There should be about 12-15 total tag pills visible.

5. The 3D FLIP EFFECT:
   - If possible, show a subtle visual hint that the card has physically flipped — perhaps a very slight perspective shadow on the left edge, or the card appears to be tilted ~5° as if caught mid-rotation around its Y-axis.

OVERALL AESTHETIC:
- This is the most visually complex and impressive screen.
- The flipped card should be the clear focal point — it demonstrates the core value proposition: "tap a photo to discover the hidden story and sensory tags that AI extracted."
- Premium, dark, glassy, with the colorful tag pills providing pops of jewel-toned color against the dark overlay.
- The composition should make a viewer immediately understand: "This is not just a photo gallery — every photo has a rich, searchable story behind it."
```

---

## Usage Tips

1. **Generate one prompt at a time** — paste each prompt separately into Google Stitch.
2. **Aspect ratio**: Use **9:16** or **3:4** for the best phone-in-browser composition.
3. **Iterate**: If the first generation isn't perfect, append feedback like _"Make the search bar more glassy"_ or _"Make the tag pills smaller and more colorful"_.
4. **Share the results with me** and I'll match the UI code exactly to the generated mockups!
