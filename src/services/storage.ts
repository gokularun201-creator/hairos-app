import { UserProfile, RoutineTask, PhotoRecord, ScalpCheck, DiaryEntry, ReminderSettings, ExportDataPackage, DailyFoodWaterConfig, DailyChecklistState } from '../types';
import { DEFAULT_PROFILE, DEFAULT_ROUTINES, DEFAULT_REMINDERS, DEFAULT_FOOD_WATER_CONFIG, DEFAULT_DAILY_CHECKLIST_STATE } from '../data/defaultData';

const DB_NAME = 'HairOS_DB_v2';
const DB_VERSION = 1;

class HairOSStorage {
  private db: IDBDatabase | null = null;
  private dbReadyPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbReadyPromise = this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        console.warn('[HairOSStorage] IndexedDB unavailable, falling back to local memory/storage');
        return resolve(null as any);
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('photos')) {
          db.createObjectStore('photos', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('routines')) {
          db.createObjectStore('routines', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('scalp_checks')) {
          db.createObjectStore('scalp_checks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('diary')) {
          db.createObjectStore('diary', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('kv')) {
          db.createObjectStore('kv', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onerror = () => {
        console.error('[HairOSStorage] Failed to open IndexedDB:', request.error);
        resolve(null as any);
      };
    });
  }

  // --- SAFE MIGRATION FROM LEGACY LOCALSTORAGE ---
  public async migrateFromLegacyStorage(): Promise<boolean> {
    try {
      const isMigrated = localStorage.getItem('hairos_v2_migrated');
      if (isMigrated === 'true') {
        return true;
      }

      console.log('[HairOSStorage] Starting safe legacy data migration...');

      // 1. Create a non-destructive backup of existing localStorage before migration
      const legacyBackup: Record<string, string> = {};
      const keysToBackup = [
        'hairos_profile',
        'hairos_routines',
        'hairos_scans',
        'hairos_scalp_checks',
        'hairos_diary',
        'hairos_reminders',
        'hairos_growth_state_v1',
        'hairos_name_set'
      ];

      for (const k of keysToBackup) {
        const val = localStorage.getItem(k);
        if (val !== null) {
          legacyBackup[k] = val;
        }
      }

      const db = await this.dbReadyPromise;
      if (db) {
        await this.setKV('migration_backup_raw', legacyBackup);
      }

      // 2. Migrate Profile
      let profile: UserProfile = { ...DEFAULT_PROFILE };
      const rawProfile = localStorage.getItem('hairos_profile');
      if (rawProfile) {
        try {
          const parsed = JSON.parse(rawProfile);
          // Clean up any invented medical diagnoses or Norwood stages
          profile = {
            name: parsed.name && parsed.name !== 'Alex' && parsed.name !== 'Friend' ? parsed.name : '',
            scalpType: parsed.scalpType || 'normal',
            primaryFocus: parsed.primaryFocus || parsed.hairGoal || DEFAULT_PROFILE.primaryFocus,
            washFrequency: parsed.washFrequency || DEFAULT_PROFILE.washFrequency,
            onboardingCompleted: Boolean(parsed.onboardingCompleted),
            notes: parsed.notes || ''
          };
        } catch (e) {
          console.warn('[HairOSStorage] Error parsing legacy profile:', e);
        }
      }
      await this.saveProfile(profile);

      // 3. Migrate Routines
      let routines: RoutineTask[] = [...DEFAULT_ROUTINES];
      const rawRoutines = localStorage.getItem('hairos_routines');
      if (rawRoutines) {
        try {
          const parsedR = JSON.parse(rawRoutines);
          if (Array.isArray(parsedR) && parsedR.length > 0) {
            routines = parsedR.map((t: any) => ({
              id: t.id || `rt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              title: t.title || 'Care Habit',
              category: t.category || 'morning',
              frequency: t.frequency || 'daily',
              timeOfDay: t.timeOfDay || '08:00',
              whyItHelps: t.whyItHelps || 'Promotes scalp health and hair strand care.',
              safetyNotes: t.safetyNotes || 'Gentle handling without mechanical tension.',
              completed: Boolean(t.completed),
              lastCompletedDate: t.lastCompletedDate || null
            }));
          }
        } catch (e) {
          console.warn('[HairOSStorage] Error parsing legacy routines:', e);
        }
      }
      await this.saveRoutines(routines);

      // 4. Migrate Scans/Photos to IndexedDB (preserves full image data safely!)
      const rawScans = localStorage.getItem('hairos_scans');
      if (rawScans) {
        try {
          const parsedScans = JSON.parse(rawScans);
          if (Array.isArray(parsedScans)) {
            for (const s of parsedScans) {
              if (s && s.id) {
                const photoRecord: PhotoRecord = {
                  id: s.id,
                  date: s.date || new Date().toISOString().split('T')[0],
                  timestamp: s.timestamp || (s.date ? new Date(s.date).getTime() : Date.now()),
                  zone: s.zone || 'crown',
                  zoneLabel: s.zoneLabel || (s.zone === 'crown' ? 'Crown / Vertex' : 'Hairline / Temples'),
                  imageUrl: s.imageUrl || '',
                  notes: s.notes || s.hairShaftNotes || '',
                  lightingStatus: s.lightingStatus || 'Standard light',
                  distanceStatus: s.distanceStatus || 'Consistent distance',
                  isExample: false
                };
                await this.savePhoto(photoRecord);
              }
            }
          }
        } catch (e) {
          console.warn('[HairOSStorage] Error migrating legacy scans:', e);
        }
      }

      // 5. Migrate Scalp Checks
      const rawScalp = localStorage.getItem('hairos_scalp_checks');
      if (rawScalp) {
        try {
          const parsedScalp = JSON.parse(rawScalp);
          if (Array.isArray(parsedScalp)) {
            for (const sc of parsedScalp) {
              if (sc && sc.id) {
                await this.saveScalpCheck(sc);
              }
            }
          }
        } catch (e) {}
      }

      // 6. Migrate Reminders
      const rawReminders = localStorage.getItem('hairos_reminders');
      if (rawReminders) {
        try {
          const parsedRem = JSON.parse(rawReminders);
          await this.saveReminders({
            enabled: Boolean(parsedRem.notificationsEnabled || parsedRem.enabled),
            morningTime: parsedRem.morningTime || '08:30',
            eveningTime: parsedRem.eveningTime || '20:30',
            showerDayReminder: Boolean(parsedRem.showerDayReminder ?? true)
          });
        } catch (e) {}
      } else {
        await this.saveReminders(DEFAULT_REMINDERS);
      }

      localStorage.setItem('hairos_v2_migrated', 'true');
      console.log('[HairOSStorage] Legacy data successfully migrated to IndexedDB without data loss.');
      return true;
    } catch (e) {
      console.error('[HairOSStorage] Migration encountered an error:', e);
      return false;
    }
  }

  // --- KEY-VALUE STORE ---
  private async setKV(key: string, value: any): Promise<void> {
    const db = await this.dbReadyPromise;
    if (db) {
      try {
        const tx = db.transaction('kv', 'readwrite');
        const store = tx.objectStore('kv');
        store.put({ key, value });
        await new Promise((res, rej) => {
          tx.oncomplete = res;
          tx.onerror = () => rej(tx.error);
        });
      } catch (e) {
        console.warn('[HairOSStorage] Error writing KV:', e);
      }
    }
    // Also mirror lightweight keys in localStorage for immediate sync
    try {
      if (typeof value === 'object') {
        localStorage.setItem(`hairos_${key}`, JSON.stringify(value));
      } else {
        localStorage.setItem(`hairos_${key}`, String(value));
      }
    } catch (e) {}
  }

  private async getKV<T>(key: string, fallback: T): Promise<T> {
    const db = await this.dbReadyPromise;
    if (db) {
      try {
        const tx = db.transaction('kv', 'readonly');
        const store = tx.objectStore('kv');
        const req = store.get(key);
        const result = await new Promise<any>((res) => {
          req.onsuccess = () => res(req.result?.value);
          req.onerror = () => res(null);
        });
        if (result !== undefined && result !== null) {
          return result;
        }
      } catch (e) {}
    }

    // Fallback to localStorage
    try {
      const localVal = localStorage.getItem(`hairos_${key}`);
      if (localVal) {
        return JSON.parse(localVal);
      }
    } catch (e) {}

    return fallback;
  }

  // --- USER PROFILE ---
  public async getProfile(): Promise<UserProfile> {
    return this.getKV<UserProfile>('profile', DEFAULT_PROFILE);
  }

  public async saveProfile(profile: UserProfile): Promise<void> {
    await this.setKV('profile', profile);
  }

  // --- ROUTINES ---
  public async getRoutines(): Promise<RoutineTask[]> {
    const db = await this.dbReadyPromise;
    if (db) {
      try {
        const tx = db.transaction('routines', 'readonly');
        const store = tx.objectStore('routines');
        const req = store.getAll();
        const res = await new Promise<RoutineTask[]>((resolve) => {
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        if (res && res.length > 0) {
          return this.resetDailyRoutinesIfNewDay(res);
        }
      } catch (e) {}
    }

    // LocalStorage fallback
    try {
      const raw = localStorage.getItem('hairos_routines');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return this.resetDailyRoutinesIfNewDay(parsed);
        }
      }
    } catch (e) {}

    return DEFAULT_ROUTINES;
  }

  private resetDailyRoutinesIfNewDay(tasks: RoutineTask[]): RoutineTask[] {
    const today = new Date().toISOString().split('T')[0];
    const lastReset = localStorage.getItem('hairos_last_routine_reset');

    if (lastReset !== today) {
      const updated = tasks.map(t => {
        if (t.lastCompletedDate !== today) {
          return { ...t, completed: false };
        }
        return t;
      });
      localStorage.setItem('hairos_last_routine_reset', today);
      this.saveRoutines(updated);
      return updated;
    }
    return tasks;
  }

  public async saveRoutines(routines: RoutineTask[]): Promise<void> {
    const db = await this.dbReadyPromise;
    if (db) {
      try {
        const tx = db.transaction('routines', 'readwrite');
        const store = tx.objectStore('routines');
        store.clear();
        for (const task of routines) {
          store.put(task);
        }
        await new Promise((res, rej) => {
          tx.oncomplete = res;
          tx.onerror = () => rej(tx.error);
        });
      } catch (e) {
        console.warn('[HairOSStorage] Error writing routines to IDB:', e);
      }
    }
    try {
      localStorage.setItem('hairos_routines', JSON.stringify(routines));
    } catch (e) {}
  }

  // --- PHOTOS & JOURNAL ---
  public async getPhotos(): Promise<PhotoRecord[]> {
    const db = await this.dbReadyPromise;
    if (db) {
      try {
        const tx = db.transaction('photos', 'readonly');
        const store = tx.objectStore('photos');
        const req = store.getAll();
        const records = await new Promise<PhotoRecord[]>((resolve) => {
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        if (records) {
          return records.sort((a, b) => b.timestamp - a.timestamp);
        }
      } catch (e) {}
    }

    // LocalStorage fallback (if IDB unavailable)
    try {
      const raw = localStorage.getItem('hairos_scans');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          return list.sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));
        }
      }
    } catch (e) {}

    return [];
  }

  public async savePhoto(photo: PhotoRecord): Promise<boolean> {
    const db = await this.dbReadyPromise;
    if (db) {
      try {
        const tx = db.transaction('photos', 'readwrite');
        const store = tx.objectStore('photos');
        store.put(photo);
        await new Promise((res, rej) => {
          tx.oncomplete = res;
          tx.onerror = () => rej(tx.error);
        });
        return true;
      } catch (e) {
        console.error('[HairOSStorage] Error saving photo to IndexedDB:', e);
      }
    }

    // Fallback: try saving metadata to localStorage
    try {
      const existing = await this.getPhotos();
      const updated = [photo, ...existing.filter(p => p.id !== photo.id)];
      // If photo has huge base64, save metadata to localStorage
      localStorage.setItem('hairos_scans', JSON.stringify(updated.slice(0, 10)));
      return true;
    } catch (e) {
      console.warn('[HairOSStorage] Quota error saving photo to localStorage:', e);
      return false;
    }
  }

  public async deletePhoto(id: string): Promise<boolean> {
    const db = await this.dbReadyPromise;
    if (db) {
      try {
        const tx = db.transaction('photos', 'readwrite');
        const store = tx.objectStore('photos');
        store.delete(id);
        await new Promise((res, rej) => {
          tx.oncomplete = res;
          tx.onerror = () => rej(tx.error);
        });
      } catch (e) {}
    }
    try {
      const raw = localStorage.getItem('hairos_scans');
      if (raw) {
        const list = JSON.parse(raw);
        const filtered = list.filter((p: any) => p.id !== id);
        localStorage.setItem('hairos_scans', JSON.stringify(filtered));
      }
    } catch (e) {}
    return true;
  }

  // --- SCALP CHECKS ---
  public async getScalpChecks(): Promise<ScalpCheck[]> {
    const db = await this.dbReadyPromise;
    if (db) {
      try {
        const tx = db.transaction('scalp_checks', 'readonly');
        const store = tx.objectStore('scalp_checks');
        const req = store.getAll();
        const records = await new Promise<ScalpCheck[]>((res) => {
          req.onsuccess = () => res(req.result || []);
          req.onerror = () => res([]);
        });
        return records.sort((a, b) => b.timestamp - a.timestamp);
      } catch (e) {}
    }
    return [];
  }

  public async saveScalpCheck(check: ScalpCheck): Promise<void> {
    const db = await this.dbReadyPromise;
    if (db) {
      try {
        const tx = db.transaction('scalp_checks', 'readwrite');
        const store = tx.objectStore('scalp_checks');
        store.put(check);
        await new Promise((res, rej) => {
          tx.oncomplete = res;
          tx.onerror = () => rej(tx.error);
        });
      } catch (e) {}
    }
  }

  // --- REMINDERS ---
  public async getReminders(): Promise<ReminderSettings> {
    return this.getKV<ReminderSettings>('reminders', DEFAULT_REMINDERS);
  }

  public async saveReminders(settings: ReminderSettings): Promise<void> {
    await this.setKV('reminders', settings);
  }

  // --- DAILY FOOD & WATER CONFIG ---
  public async getDailyFoodWaterConfig(): Promise<DailyFoodWaterConfig> {
    return this.getKV<DailyFoodWaterConfig>('food_water_config', DEFAULT_FOOD_WATER_CONFIG);
  }

  public async saveDailyFoodWaterConfig(config: DailyFoodWaterConfig): Promise<void> {
    await this.setKV('food_water_config', config);
  }

  // --- DAILY CHECKLIST STATE (with auto-reset on new day) ---
  public async getDailyChecklistState(): Promise<DailyChecklistState> {
    const today = new Date().toISOString().split('T')[0];
    const saved = await this.getKV<DailyChecklistState>('daily_checklist_state', {
      ...DEFAULT_DAILY_CHECKLIST_STATE,
      date: today
    });

    if (!saved || saved.date !== today) {
      // New day: automatically reset checkboxes for each new day using phone local date
      const resetState: DailyChecklistState = {
        date: today,
        morningCompleted: false,
        afternoonCompleted: false,
        nightCompleted: false,
        nightFoodSelected: saved?.nightFoodSelected || DEFAULT_DAILY_CHECKLIST_STATE.nightFoodSelected
      };
      await this.saveDailyChecklistState(resetState);
      return resetState;
    }

    return saved;
  }

  public async saveDailyChecklistState(state: DailyChecklistState): Promise<void> {
    await this.setKV('daily_checklist_state', state);
  }

  // --- USER DATA EXPORT ---
  public async exportAllData(): Promise<ExportDataPackage> {
    const profile = await this.getProfile();
    const routines = await this.getRoutines();
    const photos = await this.getPhotos();
    const scalpChecks = await this.getScalpChecks();
    const reminders = await this.getReminders();
    const foodWaterConfig = await this.getDailyFoodWaterConfig();
    const dailyChecklistState = await this.getDailyChecklistState();

    return {
      app: 'HAIR OS',
      version: '2.2.0',
      exportedAt: new Date().toISOString(),
      profile,
      routines,
      photos,
      scalpChecks,
      diary: [],
      reminders,
      foodWaterConfig,
      dailyChecklistState
    };
  }

  // --- USER DATA IMPORT ---
  public async importData(importedPackage: ExportDataPackage): Promise<boolean> {
    if (!importedPackage || importedPackage.app !== 'HAIR OS') {
      throw new Error('Invalid HAIR OS data file format');
    }

    if (importedPackage.profile) {
      await this.saveProfile(importedPackage.profile);
    }
    if (Array.isArray(importedPackage.routines)) {
      await this.saveRoutines(importedPackage.routines);
    }
    if (Array.isArray(importedPackage.photos)) {
      for (const p of importedPackage.photos) {
        await this.savePhoto(p);
      }
    }
    if (Array.isArray(importedPackage.scalpChecks)) {
      for (const sc of importedPackage.scalpChecks) {
        await this.saveScalpCheck(sc);
      }
    }
    if (importedPackage.reminders) {
      await this.saveReminders(importedPackage.reminders);
    }
    if (importedPackage.foodWaterConfig) {
      await this.saveDailyFoodWaterConfig(importedPackage.foodWaterConfig);
    }
    if (importedPackage.dailyChecklistState) {
      await this.saveDailyChecklistState(importedPackage.dailyChecklistState);
    }
    return true;
  }

  // --- CLEAR ALL LOCAL DATA ---
  public async clearAllData(): Promise<void> {
    const db = await this.dbReadyPromise;
    if (db) {
      try {
        const stores = ['photos', 'routines', 'scalp_checks', 'diary', 'kv'];
        const tx = db.transaction(stores, 'readwrite');
        for (const s of stores) {
          tx.objectStore(s).clear();
        }
        await new Promise((res) => {
          tx.oncomplete = res;
        });
      } catch (e) {}
    }
    localStorage.clear();
  }
}

export const storage = new HairOSStorage();
