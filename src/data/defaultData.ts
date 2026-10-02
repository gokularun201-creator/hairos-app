import { UserProfile, RoutineTask, PhotoRecord, ReminderSettings, HairGoal, HairType, ScalpType, PreferredTime, DailyFoodWaterConfig, DailyChecklistState, ShelfProduct } from '../types';

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  scalpType: 'normal',
  hairType: 'wavy',
  hairGoal: 'gentle_maintenance',
  preferredTime: 'morning',
  primaryFocus: 'Gentle Care & Habit Consistency',
  washFrequency: 'Every 2-3 Days',
  onboardingCompleted: false,
  notes: ''
};

export const DEFAULT_ROUTINES: RoutineTask[] = [
  {
    id: 'rt-massage-am',
    title: 'Morning Scalp Massage (2-3 min)',
    category: 'morning',
    frequency: 'daily',
    timeOfDay: '08:00',
    whyItHelps: 'Light fingertip circular massage helps stimulate local scalp circulation and relieves scalp tension.',
    safetyNotes: 'Use soft finger pads, not fingernails. Avoid aggressive friction or pulling on hair roots.',
    completed: false,
    lastCompletedDate: null
  },
  {
    id: 'rt-comb-am',
    title: 'Gentle Detangling (Ends First)',
    category: 'morning',
    frequency: 'daily',
    timeOfDay: '08:30',
    whyItHelps: 'Combing from tips up to roots gently removes knots without snapping hair shafts.',
    safetyNotes: 'Use a wide-tooth comb or flexible bristle brush. Never pull through stubborn tangles.',
    completed: false,
    lastCompletedDate: null
  },
  {
    id: 'rt-shower-wash',
    title: 'Gentle Scalp Cleansing & Rinse',
    category: 'shower',
    frequency: 'alternate',
    timeOfDay: '12:00',
    whyItHelps: 'Removes excess sebum, sweat, and environmental buildup while preserving the protective scalp barrier.',
    safetyNotes: 'Use lukewarm water rather than scalding hot water. Thoroughly rinse out all cleanser residue.',
    completed: false,
    lastCompletedDate: null
  },
  {
    id: 'rt-conditioner',
    title: 'Conditioning Hair Ends',
    category: 'shower',
    frequency: 'alternate',
    timeOfDay: '12:15',
    whyItHelps: 'Restores moisture and lubricates the cuticle to minimize friction and split ends.',
    safetyNotes: 'Apply primarily to mid-lengths and ends. Rinse thoroughly unless using a formulated leave-in.',
    completed: false,
    lastCompletedDate: null
  },
  {
    id: 'rt-pm-massage',
    title: 'Evening Scalp Wind-Down',
    category: 'evening',
    frequency: 'daily',
    timeOfDay: '21:00',
    whyItHelps: 'A 2-minute relaxing massage before bed encourages consistent relaxation and scalp awareness.',
    safetyNotes: 'Keep hair loosely tied or loose. Avoid tight elastics or high ponytails during sleep.',
    completed: false,
    lastCompletedDate: null
  }
];

