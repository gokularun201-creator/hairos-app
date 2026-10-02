# HAIR OS PRO — Google Play Store Listing & Compliance Guide

## 1. Store Metadata

### App Title (Max 30 characters)
`HAIR OS Pro: Care & Hair Lab` (29 characters)

### Short Description (Max 80 characters)
`Ingredient decoder, hard water shield, daily scalp routine & private photo log.` (79 characters)

---

## 2. Full Description (Google Play Compliant)

**HAIR OS Pro is a 100% server-free, private hair clinic companion designed to help you decode product ingredients, neutralize hard water damage, follow a gentle care routine, and honestly track your visual progress over time.**

Most hair apps make grand medical claims, assign clinical stages, or push expensive ₹499/month subscriptions. HAIR OS Pro makes one simple, honest promise: **Giving you professional trichology tools, ingredient transparency, and private visual tracking for a one-time fair price of ₹10 — with zero ads and zero data harvesting.**

### 🌿 What HAIR OS Pro Does:

- 🧪 **Hair Lab & Ingredient Decoder**: Scan or paste ingredient lists from any shampoo, conditioner, serum, or oil. Instantly identify harsh sulfates (SLS/ALS), insoluble silicones, drying alcohols, comedogenic pore-cloggers, and protein-moisture balances with an objective 0–100 Clean Score and personalized scalp safety verdicts.
- 💧 **Hard Water & pH Shield**: Living in an area with hard borewell or tanker water? Enter your water source to receive exact Apple Cider Vinegar (ACV) or citric acid dilution recipes (calibrated to the scalp's natural pH 4.5–5.0) to dissolve mineral buildup and prevent strand stiffness.
- 🌿 **Scientific DIY Trichology Formulator**: Calculate safe essential oil dilution ratios (such as 1%–2% Rosemary oil in carrier oils) with exact drop counts to prevent chemical scalp irritation, plus follow a standardized 0.5mm microneedling / derma-roller safety protocol.
- 🔬 **Porosity Diagnostic Lab**: Step-by-step guidance for the water float test to understand your hair's cuticle condition (low, medium, or high porosity) and select the right oils and conditioners.
- 🧴 **Practical & Flexible Habits**: Easily check off, add, edit, or remove care habits (like scalp massage, gentle tip-to-root detangling, barrier cleansing, and hydration reminders).
- 📸 **Private Progress Photo Journal**: Capture baseline and follow-up scalp/hair photos with repeatable pre-capture guidance (lighting, angle, distance) and side-by-side comparisons over months.
- 🧘 **Daily Scalp Comfort Log**: Check in with scalp sensations (comfort, dryness, oiliness, itching) and flake levels to spot correlations with weather or routine adjustments.
- 🔒 **100% Server-Free Privacy**: No accounts, no cloud database, no third-party tracking, and no analytics. Your data and photos never leave your device. Automatic Android cloud backup is disabled (`allowBackup=false`) so your private photos are never uploaded to cloud drives.
- 💾 **Full Data Ownership**: Export your complete routine and journal to a readable JSON file on your device anytime, or wipe all data with a single tap.

---

## 3. Google Play Health-App Policy Compliance

In accordance with Google Play's **Health Apps Policy**:

### Health App Classification
- **Category**: Non-medical Health & Wellness / Habit Tracking & Lifestyle.
- **Intended Use**: General wellness habit tracking, cosmetic ingredient education, and private visual journaling.

### Required Disclosures & Limitations:
1. **Not a Medical Device or Clinical Diagnostic Tool**: HAIR OS Pro does NOT diagnose, treat, cure, or prevent any dermatological, follicular, or medical condition.
2. **No Regrowth Promises or Algorithmic Staging**: HAIR OS Pro does NOT promise hair regrowth or assign medical alopecia stages (such as the Norwood or Ludwig scales).
3. **Professional Healthcare Threshold**: Users experiencing sudden, patchy, unexplained hair shedding, persistent scalp pain, burning, pustules, or severe inflammation are explicitly instructed to consult a board-certified dermatologist.

---

## 4. Google Play Pricing & Monetization Strategy (₹10 INR Model)

| Parameter | Configuration | Details |
|---|---|---|
| **Price Point** | **₹10 INR (Tier 1 Base Paid)** | Impulsive buy pricing lower than a cup of chai in India. |
| **Monetization Type** | **Paid App (Upfront)** | No subscriptions, no in-app purchases, no locked features. |
| **Ad Experience** | **Zero Ads Forever** | Complete ad-free experience builds strong 5-star review velocity. |
| **Server Cost to Developer**| **₹0 (Zero Recurring Costs)** | Runs 100% on-device using local SQLite/IndexedDB and local algorithms. |
| **Play Console Category** | **Health & Fitness / Beauty** | Targets high organic rank in "Top Paid" chart with ~100-200 downloads/day. |

---

## 5. Google Play Data Safety Declaration

| Section | Declaration | Details |
|---|---|---|
| **Data Collection** | **No data collected** | HAIR OS Pro does not collect any user data. |
| **Data Sharing** | **No data shared** | HAIR OS Pro does not share any user data with third parties or cloud servers. |
| **Network Security** | **100% Server-Free** | App operates completely offline; zero outgoing telemetry or API requests. |
| **Device Storage** | **App-Private Storage** | All records and photos reside in IndexedDB / local storage on the user's phone. |
| **Cloud Backup** | **Disabled** | `android:allowBackup="false"` ensures data is never synced to Google Drive. |
| **Data Deletion** | **User-Initiated Deletion** | "Clear All Local Data" button in Settings immediately wipes all local storage. |
| **Exported Files Notice** | **Persistent Storage** | Exported JSON backups saved to device storage remain on phone upon uninstall unless manually deleted by user. |

---

## 6. Screenshot Text & Graphic Captions

1. **Screenshot 1 — Hair Lab & Ingredient Decoder**:
   - Caption: *"Decode Shampoos & Oils Offline"*
   - Subtitle: *"Detect harsh sulfates, insoluble silicones, and drying alcohols instantly"*
2. **Screenshot 2 — Hard Water & ACV Shield**:
   - Caption: *"Neutralize Hard Water Breakage"*
   - Subtitle: *"Calibrated ACV and citric acid rinse recipes for tap and tanker water"*
3. **Screenshot 3 — Home & Daily Care Routine**:
   - Caption: *"Gentle, Guilt-Free Habit Tracking"*
   - Subtitle: *"Hydration goals, food suggestions, and scheduled wash day reminders"*
4. **Screenshot 4 — Private Progress Photos**:
   - Caption: *"Standardized Progress Photos"*
   - Subtitle: *"Repeatable angle & lighting guidance with side-by-side comparison"*
5. **Screenshot 5 — Privacy & Fair Price Guarantee**:
   - Caption: *"PRO Lifetime — Just ₹10"*
   - Subtitle: *"Zero ads, zero subscriptions, 100% on-device privacy"*

---

## 7. Technical Specifications (Version 2.4.0, Build 5)

- **Package ID**: `com.hairos.app`
- **Version Code**: `5`
- **Version Name**: `2.4.0`
- **Target SDK**: `36` (Android 16) | **Min SDK**: `24` (Android 7.0 Nougat)
- **App Bundle Artifact**: `HairOS-release.aab` (Signed with v2/v3, ready for Play Console upload)
- **APK Artifact**: `HairOS-upgraded-release.apk` (Signed, installable on Android devices)
- **Android Cloud Backup**: `android:allowBackup="false"` (Protected)
