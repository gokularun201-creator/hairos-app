# HAIR OS — Server-Free Care Routine & Photo Journal

HAIR OS is a 100% server-free, private companion app designed to help you follow a healthy hair and scalp routine and track your visual progress over time.

---

## 🌟 The Core Promise

Most hair applications make exaggerated claims, promise hair regrowth, or present speculative AI diagnostic scores. 

**HAIR OS makes one honest promise**: giving you structured, guilt-free habit tracking and a private visual photo journal that stays entirely on your device.

- 🔒 **Zero Server / 100% Private**: No account registration, no remote server, no cloud database, no tracking analytics, and no paid third-party AI APIs.
- 🧴 **Daily Care Habits**: Build consistent, gentle routines (morning detangling, gentle shampooing, conditioning hair ends, scalp massage).
- 📸 **Private Photo Journal**: Baseline and follow-up photo tracking with side-by-side comparison, zone tagging, and consistent lighting reminders.
- 🧘 **Scalp Comfort Log**: Daily check-ins for scalp sensations (itching, tightness, tenderness, flake level).
- 📚 **Offline Care Guide**: Curated, evidence-informed educational references with prominent medical safety guidance.
- 💾 **Data Ownership**: Full JSON backup export and import, plus single-tap complete data erase.

---

## ⚠️ Medical Disclaimer
HAIR OS is an educational habit tracker and photo journal. It is NOT a medical device, does NOT diagnose hair loss, does NOT assign clinical Norwood stages, and does NOT promise or guarantee hair regrowth. For persistent, sudden, or painful scalp conditions, always consult a licensed dermatologist.

---

## 🛠 Tech Stack & Architecture
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS (Dark theme `#020617`, teal accents)
- **Local Storage**: IndexedDB (`HairOS_DB_v2`) with automatic migration from legacy `localStorage`
- **Native Runtime**: Capacitor (Camera `@capacitor/camera`, Local Notifications `@capacitor/local-notifications`)
- **Bundle**: esbuild targeting `es2020` & `chrome100`

---

## 🚀 Building & Packaging

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Build the bundle:
   ```bash
   node build.js
   ```

3. Repackage and sign APK:
   ```bash
   python package_apk.py
   ```

4. Install on connected Android test device via ADB:
   ```bash
   python auto_install.py
   ```

---

## 📄 License & Attribution
Developed with privacy-first principles. Built for Android devices.
