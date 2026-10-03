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

  // --- LOCAL NOTIFICATIONS & SMART REMINDER ENGINE ---

  public static async checkNotificationPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    const cap = (window as any).Capacitor;
    if (cap?.Plugins?.LocalNotifications) {
      try {
        const status = await cap.Plugins.LocalNotifications.checkPermissions();
        if (status.display === 'granted') return 'granted';
        if (status.display === 'denied') return 'denied';
        return 'prompt';
      } catch (e) {
        return 'prompt';
      }
    }
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission as any;
    }
    return 'prompt';
  }

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

  public static triggerHapticFeedback(pattern: number[] = [80, 40, 80]) {
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (e) {}
  }

  /**
   * Fires an instant live notification test to verify device sound, vibration, and banner
   */
  public static async sendInstantTestNotification(ctx: any = {}): Promise<boolean> {
    const { NotificationContentGenerator } = await import('./notificationContentGenerator');
    const note = NotificationContentGenerator.generate('test', ctx);

    // 1. Trigger haptic feedback
    this.triggerHapticFeedback([100, 50, 150]);

    // 2. Dispatch custom in-app HUD event for instant visual feedback
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('hair_os_notification_event', {
          detail: {
            title: note.title,
            body: note.body,
            category: note.category,
            timestamp: Date.now()
          }
        })
      );
    }

    // 3. Fire native Android notification via Capacitor
    const cap = (window as any).Capacitor;
    if (cap?.Plugins?.LocalNotifications) {
      try {
        await cap.Plugins.LocalNotifications.schedule({
          notifications: [
            {
              id: 999,
              title: note.title,
              body: note.body,
              channelId: 'hair_os_routine',
              schedule: { at: new Date(Date.now() + 800) },
              sound: 'res://raw/notification_sound'
            }
          ]
        });
        return true;
      } catch (err) {
        console.warn('[NativeService] Capacitor test notification fallback:', err);
      }
    }

    // 4. Fallback to Web Notification API
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(note.title, {
          body: note.body,
          icon: '/favicon.ico'
        });
      } catch (e) {}
    }

    return true;
  }

  /**
   * Schedules all intelligent hair care notification channels
   */
  public static async scheduleAllSmartReminders(
    settings: any,
    ctx: any = {}
  ): Promise<boolean> {
    const cap = (window as any).Capacitor;
    const { NotificationContentGenerator } = await import('./notificationContentGenerator');

    if (!cap?.Plugins?.LocalNotifications) {
      console.log('[NativeService] Running in web environment. Smart reminders saved locally.');
      return true;
    }

    try {
      // 1. Cancel all previous scheduled Hair OS reminders (IDs 100 to 199)
      const idsToCancel = Array.from({ length: 100 }, (_, i) => ({ id: 100 + i }));
      await cap.Plugins.LocalNotifications.cancel({ notifications: idsToCancel });

      if (!settings.enabled) {
        return true;
      }

      // 2. Ensure Android Notification Channels exist with proper priorities
      try {
        await cap.Plugins.LocalNotifications.createChannel({
          id: 'hair_os_routine',
          name: 'Daily Hair & Scalp Routine',
          description: 'Daily morning, hydration, and nighttime follicle care prompts',
          importance: 4,
          visibility: 1,
          vibration: settings.vibration !== false
        });

        await cap.Plugins.LocalNotifications.createChannel({
          id: 'hair_os_wash_day',
          name: 'Wash Day & Pre-Poo Prep',
          description: 'Scheduled hair wash mornings and pre-wash protective alerts',
          importance: 4,
          visibility: 1,
          vibration: settings.vibration !== false
        });

        await cap.Plugins.LocalNotifications.createChannel({
          id: 'hair_os_milestone',
          name: 'Weekly Photo Milestones',
          description: '7-day progress photo comparison check-ins',
          importance: 3,
          visibility: 1,
          vibration: settings.vibration !== false
        });

        await cap.Plugins.LocalNotifications.createChannel({
          id: 'hair_os_safety',
          name: 'Product Patch Test Safety',
          description: '24-hour ingredient safety timer',
          importance: 5,
          visibility: 1,
          vibration: true
        });
      } catch (chErr) {}

      const notifications: any[] = [];
      const userCtx = { ...ctx, persona: settings.persona || 'clinical' };

      // Helper to compute next occurrence of HH:MM
      const getNextTimeDate = (timeStr: string = '08:00', addDays: number = 0): Date => {
        const [h, m] = (timeStr || '08:00').split(':').map(Number);
        const d = new Date();
        d.setDate(d.getDate() + addDays);
        d.setHours(h || 8, m || 0, 0, 0);
        if (addDays === 0 && d.getTime() <= Date.now()) {
          d.setDate(d.getDate() + 1);
        }
        return d;
      };

      // 1. Morning Routine Channel
      if (settings.morningEnabled !== false) {
        const morningNote = NotificationContentGenerator.generate('morning', userCtx);
        notifications.push({
          id: 101,
          title: morningNote.title,
          body: morningNote.body,
          channelId: 'hair_os_routine',
          schedule: { at: getNextTimeDate(settings.morningTime || '08:00'), every: 'day' }
        });
      }

      // 2. Midday Hydration & Keratin Channel
      if (settings.afternoonEnabled !== false) {
        const middayNote = NotificationContentGenerator.generate('midday', userCtx);
        notifications.push({
          id: 102,
          title: middayNote.title,
          body: middayNote.body,
          channelId: 'hair_os_routine',
          schedule: { at: getNextTimeDate(settings.afternoonTime || '13:00'), every: 'day' }
        });
      }

      // 3. Night Silk Bonnet & Scalp Release Channel
      if (settings.nightEnabled !== false) {
        const nightNote = NotificationContentGenerator.generate('night', userCtx);
        notifications.push({
          id: 103,
          title: nightNote.title,
          body: nightNote.body,
          channelId: 'hair_os_routine',
          schedule: { at: getNextTimeDate(settings.nightTime || '21:00'), every: 'day' }
        });
      }

      // 4. Wash Day Morning & Pre-Poo Eve Alarms
      const washDays: number[] = Array.isArray(settings.washDays) ? settings.washDays : [1, 4];
      if (settings.washDayEnabled !== false && washDays.length > 0) {
        const washTime = typeof settings.washTime === 'string' ? settings.washTime : '07:30';
        const [wH, wM] = washTime.split(':').map(Number);

        washDays.forEach((dayOfWeek, idx) => {
          // Morning wash alarm
          const washDate = new Date();
          const currentDay = washDate.getDay();
          let distance = (dayOfWeek - currentDay + 7) % 7;
          washDate.setDate(washDate.getDate() + distance);
          washDate.setHours(wH || 7, wM || 30, 0, 0);
          if (washDate.getTime() <= Date.now()) {
            washDate.setDate(washDate.getDate() + 7);
          }

          const washNote = NotificationContentGenerator.generate('wash_day', userCtx);
          notifications.push({
            id: 110 + idx,
            title: washNote.title,
            body: washNote.body,
            channelId: 'hair_os_wash_day',
            schedule: { at: washDate, every: 'week' }
          });

          // Pre-Wash Eve Pre-Poo Alert (Night before wash day at 20:30)
          if (settings.preWashEveEnabled !== false) {
            const preWashDate = new Date(washDate);
            preWashDate.setDate(preWashDate.getDate() - 1);
            preWashDate.setHours(20, 30, 0, 0);
            if (preWashDate.getTime() > Date.now()) {
              const preWashNote = NotificationContentGenerator.generate('pre_wash_eve', userCtx);
              notifications.push({
                id: 120 + idx,
                title: preWashNote.title,
                body: preWashNote.body,
                channelId: 'hair_os_wash_day',
                schedule: { at: preWashDate, every: 'week' }
              });
            }
          }
        });
      }

      // 5. Weekly Photo Milestone Alert (Every Sunday at 10:00 AM)
      if (settings.milestonePhotoEnabled !== false) {
        const photoDate = new Date();
        const curDay = photoDate.getDay();
        const dist = (0 - curDay + 7) % 7; // Sunday = 0
        photoDate.setDate(photoDate.getDate() + dist);
        photoDate.setHours(10, 0, 0, 0);
        if (photoDate.getTime() <= Date.now()) {
          photoDate.setDate(photoDate.getDate() + 7);
        }

        const milestoneNote = NotificationContentGenerator.generate('milestone', {
          ...userCtx,
          planDayNumber: 7
        });
        notifications.push({
          id: 130,
          title: milestoneNote.title,
          body: milestoneNote.body,
          channelId: 'hair_os_milestone',
          schedule: { at: photoDate, every: 'week' }
        });
      }

      // 6. Active Patch Test Reminder
      if (settings.patchTestAlertAt && settings.patchTestAlertAt > Date.now()) {
        const patchNote = NotificationContentGenerator.generate('patch_test', {
          productName: settings.patchTestProductName || 'New Formula'
        });
        notifications.push({
          id: 140,
          title: patchNote.title,
          body: patchNote.body,
          channelId: 'hair_os_safety',
          schedule: { at: new Date(settings.patchTestAlertAt) }
        });
      }

      if (notifications.length > 0) {
        await cap.Plugins.LocalNotifications.schedule({ notifications });
        console.log(`[NativeService] Successfully scheduled ${notifications.length} smart hair care alarms.`);
      }

      return true;
    } catch (e) {
      console.warn('[NativeService] Error scheduling smart reminders:', e);
      return false;
    }
  }

  /**
   * Schedules a 24-hour product patch test safety reminder
   */
  public static async schedulePatchTestReminder(productName: string, hours = 24): Promise<number> {
    const triggerTime = Date.now() + hours * 3600 * 1000;
    const { NotificationContentGenerator } = await import('./notificationContentGenerator');
    const note = NotificationContentGenerator.generate('patch_test', { productName });

    const cap = (window as any).Capacitor;
    if (cap?.Plugins?.LocalNotifications) {
      try {
        await cap.Plugins.LocalNotifications.schedule({
          notifications: [
            {
              id: 140,
              title: note.title,
              body: note.body,
              channelId: 'hair_os_safety',
              schedule: { at: new Date(triggerTime) }
            }
          ]
        });
      } catch (err) {
        console.warn('[NativeService] Error setting patch test alarm:', err);
      }
    }

    return triggerTime;
  }

  // --- BACKWARDS COMPATIBILITY WRAPPER ---
  public static async scheduleReminders(
    enabled: boolean,
    morningTime: any = '08:00',
    eveningTime: any = '20:30',
    afternoonTime: any = '13:00',
    washReminderTime: any = '08:00',
    washDays: any = [1, 4],
    washEnabled: boolean = true
  ): Promise<boolean> {
    // Gracefully handle argument swapping if washDays was passed as 5th argument
    let resolvedWashDays = [1, 4];
    let resolvedWashTime = '08:00';

    if (Array.isArray(washReminderTime)) {
      resolvedWashDays = washReminderTime;
    } else if (typeof washReminderTime === 'string') {
      resolvedWashTime = washReminderTime;
    }

    if (Array.isArray(washDays)) {
      resolvedWashDays = washDays;
    }

    const settings = {
      enabled,
      morningEnabled: true,
      morningTime: typeof morningTime === 'string' ? morningTime : '08:00',
      afternoonEnabled: true,
      afternoonTime: typeof afternoonTime === 'string' ? afternoonTime : '13:00',
      nightEnabled: true,
      nightTime: typeof eveningTime === 'string' ? eveningTime : '20:30',
      washDayEnabled: washEnabled,
      washDays: resolvedWashDays,
      washTime: resolvedWashTime,
      preWashEveEnabled: true,
      milestonePhotoEnabled: true,
      persona: 'clinical' as const,
      vibration: true
    };

    return this.scheduleAllSmartReminders(settings, {});
  }
}