export function createStarterRoutine(
  goal: HairGoal = 'gentle_maintenance',
  hairType: HairType = 'wavy',
  scalpType: ScalpType = 'normal',
  preferredTime: PreferredTime = 'morning'
): RoutineTask[] {
  const tasks: RoutineTask[] = [];

  const morningSlot = preferredTime === 'morning' || preferredTime === 'both' ? '08:00' : '09:00';
  const eveningSlot = preferredTime === 'evening' || preferredTime === 'both' ? '20:30' : '21:30';

  if (goal === 'shedding_care') {
    tasks.push({
      id: `rt-shed-massage-${Date.now()}-1`,
      title: 'Gentle Scalp Fingertip Massage (2 min)',
      category: preferredTime === 'evening' ? 'evening' : 'morning',
      frequency: 'daily',
      timeOfDay: preferredTime === 'evening' ? eveningSlot : morningSlot,
      whyItHelps: 'Encourages local microcirculation and releases galeal scalp tension without mechanical strain.',
      safetyNotes: 'Use gentle circular pads of fingers. Never pull, scratch, or aggressively rub.',
      completed: false,
      lastCompletedDate: null
    });
    tasks.push({
      id: `rt-shed-detangle-${Date.now()}-2`,
      title: 'Wide-Tooth Comb Detangle (Bottom-Up)',
      category: 'morning',
      frequency: 'daily',
      timeOfDay: '08:30',
      whyItHelps: 'Clears naturally shed resting hairs without tugging on active anagen follicles.',
      safetyNotes: 'Start from bottom ends and work upwards in sections. Never force through resistance.',
      completed: false,
      lastCompletedDate: null
    });
    tasks.push({
      id: `rt-shed-cleanse-${Date.now()}-3`,
      title: scalpType === 'oily' ? 'Balanced Daily Scalp Cleansing' : 'Gentle Barrier Scalp Cleansing',
      category: 'shower',
      frequency: scalpType === 'oily' ? 'daily' : 'alternate',
      timeOfDay: '12:00',
      whyItHelps: 'Keeps follicle openings clear of sebum build-up and Malassezia yeast without stripping.',
      safetyNotes: 'Use lukewarm water; avoid scalding temperatures which irritate scalp skin.',
      completed: false,
      lastCompletedDate: null
    });
    tasks.push({
      id: `rt-shed-sleep-${Date.now()}-4`,
      title: 'Low-Tension Loose Bedtime Style',
      category: 'evening',
      frequency: 'daily',
      timeOfDay: eveningSlot,
      whyItHelps: 'Eliminates nocturnal traction and reduces hairline follicle stress during sleep.',
      safetyNotes: 'Use soft silk/satin scrunchies or leave loose. Avoid tight rubber bands.',
      completed: false,
      lastCompletedDate: null
    });
  } else if (goal === 'dryness_hydration') {
    tasks.push({
      id: `rt-dry-hydrate-${Date.now()}-1`,
      title: 'Hydrating Scalp Mist or Barrier Serum',
      category: 'morning',
      frequency: 'daily',
      timeOfDay: morningSlot,
      whyItHelps: 'Supplies moisture to the stratum corneum and soothes dry, tight scalp skin.',
      safetyNotes: 'Water-based formulations absorb quickly without leaving greasy residue.',
      completed: false,
      lastCompletedDate: null
    });
    tasks.push({
      id: `rt-dry-ends-${Date.now()}-2`,
      title: 'Leave-In Moisture on Mid-Lengths & Ends',
      category: preferredTime === 'evening' ? 'evening' : 'morning',
      frequency: 'daily',
      timeOfDay: preferredTime === 'evening' ? eveningSlot : '08:45',
      whyItHelps: 'Seals moisture into hair cuticles and prevents strand brittleness and fraying.',
      safetyNotes: 'Focus on ends; keep rich conditioning balms away from the direct scalp roots.',
      completed: false,
      lastCompletedDate: null
    });
    tasks.push({
      id: `rt-dry-wash-${Date.now()}-3`,
      title: 'Moisturizing Scalp Cleanse & Deep Condition',
      category: 'shower',
      frequency: 'alternate',
      timeOfDay: '12:00',
      whyItHelps: 'Replenishes lost lipids while gently removing environmental pollutants.',
      safetyNotes: 'Rinse thoroughly with lukewarm water. Allow conditioner 3 minutes to penetrate.',
      completed: false,
      lastCompletedDate: null
    });
    tasks.push({
      id: `rt-dry-pillow-${Date.now()}-4`,
      title: 'Satin/Silk Pillowcase Sleep Protection',
      category: 'evening',
      frequency: 'daily',
      timeOfDay: eveningSlot,
      whyItHelps: 'Non-absorbent smooth fabrics prevent cotton from leaching hair moisture overnight.',
      safetyNotes: 'Reduces surface friction and morning frizz significantly.',
      completed: false,
      lastCompletedDate: null
    });
  } else if (goal === 'length_retention') {
    tasks.push({
      id: `rt-len-detangle-${Date.now()}-1`,
      title: 'Protective Sectioned Detangle',
      category: 'morning',
      frequency: 'daily',
      timeOfDay: morningSlot,
      whyItHelps: 'Isolating hair into 2-4 sections minimizes mechanical shear and strand snap.',
      safetyNotes: 'Always use a wide-tooth comb or specialized detangling flex-brush with slip.',
      completed: false,
      lastCompletedDate: null
    });
    tasks.push({
      id: `rt-len-protect-${Date.now()}-2`,
      title: 'Protective Low-Tension Styling',
      category: 'morning',
      frequency: 'daily',
      timeOfDay: '09:00',
      whyItHelps: 'Tucking fragile ends away shields them from clothing friction and harsh weather.',
      safetyNotes: 'Keep edges, temples, and nape completely loose without pulling.',
      completed: false,
      lastCompletedDate: null
    });
    tasks.push({
      id: `rt-len-seal-${Date.now()}-3`,
      title: 'End-Sealing Lightweight Oil or Serum',
      category: 'evening',
      frequency: 'daily',
      timeOfDay: eveningSlot,
      whyItHelps: 'Reinforces cuticle integrity at the oldest, most vulnerable part of each strand.',
      safetyNotes: 'A few drops are sufficient. Smooth gently downward along the cuticle.',
      completed: false,
      lastCompletedDate: null
    });
    tasks.push({
      id: `rt-len-wash-${Date.now()}-4`,
      title: 'Gentle Scalp Cleansing & Rich Treatment',
      category: 'shower',
      frequency: 'alternate',
      timeOfDay: '12:00',
      whyItHelps: 'Keeps follicle environment thriving while conditioning lengths against split ends.',
      safetyNotes: 'Avoid piling hair on top of head when shampooing; wash scalp smoothly.',
      completed: false,
      lastCompletedDate: null
    });
  } else {
    // Gentle Maintenance
    tasks.push({
      id: `rt-maint-massage-${Date.now()}-1`,
      title: 'Morning Scalp Awakening Massage (2 min)',
      category: 'morning',
      frequency: 'daily',
      timeOfDay: morningSlot,
      whyItHelps: 'Light fingertip circular massage encourages scalp comfort and circulation.',
      safetyNotes: 'Use soft finger pads. Avoid aggressive friction or fingernails.',
      completed: false,
      lastCompletedDate: null
    });
    tasks.push({
      id: `rt-maint-comb-${Date.now()}-2`,
      title: 'Gentle Tip-to-Root Combing',
      category: 'morning',
      frequency: 'daily',
      timeOfDay: '08:30',
      whyItHelps: 'Gently loosens tangles from ends up to roots to preserve cuticle smoothness.',
      safetyNotes: 'Use a wide-tooth comb or flexible paddle brush.',
      completed: false,
      lastCompletedDate: null
    });
    tasks.push({
      id: `rt-maint-wash-${Date.now()}-3`,
      title: scalpType === 'oily' ? 'Scalp Cleansing (Daily/Alternate)' : 'Balanced Scalp Wash & Rinse',
      category: 'shower',
      frequency: scalpType === 'oily' ? 'daily' : 'alternate',
      timeOfDay: '12:00',
      whyItHelps: 'Gently lifts sebum, residue, and dead skin cells to maintain healthy skin barrier.',
      safetyNotes: 'Focus lather on scalp skin; rinse thoroughly with comfortable lukewarm water.',
      completed: false,
      lastCompletedDate: null
    });
    tasks.push({
      id: `rt-maint-winddown-${Date.now()}-4`,
      title: 'Evening Scalp Wind-Down & Loose Style',
      category: 'evening',
      frequency: 'daily',
      timeOfDay: eveningSlot,
      whyItHelps: 'Relaxing 2-minute scalp massage relieves tension before restful sleep.',
      safetyNotes: 'Keep hair loosely tied with soft scrunchie or free.',
      completed: false,
      lastCompletedDate: null
    });
  }

  return tasks;
}

