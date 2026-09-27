# HAIR OS — Google Play Store Listing & Compliance Guide

## 1. Store Metadata

### App Title (Max 30 characters)
`HAIR OS: Care & Photo Journal` (29 characters)

### Short Description (Max 80 characters)
`Follow a gentle hair & scalp routine and track private progress photos offline.` (79 characters)

---

## 2. Full Description (Google Play Compliant)

**HAIR OS is a 100% server-free, private daily companion designed to help you follow a gentle hair and scalp care routine and honestly track your visual progress over time.**

Most hair apps make grand medical claims, assign clinical stages, or push expensive subscriptions. HAIR OS makes one simple, honest promise: giving you structured, guilt-free habit tracking and a private visual photo journal that stays entirely on your phone.

### 🌿 What HAIR OS Does:
- **Tailored Starter Routine**: Begin with an optional 1-minute setup focused on your hair goals (gentle maintenance, shedding care, dryness & hydration, or length retention), hair texture, and preferred routine times. Or skip setup with a single tap.
- **Practical & Flexible Habits**: Easily check off, add, edit, or remove care habits (like scalp massage, gentle tip-to-root detangling, barrier cleansing, and silk sleep protection). Customize scheduled times to fit your daily life.
- **Private Progress Photo Journal**: Capture baseline and follow-up scalp/hair photos with repeatable pre-capture guidance (lighting, angle, distance). Review each shot with Retake, Save, and Discard controls.
- **Side-by-Side Photo Comparison**: Compare any two photos side-by-side to observe real trends over months under consistent angles.
- **Daily Scalp Comfort Log**: Check in with scalp sensations (comfort, dryness, oiliness, itching) and flake levels to spot correlations with weather or routine adjustments.
- **Offline Educational Guide**: Read evidence-informed care references with credible sources (American Academy of Dermatology, NHS, Cosmetic Ingredient Review) and review dates.
- **100% Server-Free Privacy**: No accounts, no cloud database, no third-party tracking, and no analytics. Your data and photos never leave your device. Automatic Android cloud backup is disabled (`allowBackup=false`) so your private photos are never uploaded to cloud drives.
- **Full Data Ownership**: Export your complete routine and journal to a readable JSON file on your device anytime, or wipe all data with a single tap.

---

## 3. Google Play Health-App Policy Compliance

In accordance with Google Play's **Health Apps Policy**:

### Health App Classification
- **Category**: Non-medical Health & Wellness / Habit Tracking & Lifestyle.
- **Intended Use**: General wellness habit tracking, personal routine scheduling, and private visual journaling.

### Required Disclosures & Limitations:
1. **Not a Medical Device or Clinical Diagnostic Tool**: HAIR OS does NOT diagnose, treat, cure, or prevent any dermatological, follicular, or medical condition.
2. **No Regrowth Promises or Algorithmic Staging**: HAIR OS does NOT promise hair regrowth or assign medical alopecia stages (such as the Norwood or Ludwig scales).
3. **Professional Healthcare Threshold**: Users experiencing sudden, patchy, unexplained hair shedding, persistent scalp pain, burning, pustules, or severe inflammation are explicitly instructed to consult a board-certified dermatologist.

---

## 4. Google Play Data Safety Declaration

| Section | Declaration | Details |
|---|---|---|
| **Data Collection** | **No data collected** | HAIR OS does not collect any user data. |
| **Data Sharing** | **No data shared** | HAIR OS does not share any user data with third parties or cloud servers. |
| **Network Security** | **100% Server-Free** | App operates completely offline; zero outgoing telemetry or API requests. |
| **Device Storage** | **App-Private Storage** | All records and photos reside in IndexedDB / local storage on the user's phone. |
| **Cloud Backup** | **Disabled** | `android:allowBackup="false"` ensures data is never synced to Google Drive. |
| **Data Deletion** | **User-Initiated Deletion** | "Clear All Local Data" button in Settings immediately wipes all local storage. |
| **Exported Files Notice** | **Persistent Storage** | Exported JSON backups saved to device storage remain on phone upon uninstall unless manually deleted by user. |

---

## 5. Screenshot Text & Graphic Captions

1. **Screenshot 1 — Home & Dashboard**:
   - Caption: *"HAIR OS — Hair Care Routine & Journal"*
   - Subtitle: *"A server-free daily companion for consistent care & progress tracking"*
2. **Screenshot 2 — Care Routine**:
   - Caption: *"Gentle, Flexible Care Habits"*
   - Subtitle: *"Customize habits, set on-device reminders, and adapt times to your life"*
3. **Screenshot 3 — Photo Journal**:
   - Caption: *"Standardized Progress Photos"*
   - Subtitle: *"Repeatable angle & lighting guidance with side-by-side comparison"*
4. **Screenshot 4 — Educational Guide**:
   - Caption: *"Evidence-Informed Care Education"*
   - Subtitle: *"Credible clinical sources and review dates with zero false promises"*
5. **Screenshot 5 — Device Privacy Center**:
   - Caption: *"100% Server-Free & On-Device"*
   - Subtitle: *"No accounts, no cloud sync, and full JSON data portability"*

---

## 6. Technical Specifications (Version 2.1.0, Build 3)

- **Package ID**: `com.hairos.app`
- **Version Code**: `3`
- **Version Name**: `2.1.0`
- **Target SDK**: `36` (Android 16) | **Min SDK**: `24` (Android 7.0 Nougat)
- **App Bundle Artifact**: `HairOS-release.aab` (Release-ready, unaligned/aligned verified, not published)
- **APK Artifact**: `HairOS-upgraded-release.apk` (Signed, v2/v3 verified)
- **Android Cloud Backup**: `android:allowBackup="false"` (Protected)
