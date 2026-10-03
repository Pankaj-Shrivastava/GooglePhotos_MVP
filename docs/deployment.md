# 🚀 Deployment Guide: Google Photos Memory Search MVP

This guide will walk you through deploying the MVP to **Vercel**, making it live and accessible via a public URL for your demo.

Because the architecture of this app is 100% static (React + Vite, with pre-computed `tags.json`), deploying it is extremely fast and straightforward.

---

## 1. Prepare Your Repository

Before deploying, ensure all your code and photos are committed to your GitHub repository.

### Check Photo Assets
Vercel needs access to the photos to serve them. Since we optimized the images during the Python download script (they are JPEGs resized to max 1200px), your `public/photos/` folder should be around **10-15 MB** in total. This is well within GitHub's limits, so you can safely commit them directly.

Run these commands in your terminal to commit everything:
```bash
git add .
git commit -m "feat: complete MVP implementation ready for deployment"
git push origin main
```

---

## 2. Deploy to Vercel

Vercel provides native, zero-configuration support for Vite applications. 

1. Go to **[vercel.com](https://vercel.com/)** and log in (or sign up using your GitHub account).
2. Click the **"Add New..."** button in the top right, and select **"Project"**.
3. Under the **"Import Git Repository"** section, find your repository (`GooglePhotos_MVP` or whatever you named it) and click **"Import"**.
4. In the "Configure Project" screen:
   - **Project Name:** Leave as default or customize it (e.g., `priyas-memory-search`).
   - **Framework Preset:** Vercel should automatically detect **Vite**. Leave it as is.
   - **Build Command:** Should automatically be `npm run build`.
   - **Output Directory:** Should automatically be `dist`.
   - **Environment Variables:** You do **NOT** need to add any environment variables here. The Groq and Unsplash APIs were only used locally by the Python scripts to generate the data. The React app runs entirely on the static `tags.json`.
5. Click **"Deploy"**.

---

## 3. Post-Deployment Verification

Vercel will take about 30–60 seconds to build the app. Once you see the confetti screen, click **"Continue to Dashboard"** or **"Visit"**.

### Walkthrough Checklist on Production:
Go to your live `https://<your-project>.vercel.app` URL on both your laptop and your physical phone to verify:

- [ ] **First Load:** Does the onboarding toast appear smoothly from the bottom?
- [ ] **Responsive Design:** On a laptop, do you see the glowing gradient background and the phone bezel? On your physical phone, does it span edge-to-edge natively?
- [ ] **Search Engine:** Type `golden sunset beach`. Does it filter instantly? 
- [ ] **Card Flip:** Tap a photo. Does it perform the 3D flip smoothly without stuttering? Does tapping it again flip it back?
- [ ] **Empty State:** Type `xyz`. Do you see the "No memories matched" graphic and suggestion pill?

---

## 4. Continuous Integration

You are now fully set up with CI/CD. From this point forward, anytime you make changes to the code or add new photos to the dataset, simply commit and push them to the `main` branch on GitHub:

```bash
git add .
git commit -m "Updated some photo tags"
git push origin main
```

Vercel will automatically detect the push, rebuild the app, and update your live URL within a minute!