export const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: false,
  morningTime: '08:30',
  eveningTime: '20:30',
  showerDayReminder: true
};

export const DEFAULT_FOOD_WATER_CONFIG: DailyFoodWaterConfig = {
  // Morning: Drink water toward daily goal; eat breakfast with protein (eggs, curd, dal, beans)
  morningWaterGoal: 'Drink water toward daily goal (e.g. 2 glasses)',
  morningFoodSuggestion: 'Eat breakfast with a protein option (e.g. eggs, curd, dal, or beans)',
  
  // Afternoon: Drink water; eat lunch
  afternoonWaterGoal: 'Drink water (e.g. 2-3 glasses)',
  afternoonFoodSuggestion: 'Eat lunch',
  
  // Night: Drink water if wanted; eat dinner. No pressure to drink set amount before bed
  nightWaterGoal: 'Drink water if wanted (no set amount required before bed)',
  nightFoodSuggestion: 'Eat dinner',
  
  // Wash schedule: Monday & Thursday mornings default
  washEnabled: true,
  washDays: [1, 4], // 1 = Monday, 4 = Thursday
  washPostCareTip: 'After washing: Apply conditioner to mid-lengths and ends, and pat dry gently with a soft towel (avoid harsh rubbing).',
  
  // Daily gentle care reminder
  dailyDetangleEnabled: true,
  dailyDetangleTip: 'Detangle gently starting at ends; avoid tight hairstyles that pull.',
  
  // Monthly progress photo
  monthlyPhotoPromptEnabled: true,
  
  // Quiet reminders
  remindersEnabled: false,
  morningReminderTime: '08:00',
  afternoonReminderTime: '13:00',
  nightReminderTime: '20:30',
  washReminderTime: '08:00',

  // Legacy field fallbacks
  morningWaterGlasses: 2,
  morningFood: 'Breakfast with protein (eggs, curd, dal, or beans)',
  afternoonWaterGlasses: 3,
  afternoonFood: 'Lunch',
  nightWaterGlasses: 2,
  nightFoodOptions: ['2 eggs', '10 almonds', 'A normal serving of fish']
};

