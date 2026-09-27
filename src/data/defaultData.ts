import { UserProfile, RoutineTask, PhotoRecord, ReminderSettings } from '../types';

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  scalpType: 'normal',
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

export const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: false,
  morningTime: '08:30',
  eveningTime: '20:30',
  showerDayReminder: true
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
}

export const GUIDE_TOPICS: GuideTopic[] = [
  {
    id: 'topic-shedding',
    category: 'Understanding Hair',
    title: 'Normal Daily Shedding vs Sudden Shedding',
    summary: 'Losing 50 to 100 strands a day is completely standard as old hairs make way for new growth.',
    details: [
      'Each hair follicle goes through growth (anagen), transition (catagen), and resting/shedding (telogen/exogen) phases.',
      'Telogen shedding often peaks 2 to 3 months after physical stressors like high fever, major surgery, severe illness, or rapid dietary changes.',
      'Gentle handling and patience are key. Transient shedding usually self-resolves once the underlying stressor normalizes.'
    ],
    keyAdvice: 'Track photos monthly rather than counting fallen hairs in the shower, as daily hair shed fluctuates naturally.',
    caution: 'If shedding is sudden, patchy, accompanied by scalp burning or pain, consult a dermatologist promptly.'
  },
  {
    id: 'topic-cleansing',
    category: 'Scalp Health',
    title: 'How Often Should You Wash Your Hair & Scalp?',
    summary: 'Washing frequency depends on your individual scalp sebum production and daily activity level.',
    details: [
      'Oily scalps often benefit from daily or alternate-day gentle cleansing to prevent sebum buildup and Malassezia overgrowth.',
      'Dry or sensitive scalps may prefer 2 to 3 times per week to preserve natural barrier lipids.',
      'Always focus shampoo on the scalp skin itself, letting suds run down hair lengths during rinsing.'
    ],
    keyAdvice: 'Listen to your scalp comfort. If your scalp feels tight or dry, reduce wash frequency or use a gentler cleanser.',
    caution: 'Leaving thick oil or buildup on an irritated, flaky scalp can worsen irritation.'
  },
  {
    id: 'topic-ingredients',
    category: 'Ingredients & Care',
    title: 'Common Hair Care Actives & Safe Practices',
    summary: 'An honest look at popular topical ingredients: what they do and precautions to take.',
    details: [
      'Salicylic Acid (BHA): Helps gently loosen dead skin cells and clear pore buildup on flaky or oily scalps. Use 1-2 times weekly.',
      'Ketoconazole: An antifungal active often used in anti-dandruff care to target yeast balance. Use as directed on product label.',
      'Rosemary Essential Oil: Often used for scalp invigoration. Must ALWAYS be diluted in a carrier oil (like jojoba) before scalp application.',
      'Peptides & Caffeine: Formulated in water-based scalp serums to support hair density appearance and scalp conditioning.'
    ],
    keyAdvice: 'Always patch-test new serums or essential oil dilutions on your inner forearm 24 hours prior to scalp use.',
    caution: 'Never apply pure, undiluted essential oils directly to the scalp. If redness or burning develops, discontinue immediately.'
  },
  {
    id: 'topic-breakage',
    category: 'Hair Fiber Care',
    title: 'Preventing Mechanical Friction & Breakage',
    summary: 'Split ends and snapped fibers are caused by mechanical wear rather than follicle root issues.',
    details: [
      'Wet hair is at its most fragile because hydrogen bonds are temporarily stretched. Detangle gently starting from the bottom ends.',
      'Avoid tight ponytails, tight braids, or heavy extensions that pull on hairline follicles (traction tension).',
      'Smooth pillowcases (silk, satin, or soft bamboo) reduce friction and tangling during sleep.'
    ],
    keyAdvice: 'Use wide-tooth combs and scrunchies with soft fabric to protect strand integrity.',
    caution: 'Limit high-temperature heat styling (blow dryers on high, flat irons). Always use a heat protectant when styling.'
  },
  {
    id: 'topic-medical',
    category: 'Medical Safety',
    title: 'When to Consult a Certified Dermatologist',
    summary: 'When hair or scalp symptoms require a medical doctor rather than a routine tracker.',
    details: [
      'Coin-sized round bald patches that appear suddenly (may indicate Alopecia Areata).',
      'Persistent scalp pain, burning, tenderness, crusting, or fluid-filled pimples.',
      'Rapid hairline or vertex recession over a few weeks.',
      'Noticeable eyebrow or eyelash loss alongside scalp hair loss.'
    ],
    keyAdvice: 'Board-certified dermatologists can perform dermoscopy, blood panels (ferritin, thyroid, vitamin D), and scalp biopsies to provide an accurate clinical diagnosis.',
    caution: 'HAIR OS is an educational tracker and photo journal. It does not provide medical diagnosis, clinical staging, or prescription treatment.'
  }
];
