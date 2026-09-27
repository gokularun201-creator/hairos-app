# HAIR OS — Google Play Store Listing & Compliance Guide

## 1. Store Metadata

### App Title (Max 30 characters)
`HAIR OS: Care & Photo Journal`

### Short Description (Max 80 characters)
`Follow a gentle hair & scalp routine and track private progress photos offline.`

---

## 2. Full Description (Google Play Compliant)

**HAIR OS is a 100% server-free, private companion designed to help you follow a healthy hair and scalp routine and honestly track your visual progress over time.**

Most hair apps make grand promises or present speculative algorithms. HAIR OS makes one simple, honest promise: giving you structured, guilt-free habit tracking and a private visual photo journal that stays entirely on your phone.

### 🌿 What HAIR OS Does:
- **Daily Care Routine**: Build and maintain gentle, consistent habits—such as morning detangling, gentle cleansing, conditioning ends, and relaxing scalp massage. Customize habits and schedules to fit your lifestyle.
- **Private Photo Journal**: Capture baseline and follow-up scalp/hair photos under consistent lighting. Compare photos side-by-side to observe long-term trends for yourself.
- **Daily Scalp Comfort Log**: Check in with your scalp sensations (itching, tenderness, comfort) and flake levels to spot correlations with weather, stress, or product changes.
- **Offline Educational Guide**: Curated, evidence-informed references covering hair growth phases, daily shedding facts, safe ingredient practices, and gentle handling techniques.
- **100% Private & Server-Free**: No account creation, no logins, no cloud tracking, and no third-party analytics. Your photos and routines are stored in your device's app-private storage.
- **Full Data Ownership**: Export your complete routine and journal data to a JSON backup whenever you choose, or wipe all data with a single tap.

---

### ⚠️ Medical Disclaimer & Safety Notice
- **Not a Medical Device**: HAIR OS is an educational habit tracker and photo journal. It does NOT diagnose hair loss, determine medical conditions, assign clinical stages (e.g., Norwood scale), or prescribe treatments.
- **No Regrowth Guarantee**: We do not guarantee, promise, or predict hair regrowth. Hair health depends on genetics, nutrition, medical history, and lifestyle.
- **Consult Healthcare Professionals**: For sudden, patchy, unexplained shedding, or painful scalp conditions, always consult a licensed dermatologist or trichologist.

---

## 3. Google Play Data Safety Declaration

In the Google Play Console Data Safety section, complete the declaration as follows:

| Field | Response | Notes |
|---|---|---|
| **Does your app collect or share user data?** | **No** | App is 100% server-free. All state resides on-device in IndexedDB. |
| **Is all user data encrypted in transit?** | **Not Applicable** | No data is ever transmitted across networks. |
| **Do you provide a way for users to request data deletion?** | **Yes** | Built-in "Erase All Data" button in Settings immediately wipes local IndexedDB and localStorage. |
| **Financial / Payment Information** | **None collected** | Zero paywalls, zero in-app purchases, zero payment SDKs. |
| **Personal Identifiers** | **None collected** | Optional nickname stays strictly on-device. No email, phone, or name transmitted. |
| **Photos and Videos** | **None collected** | Stored strictly in local app-private storage; never uploaded. |

---

## 4. Screenshot & Graphic Assets Strategy

To maintain complete compliance with Google Play Developer Program policies:

1. **Screenshot 1 — Today's Routine**:
   - Headline: *"Build a Gentle, Consistent Routine"*
   - Visual: Real screenshot of the Today's Care Routine card with checkmarks and category tags (Morning, Shower, Evening).

2. **Screenshot 2 — Private Photo Journal**:
   - Headline: *"Track Real Progress Over Time"*
   - Visual: Real screenshot of the side-by-side comparison mode showing consistent lighting reminders and zone tags.

3. **Screenshot 3 — Scalp Comfort Check-In**:
   - Headline: *"Tune Into Your Scalp Sensations"*
   - Visual: Real screenshot of the daily scalp comfort and sensation logging interface.

4. **Screenshot 4 — Offline Educational Guide**:
   - Headline: *"Evidence-Informed Care Education"*
   - Visual: Real screenshot of the Curated Care Guide displaying the Medical Safety disclaimer banner and shedding facts.

5. **Screenshot 5 — Server-Free & Private**:
   - Headline: *"100% Private. No Account Required."*
   - Visual: Real screenshot of Profile & Privacy settings highlighting "All data remains 100% on your device" and export controls.

**Prohibited Imagery (Avoid entirely):**
- ❌ Do NOT use simulated microscopic hair follicle grids or fake "FU/cm²" overlays.
- ❌ Do NOT depict exaggerated Before & After clinical regrowth claims.
- ❌ Do NOT display clinical stage badges (Norwood 1–7) or medical diagnostic screens.

---

## 5. Target Audience & Content Rating
- **Category**: Health & Fitness / Lifestyle
- **Content Rating**: Everyone (PEGI 3 / ESRB Everyone)
- **Target Age**: 18+ (General audience)

---

## 6. Release Notes & Package Specifications (Version 2.0.0, Build 2)

- **Release Package**: Android App Bundle (`HairOS-release.aab`) & Aligned APK (`HairOS-upgraded-release.apk`)
- **Version Name**: `2.0.0`
- **Version Code**: `2`
- **Target SDK**: `36` (Android 16) | **Min SDK**: `24` (Android 7.0 Nougat)
- **Package ID**: `com.hairos.app`

### What's New in v2.0.0:
- **100% Server-Free Architecture**: Operates fully on-device using IndexedDB with zero remote tracking, servers, or external database dependencies.
- **Bundled Offline Fonts**: Embedded Plus Jakarta Sans and JetBrains Mono fonts locally for complete offline operation without contacting Google Fonts.
- **Customizable Care Routine**: Build and maintain gentle morning, shower, and evening care habits without guilt or streak pressure.
- **Private Progress Journal**: High-detail photo timeline with side-by-side comparison mode and consistent lighting guides.
- **Scalp Sensation Tracker**: Log daily scalp comfort, itching, and flaking levels.
- **Curated Educational Guide**: Evidence-informed offline hair care and shedding education with medical safety criteria.
- **Full Data Portability**: Instant one-tap JSON backup export/import and complete local data erasure controls.
- **Accessibility Enhancements**: Support for Android system font and display text scaling with unobstructed navigation.
