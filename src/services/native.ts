export class NativeService {
  public static isCapacitorNative(): boolean {
    return Boolean(
      typeof window !== 'undefined' &&
      (window as any).Capacitor &&
      (window as any).Capacitor.isNativePlatform &&
      (window as any).Capacitor.isNativePlatform()
    );
  }

  // --- CAMERA & PHOTO ACQUISITION ---
  public static async capturePhoto(source: 'camera' | 'photos' = 'camera'): Promise<string | null> {
    // 1. Try Capacitor Camera plugin if available
    const cap = (window as any).Capacitor;
    if (cap?.Plugins?.Camera) {
      try {
        const photo = await cap.Plugins.Camera.getPhoto({
          quality: 85,
          allowEditing: false,
          resultType: 'dataUrl',
          source: source === 'camera' ? 'CAMERA' : 'PHOTOS',
          width: 1200,
          height: 1200,
          correctOrientation: true
        });
        if (photo?.dataUrl) {
          return await this.compressImage(photo.dataUrl, 1080, 0.82);
        }
      } catch (err: any) {
        console.warn('[NativeService] Capacitor camera cancelled or error:', err);
        if (err?.message?.includes('denied') || err?.message?.includes('permission')) {
          throw new Error('Camera permission was denied. Please allow camera access in your device Settings to take photos.');
        }
        // Fall back to web input if native plugin threw unexpected error
      }
    }

    // 2. Web input fallback (works 100% in WebView & web browsers)
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      if (source === 'camera') {
        input.capture = 'environment';
      }

      input.onchange = async (e: any) => {
        const file = e.target?.files?.[0];
        if (!file) {
          return resolve(null);
        }
        const reader = new FileReader();
        reader.onload = async () => {
          const rawData = reader.result as string;
          const compressed = await NativeService.compressImage(rawData, 1080, 0.82);
          resolve(compressed);
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      };

      // Trigger file selector
      input.click();
    });
  }

  // --- CANVAS IMAGE COMPRESSION ---
  public static compressImage(dataUrl: string, maxDim: number = 1080, quality: number = 0.82): Promise<string> {
    return new Promise((resolve) => {
      if (!dataUrl || !dataUrl.startsWith('data:image')) {
        return resolve(dataUrl);
      }
      const img = new Image();
      img.onload = () => {
        try {
          let w = img.naturalWidth || img.width;
          let h = img.naturalHeight || img.height;

          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, w);
          canvas.height = Math.max(1, h);
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(dataUrl);

          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (e) {
          console.warn('[NativeService] Compression fallback:', e);
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  // --- LOCAL NOTIFICATIONS & REMINDERS ---
  public static async requestNotificationPermission(): Promise<boolean> {
    const cap = (window as any).Capacitor;
    if (cap?.Plugins?.LocalNotifications) {
      try {
        const status = await cap.Plugins.LocalNotifications.requestPermissions();
        return status.display === 'granted';
      } catch (e) {
        console.warn('[NativeService] Error requesting native notification permission:', e);
        return false;
      }
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        return result === 'granted';
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  public static async scheduleReminders(
    enabled: boolean,
    morningTime: string = '08:30',
    eveningTime: string = '20:30'
  ): Promise<boolean> {
    const cap = (window as any).Capacitor;
    if (cap?.Plugins?.LocalNotifications) {
      try {
        // Cancel previous reminders first
        await cap.Plugins.LocalNotifications.cancel({
          notifications: [{ id: 101 }, { id: 102 }]
        });

        if (!enabled) {
          return true;
        }

        // Create notification channel on Android
        try {
          await cap.Plugins.LocalNotifications.createChannel({
            id: 'hair_os_care_reminders',
            name: 'Care Routine Reminders',
            description: 'Daily gentle reminders for your hair & scalp care routine',
            importance: 4,
            visibility: 1,
            vibration: true
          });
        } catch (channelErr) {}

        const [mH, mM] = morningTime.split(':').map(Number);
        const [eH, eM] = eveningTime.split(':').map(Number);

        const morningDate = new Date();
        morningDate.setHours(mH || 8, mM || 30, 0, 0);
        if (morningDate.getTime() <= Date.now()) {
          morningDate.setDate(morningDate.getDate() + 1);
        }

        const eveningDate = new Date();
        eveningDate.setHours(eH || 20, eM || 30, 0, 0);
        if (eveningDate.getTime() <= Date.now()) {
          eveningDate.setDate(eveningDate.getDate() + 1);
        }

        await cap.Plugins.LocalNotifications.schedule({
          notifications: [
            {
              id: 101,
              title: 'Morning Care Routine ☀️',
              body: 'Take 2 minutes for your gentle morning scalp massage and detangling.',
              channelId: 'hair_os_care_reminders',
              schedule: { at: morningDate, every: 'day' }
            },
            {
              id: 102,
              title: 'Evening Scalp Wind-Down 🌙',
              body: 'Time for your evening scalp check and gentle relaxing massage before sleep.',
              channelId: 'hair_os_care_reminders',
              schedule: { at: eveningDate, every: 'day' }
            }
          ]
        });

        return true;
      } catch (e) {
        console.warn('[NativeService] Error scheduling local notifications:', e);
        return false;
      }
    }

    return true;
  }
}