export const DEFAULT_DAILY_CHECKLIST_STATE: DailyChecklistState = {
  date: new Date().toISOString().split('T')[0],
  morningWaterDone: false,
  morningFoodDone: false,
  morningWashDone: false,
  morningDetangleDone: false,
  morningSkipped: false,
  afternoonWaterDone: false,
  afternoonFoodDone: false,
  afternoonSkipped: false,
  nightWaterDone: false,
  nightFoodDone: false,
  nightSkipped: false,
  monthlyPhotoDismissedMonth: '',
  morningCompleted: false,
  afternoonCompleted: false,
  nightCompleted: false
};

export const EXAMPLE_PHOTOS: PhotoRecord[] = [
  {
    id: 'ex-1',
    date: '2026-01-10',
    timestamp: 1768000000000,
    zone: 'crown',
    zoneLabel: 'Crown / Vertex',
    imageUrl: '/assets/scans/crown_day1.jpg',
    notes: 'Reference Sample: Baseline crown angle taken under indirect natural window lighting.',
    lightingStatus: 'Balanced Daylight',
    distanceStatus: 'Approx. 25-30 cm',
    isExample: true
  },
  {
    id: 'ex-2',
    date: '2026-03-10',
    timestamp: 1773000000000,
    zone: 'crown',
    zoneLabel: 'Crown / Vertex',
    imageUrl: '/assets/scans/crown_week8.jpg',
    notes: 'Reference Sample: Follow-up angle matching the baseline parting and room lighting.',
    lightingStatus: 'Balanced Daylight',
    distanceStatus: 'Approx. 25-30 cm',
    isExample: true
  },
  {
    id: 'ex-3',
    date: '2026-06-10',
    timestamp: 1780000000000,
    zone: 'crown',
    zoneLabel: 'Crown / Vertex',
    imageUrl: '/assets/scans/crown_month6.jpg',
    notes: 'Reference Sample: 6-month check showing consistent camera angle for honest comparison.',
    lightingStatus: 'Balanced Daylight',
    distanceStatus: 'Approx. 25-30 cm',
    isExample: true
  }
];

