import { NotificationPersona } from '../types';

export interface NotificationContext {
  persona?: NotificationPersona;
  hairType?: string; // 'straight' | 'wavy' | 'curly' | 'coily'
  scalpType?: string; // 'oily' | 'dry' | 'sensitive' | 'normal'
  primaryFocus?: string;
  planDayNumber?: number; // 1 to 30
  planDayTitle?: string;
  productName?: string;
}

export interface GeneratedNotification {
  title: string;
  body: string;
  channelId: string;
  category: 'morning' | 'midday' | 'night' | 'wash_day' | 'pre_wash_eve' | 'milestone' | 'test' | 'patch_test';
}

/**
 * World-Class Hair Care Notification & Reminder Content Engine
 * Generates dynamic, context-aware, dermatology-informed notification copy
 * adapted to the user's hair profile, current 30-day plan milestone, and chosen persona tone.
 */
export class NotificationContentGenerator {
  /**
   * Generates tailored notification copy based on channel and user diagnostic state
   */
  public static generate(
    category: 'morning' | 'midday' | 'night' | 'wash_day' | 'pre_wash_eve' | 'milestone' | 'test' | 'patch_test',
    ctx: NotificationContext = {}
  ): GeneratedNotification {
    const persona = ctx.persona || 'clinical';
    const hair = (ctx.hairType || 'hair').toLowerCase();
    const scalp = (ctx.scalpType || 'normal').toLowerCase();
    const day = ctx.planDayNumber || 1;

    switch (category) {
      case 'test':
        return this.getTestNotification(persona, hair, scalp);

      case 'morning':
        return this.getMorningNotification(persona, hair, scalp, day, ctx.planDayTitle);

      case 'midday':
        return this.getMiddayNotification(persona, hair, scalp);

      case 'night':
        return this.getNightNotification(persona, hair, scalp);

      case 'wash_day':
        return this.getWashDayNotification(persona, hair, scalp);

      case 'pre_wash_eve':
        return this.getPreWashEveNotification(persona, hair, scalp);

      case 'milestone':
        return this.getMilestoneNotification(persona, day);

      case 'patch_test':
        return this.getPatchTestNotification(ctx.productName || 'Hair Care Formula');

      default:
        return {
          title: 'Hair OS Care Reminder ✨',
          body: 'Time for your daily hair wellness and hydration routine.',
          channelId: 'hair_os_routine',
          category: 'morning'
        };
    }
  }

  // --- 1. INSTANT TEST NOTIFICATION ---
  private static getTestNotification(
    persona: NotificationPersona,
    hair: string,
    scalp: string
  ): GeneratedNotification {
    if (persona === 'clinical') {
      return {
        title: 'Hair OS • Diagnostic System Active 🔬',
        body: `Calibrated for ${scalp} scalp & ${hair} texture. Alarms and follicle reminders are synchronized!`,
        channelId: 'hair_os_routine',
        category: 'test'
      };
    }
    if (persona === 'coach') {
      return {
        title: 'Hair OS • Consistency Engine Fired Up! 🔥',
        body: `Boom! Your reminders are live. Get ready to build that unbroken 30-day hair streak!`,
        channelId: 'hair_os_routine',
        category: 'test'
      };
    }
    // gentle
    return {
      title: 'Hair OS • Gentle Reminders Connected 🌿',
      body: `We are here to support your peaceful hair care journey. Everything is working smoothly.`,
      channelId: 'hair_os_routine',
      category: 'test'
    };
  }

  // --- 2. MORNING ROUTINE & HYDRATION ---
  private static getMorningNotification(
    persona: NotificationPersona,
    hair: string,
    scalp: string,
    day: number,
    planTitle?: string
  ): GeneratedNotification {
    const dayPrefix = planTitle ? `Day ${day} (${planTitle})` : `Day ${day} Routine`;

    if (persona === 'clinical') {
      const clinicalTips = [
        `Drink 400-500ml water to rehydrate follicle matrix cells after nocturnal fluid loss.`,
        `Stimulate scalp micro-circulation with 2 min of gentle circular fingertip compression.`,
        `Detangle gently starting 2 inches from tips upward to prevent tensile fracture of ${hair} shafts.`,
        `Pair morning nutrition with bioavailable protein and zinc to support keratin synthesis.`
      ];
      const tip = clinicalTips[day % clinicalTips.length];
      return {
        title: `☀️ Morning Protocol • ${dayPrefix}`,
        body: tip,
        channelId: 'hair_os_routine',
        category: 'morning'
      };
    }

    if (persona === 'coach') {
      return {
        title: `☀️ Rise & Shine! • ${dayPrefix} 🔥`,
        body: `Day ${day} is here! Grab your water, check off your morning habit, and protect your hair crown today!`,
        channelId: 'hair_os_routine',
        category: 'morning'
      };
    }

    // gentle
    return {
      title: `☀️ Gentle Morning • ${dayPrefix} 🌿`,
      body: `Take a deep breath and start the day kindly. A glass of water and soft detangling await you.`,
      channelId: 'hair_os_routine',
      category: 'morning'
    };
  }

