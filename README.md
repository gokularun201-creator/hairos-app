# HAIR OS Pro — Server-Free Care Routine, AI Hair Lab & Photo Journal Website

HAIR OS Pro is a 100% server-free, private companion app and web application designed to help you decode product ingredients, neutralize hard water damage, follow a gentle care routine, and honestly track your visual hair progress over time.

---

## 🌟 The Core Promise

Most hair applications make exaggerated claims, promise hair regrowth, or present speculative AI diagnostic scores. 

**HAIR OS Pro makes one honest promise**: giving you structured, guilt-free habit tracking, evidence-informed trichology tools, and a private visual photo journal that stays entirely in your browser / on your device.

- 🔒 **Zero Server / 100% Private**: No account registration, no remote server, no cloud database, no tracking analytics, and no third-party data harvesting.
- 📅 **Dynamic 30-Day Regimen**: Unlocks day-by-day customized hair and scalp habits based on your follicle profile.
- 📸 **3-Angle AI Diagnostic Scan**: Non-invasive hair type, texture, scalp oiliness, and porosity assessment running 100% client-side.
- 🧪 **Product Checker & Ingredient Decoder**: Scan or paste ingredient lists to identify harsh sulfates (SLS/ALS), drying alcohols, and comedogenic pore-cloggers with a 0–100 Clean Score.
- 💧 **Hard Water & pH Shield**: Calibrated Apple Cider Vinegar (ACV) and citric acid dilution recipes for hard borewell and tanker water.
- 📸 **Private Photo Journal**: Baseline and follow-up photo tracking with side-by-side comparison, zone tagging, and wipe slider.
- 🧘 **Scalp Comfort Log**: Daily check-ins for scalp sensations (itching, tightness, tenderness, flake level).
- 💾 **Data Ownership**: Full JSON backup export and import, plus single-tap complete data erase.

---

## 🌐 Running the Website Locally

You can launch the web application on any computer or mobile browser with zero setup:

```bash
# 1. Install dependencies
pnpm install

# 2. Build the production website
pnpm run build

# 3. Start the local web server
pnpm start
```

Open your browser to:
👉 **`http://localhost:5173`**

---

## ☁️ Instant Web Deployment

### Option A: GitHub Pages (Automatic)
This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`). Simply enable GitHub Pages in your repository settings:
1. Go to **Settings > Pages** on your GitHub repository.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Every commit to `main` will automatically build and publish your website!

### Option B: Vercel (1-Click)
Deploy directly using the included `vercel.json`:
```bash
npx vercel --prod
```

### Option C: Netlify
Deploy using the included `netlify.toml`:
```bash
npx netlify deploy --prod --dir=dist
```

---

## ⚠️ Medical Disclaimer

HAIR OS Pro is an educational habit tracker and photo journal. It is NOT a medical device, does NOT diagnose hair loss, does NOT assign clinical Norwood stages, and does NOT promise or guarantee hair regrowth. For persistent, sudden, or painful scalp conditions, always consult a licensed dermatologist.

---

## 🛠 Tech Stack & Architecture

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS (Dark theme `#020617`, teal accents)
- **Local Storage**: IndexedDB (`HairOS_DB_v2`) with automatic migration from legacy `localStorage`
- **Native / Web Runtime**: Progressive Web App (PWA) + Web Notification API + File Capture fallback
- **Bundle**: esbuild targeting `es2020` & `chrome100`

---

## 📄 License & Attribution

Developed with privacy-first principles. Built by [gokularun201-creator](https://github.com/gokularun201-creator).