export interface GuideTopic {
  id: string;
  category: string;
  title: string;
  summary: string;
  details: string[];
  keyAdvice: string;
  caution: string;
  sources: string[];
  reviewedDate: string;
  reviewerTitle: string;
}

export const GUIDE_TOPICS: GuideTopic[] = [
  {
    id: 'topic-shedding',
    category: 'Understanding Hair',
    title: 'Normal Daily Shedding vs Sudden Shedding',
    summary: 'Losing 50 to 100 strands a day is completely standard as old hairs make way for new growth.',
    details: [
      'Each hair follicle continuously cycles through growth (anagen), transition (catagen), and resting/shedding (telogen/exogen) phases.',
      'Telogen shedding often peaks 2 to 3 months after physical stressors like high fever, major surgery, severe illness, or rapid dietary shifts.',
      'Gentle handling and patience are key. Transient shedding usually self-resolves once the underlying stressor normalizes over 6-9 months.'
    ],
    keyAdvice: 'Track progress photos monthly rather than counting fallen hairs in the shower, as daily hair shed fluctuates naturally.',
    caution: 'If shedding is sudden, patchy, accompanied by scalp burning, redness, or pain, consult a board-certified dermatologist promptly.',
    sources: [
      'American Academy of Dermatology (AAD) Clinical Hair Care Guidelines',
      'Journal of the American Academy of Dermatology (JAAD) — Telogen Effluvium Overview'
    ],
    reviewedDate: 'September 2026',
    reviewerTitle: 'Evidence-Based Dermatology Reference Guidelines'
  },
  {
    id: 'topic-cleansing',
    category: 'Scalp Health',
    title: 'How Often Should You Wash Your Hair & Scalp?',
    summary: 'Washing frequency depends on your individual scalp sebum production, sweat, and daily activity level.',
    details: [
      'Oily scalps often benefit from daily or alternate-day gentle cleansing to prevent sebum buildup and Malassezia yeast overgrowth.',
      'Dry or sensitive scalps may prefer 2 to 3 times per week to preserve natural lipid moisture barriers.',
      'Always focus shampoo directly on the scalp skin itself, letting suds run down hair lengths during rinsing.'
    ],
    keyAdvice: 'Listen to your scalp comfort. If your scalp feels tight or dry, reduce wash frequency or use a gentler cleanser.',
    caution: 'Leaving thick oil or heavy buildup on an irritated, flaky scalp can worsen irritation and dermatitis.',
    sources: [
      'NHS UK — Scalp Hygiene & Seborrheic Dermatitis Management',
      'International Journal of Trichology — Scalp Sebum and Follicular Health'
    ],
    reviewedDate: 'September 2026',
    reviewerTitle: 'Clinical Hygiene & Sebum Management Reference'
  },
  {
    id: 'topic-ingredients',
    category: 'Ingredients & Care',
    title: 'Common Hair Care Actives & Safe Practices',
    summary: 'An honest look at popular topical ingredients: what they do and precautions to take.',
    details: [
      'Salicylic Acid (BHA): Helps gently loosen dead skin cells and clear pore buildup on flaky or oily scalps. Use 1-2 times weekly.',
      'Ketoconazole: An antifungal active often used in anti-dandruff care to target yeast balance. Use strictly as directed on product packaging.',
      'Rosemary Essential Oil: Often used for scalp invigoration. Must ALWAYS be diluted in a skin-friendly carrier oil (like jojoba or squalane) before scalp application.',
      'Peptides & Caffeine: Formulated in water-based scalp serums to support hair density appearance and scalp conditioning without residue.'
    ],
    keyAdvice: 'Always patch-test new serums or essential oil dilutions on your inner forearm 24 hours prior to scalp use.',
    caution: 'Never apply pure, undiluted essential oils directly to the scalp. If redness or burning develops, discontinue immediately.',
    sources: [
      'Cosmetic Ingredient Review (CIR) Safety Assessment',
      'British Association of Dermatologists (BAD) Contact Allergy Advice'
    ],
    reviewedDate: 'September 2026',
    reviewerTitle: 'Topical Hair Formulation Safety Review'
  },
  {
    id: 'topic-breakage',
    category: 'Hair Fiber Care',
    title: 'Preventing Mechanical Friction & Breakage',
    summary: 'Split ends and snapped fibers are caused by mechanical wear rather than follicle root issues.',
    details: [
      'Wet hair is at its most fragile because hydrogen bonds are temporarily stretched. Detangle gently starting from the bottom ends with plenty of slip.',
      'Avoid tight ponytails, tight braids, or heavy extensions that pull on hairline follicles (traction tension).',
      'Smooth pillowcases (silk, satin, or soft bamboo) reduce nocturnal friction, fraying, and tangling during sleep.'
    ],
    keyAdvice: 'Use wide-tooth combs and scrunchies made with soft fabric to protect strand integrity.',
    caution: 'Limit high-temperature heat styling (blow dryers on high, flat irons). Always apply a heat protectant when styling.',
    sources: [
      'American Academy of Dermatology (AAD) — Hair Breakage & Damage Prevention',
      'Journal of Cosmetic Dermatology — Tensile Properties of Human Hair Fiber'
    ],
    reviewedDate: 'September 2026',
    reviewerTitle: 'Fiber Integrity & Mechanical Care Guidelines'
  },
  {
    id: 'topic-medical',
    category: 'Medical Safety',
    title: 'When to Consult a Certified Dermatologist',
    summary: 'When hair or scalp symptoms require a medical doctor rather than a routine tracker.',
    details: [
      'Coin-sized round bald patches that appear suddenly (may indicate Alopecia Areata).',
      'Persistent scalp pain, burning, tenderness, crusting, or fluid-filled bumps.',
      'Rapid hairline or vertex recession occurring over a few short weeks.',
      'Noticeable eyebrow or eyelash loss alongside scalp hair changes.'
    ],
    keyAdvice: 'Board-certified dermatologists can perform dermoscopy, blood panels (ferritin, thyroid, vitamin D), and scalp evaluations to provide an accurate clinical diagnosis.',
    caution: 'HAIR OS is an educational tracker and photo journal. It does not provide medical diagnosis, clinical staging, or prescription treatment.',
    sources: [
      'American Academy of Dermatology (AAD) — Diagnostic Criteria for Alopecia',
      'British Association of Dermatologists (BAD) — Guidelines for the Management of Alopecia'
    ],
    reviewedDate: 'September 2026',
    reviewerTitle: 'Clinical Dermatology Red Flags & Diagnostic Thresholds'
  }
];

export const DEFAULT_SHELF_PRODUCTS: ShelfProduct[] = [
  {
    id: 'shelf-1',
    name: 'Gentle Rosemary Scalp Cleanser',
    brand: 'Botanical Labs',
    category: 'shampoo',
    status: 'in_use',
    ingredients: 'Aqua, Cocamidopropyl Betaine, Decyl Glucoside, Glycerin, Rosmarinus Officinalis Leaf Oil, Panthenol',
    cleanScore: 95,
    notes: 'Gentle sulfate-free wash for regular wash days.'
  },
  {
    id: 'shelf-2',
    name: 'Moisture Silk Hair Conditioner',
    brand: 'Strand Care',
    category: 'conditioner',
    status: 'in_use',
    ingredients: 'Water, Cetearyl Alcohol, Stearyl Alcohol, Behentrimonium Chloride, Argania Spinosa Kernel Oil, Glycerin',
    cleanScore: 88,
    notes: 'Apply only to mid-lengths and ends; avoid scalp pores.'
  }
];