  // --- 3. MIDDAY HYDRATION & NUTRITION ---
  private static getMiddayNotification(
    persona: NotificationPersona,
    hair: string,
    scalp: string
  ): GeneratedNotification {
    if (persona === 'clinical') {
      return {
        title: '🌤️ Midday Keratin Matrix Support',
        body: `Drink 2 glasses of water and ensure lunch includes sulfur-rich amino acids (eggs, dal, seeds) for cuticle strength.`,
        channelId: 'hair_os_routine',
        category: 'midday'
      };
    }
    if (persona === 'coach') {
      return {
        title: '🌤️ Halfway Check-in! Stay Hydrated 💧',
        body: `Keep that energy high! Hydrate your follicles with 500ml water right now. Don't skip lunch!`,
        channelId: 'hair_os_routine',
        category: 'midday'
      };
    }
    return {
      title: '🌤️ Midday Refresh 🌿',
      body: `A soft reminder to pause, enjoy a refreshing drink of water, and nourish your body with wholesome food.`,
      channelId: 'hair_os_routine',
      category: 'midday'
    };
  }

  // --- 4. NIGHT PROTECTION & SILK BONNET ---
  private static getNightNotification(
    persona: NotificationPersona,
    hair: string,
    scalp: string
  ): GeneratedNotification {
    if (persona === 'clinical') {
      return {
        title: '🌙 Nocturnal Barrier Protection',
        body: `Friction against cotton causes cuticle chipping. Switch to satin/silk and apply 3 drops of seal oil if tips are dry.`,
        channelId: 'hair_os_routine',
        category: 'night'
      };
    }
    if (persona === 'coach') {
      return {
        title: '🌙 Night Lock-In! Protect Your Strands 🛡️',
        body: `Lock in today's gains! Silk bonnet or satin pillowcase on, quick 3-min scalp relaxation, and restful sleep!`,
        channelId: 'hair_os_routine',
        category: 'night'
      };
    }
    return {
      title: '🌙 Peaceful Wind-Down & Scalp Care 🕯️',
      body: `Release the day's stress with gentle scalp relaxation. Protect your hair softly as you rest tonight.`,
      channelId: 'hair_os_routine',
      category: 'night'
    };
  }

  // --- 5. WASH DAY MORNING ---
  private static getWashDayNotification(
    persona: NotificationPersona,
    hair: string,
    scalp: string
  ): GeneratedNotification {
    if (persona === 'clinical') {
      return {
        title: '🚿 Scheduled Wash Day • Cleansing Science',
        body: `Use lukewarm water (37-38°C). Focus shampoo solely on ${scalp} scalp to lift sebum; let rinse cleanse ${hair} ends.`,
        channelId: 'hair_os_wash_day',
        category: 'wash_day'
      };
    }
    if (persona === 'coach') {
      return {
        title: '🚿 Wash Day Alert! Fresh Scalp Reset ⚡',
        body: `Today is wash day! Cleanse that scalp, condition mid-lengths, and treat your hair like royalty!`,
        channelId: 'hair_os_wash_day',
        category: 'wash_day'
      };
    }
    return {
      title: '🚿 Gentle Wash Day 💧',
      body: `Today is your scheduled cleanse. Enjoy lukewarm water, soothing lather on the scalp, and soft towel patting.`,
      channelId: 'hair_os_wash_day',
      category: 'wash_day'
    };
  }

  // --- 6. WASH DAY EVE PRE-POO PREP ALERT ---
  private static getPreWashEveNotification(
    persona: NotificationPersona,
    hair: string,
    scalp: string
  ): GeneratedNotification {
    if (persona === 'clinical') {
      return {
        title: '✨ Tomorrow is Wash Day: Pre-Poo Alert',
        body: `Apply lightweight oil (coconut/jojoba) to ends tonight to reduce water absorption and prevent hygral fatigue tomorrow.`,
        channelId: 'hair_os_wash_day',
        category: 'pre_wash_eve'
      };
    }
    if (persona === 'coach') {
      return {
        title: '🛡️ Wash Day Eve: Pre-Poo Shield!',
        body: `Heads up! Tomorrow is wash day. Give your ends some pre-wash oil love tonight for ultra-soft results!`,
        channelId: 'hair_os_wash_day',
        category: 'pre_wash_eve'
      };
    }
    return {
      title: '✨ Pre-Wash Preparation 🌸',
      body: `Tomorrow is wash day. If your ends feel dry, a drop of nourishing oil tonight will protect them during tomorrow's wash.`,
      channelId: 'hair_os_wash_day',
      category: 'pre_wash_eve'
    };
  }

  // --- 7. 7-DAY MILESTONE PROGRESS PHOTO ---
  private static getMilestoneNotification(
    persona: NotificationPersona,
    day: number
  ): GeneratedNotification {
    return {
      title: `📸 Day ${day} Milestone: Progress Check-in!`,
      body: `It's time for your 7-day progress photo! Snap your side-by-side comparison to track follicle density and hair health.`,
      channelId: 'hair_os_milestone',
      category: 'milestone'
    };
  }

  // --- 8. 24-HOUR PRODUCT PATCH TEST ALERT ---
  private static getPatchTestNotification(productName: string): GeneratedNotification {
    return {
      title: `🧴 24h Patch Test Complete: ${productName}`,
      body: `Check your patch test area (behind ear or inner elbow). If free of itching, redness, or bumps, it is safe to apply!`,
      channelId: 'hair_os_safety',
      category: 'patch_test'
    };
  }
}
