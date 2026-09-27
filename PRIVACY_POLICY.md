# Privacy Policy for HAIR OS

*Last Updated: September 28, 2026*

HAIR OS ("we," "our," or "the app") is a server-free mobile application developed to help users track personal hair and scalp care habits and private progress photos. Your privacy is paramount. This Privacy Policy outlines how your data is handled when you use the HAIR OS Android application.

---

## 1. 100% Server-Free Architecture

HAIR OS is architecturally engineered with **no remote backend, no cloud database, no tracking servers, and no third-party analytics services**. 

- **No User Accounts**: We do not require or support account creation, email addresses, phone numbers, or passwords.
- **No Remote Data Transmission**: All information you input into the app—including profile preferences, routine checklists, scalp check-ins, diary notes, and photographs—stays strictly on your device.
- **No Third-Party SDKs**: The app contains no third-party advertising SDKs, cloud telemetry, or user behavior tracking libraries.

---

## 2. Information Handled on Your Device

The app stores the following data locally within your device's app-private storage (IndexedDB and local storage):

1. **Profile Preferences**:
   - Optional name or nickname.
   - Self-identified hair goals (e.g. gentle maintenance, shedding care, dryness, length retention).
   - Hair texture/type and scalp tendency.
   - Preferred routine times.
2. **Routine Habits**:
   - Checklists, habit titles, reminders, and daily completion timestamps.
3. **Photo Journal Entries**:
   - Photographs taken or selected by you to visually monitor your scalp and hair.
   - Capture metadata (selected scalp zone, date, lighting conditions, and personal notes).
4. **Scalp Check-In Logs**:
   - Daily ratings of scalp comfort, dryness, oiliness, tenderness, and flaking.

---

## 3. Device Permissions

HAIR OS requests permissions only when necessary for specific on-device functionality:

- **Camera (`android.permission.CAMERA`)**:
  - *Purpose*: Allows you to capture real-time progress photos for your personal journal.
  - *Data Handling*: Photographs captured via camera are compressed and stored locally in app-private storage. They are never uploaded or transmitted.
- **Photo Library / Storage (`READ_MEDIA_IMAGES` / `READ_EXTERNAL_STORAGE`)**:
  - *Purpose*: Enables you to select existing photos from your gallery for your journal.
  - *Data Handling*: Selected photos remain on your device and are never shared or uploaded.
- **Notifications (`POST_NOTIFICATIONS` / `SCHEDULE_EXACT_ALARM`)**:
  - *Purpose*: Allows you to schedule gentle daily routine reminders at times you choose.
  - *Data Handling*: Reminders are scheduled entirely by Android's local notification manager on your device.

---

## 4. Android Backup & Cloud Sync Protection

To safeguard your personal photographs and wellness records from automatic cloud uploads:
- **`android:allowBackup="false"`**: HAIR OS explicitly disables Android cloud backup. Your private photos and routine records will never be automatically synced to Google Drive or restored unexpectedly on other devices upon reinstalling.

---

## 5. Data Portability & Deletion

- **Exporting Data**: You can export a readable JSON backup of your entire routine and photo journal at any time. When exported, the file is saved directly to your device storage (such as your Downloads folder).
  - *Important Notice*: Files exported to your device storage remain on your phone even if you uninstall the app. You can manage or delete exported files using your device's file manager at any time.
- **Importing Data**: You can import previously exported JSON backups into HAIR OS on your device.
- **Deleting Data**: You may delete individual photos or habits at any time. To permanently wipe all app data, use the "Clear All Local Data" button in Settings or clear app storage via Android Settings.

---

## 6. Health & Medical Policy Disclaimer

- **General Wellness Only**: HAIR OS is an educational habit tracking and personal photo journaling application. It is **not** a medical device.
- **No Diagnosis or Treatment**: The app does not diagnose dermatological or medical conditions, assign clinical alopecia stages (e.g. Norwood or Ludwig classifications), or prescribe treatments or medications.
- **No Regrowth Guarantee**: The app does not claim, guarantee, or promise hair regrowth.
- **Medical Consultation**: If you experience sudden, severe, or painful shedding, scalp redness, pustules, or concerning changes, consult a licensed dermatologist or medical professional.

---

## 7. Contact Information

For inquiries regarding HAIR OS or this Privacy Policy, please contact the developer via the official repository or project support:
- **Developer**: Gokul Arun (`gokularun201@gmail.com`)
- **Repository**: [https://github.com/gokularun201-creator/hairos-app](https://github.com/gokularun201-creator/hairos-app)
