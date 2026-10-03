export type ScalpType = 'normal' | 'oily' | 'dry' | 'sensitive' | 'combination';
export type HairType = 'straight' | 'wavy' | 'curly' | 'coily';
export type HairGoal = 'gentle_maintenance' | 'shedding_care' | 'dryness_hydration' | 'length_retention';
export type PreferredTime = 'morning' | 'evening' | 'both' | 'flexible';

export type RoutineCategory = 'morning' | 'evening' | 'shower' | 'all_day';
export type RoutineFrequency = 'daily' | 'alternate' | 'weekly';
export type PhotoZone = 'crown' | 'temples' | 'part' | 'overall';

export interface UserProfile {
  name: string;
  scalpType: ScalpType;
  hairType?: HairType;
  hairGoal?: HairGoal;
  preferredTime?: PreferredTime;
  primaryFocus: string;
  washFrequency: string;
  onboardingCompleted: boolean;
  notes?: string;
}

export interface RoutineTask {
  id: string;
  title: string;
  category: RoutineCategory;
  frequency: RoutineFrequency;
  timeOfDay: string;
  whyItHelps: string;
  safetyNotes: string;
  completed: boolean;
  lastCompletedDate: string | null;
  dayOfWeek?: number | null;
}

export interface PhotoRecord {
  id: string;
  date: string;
  timestamp: number;
  zone: PhotoZone;
  zoneLabel: string;
  imageUrl: string;
  notes?: string;
  lightingStatus?: string;
  distanceStatus?: string;
  isExample?: boolean;
}

export interface ScalpCheck {
  id: string;
  date: string;
  timestamp: number;
  comfort: 'comfortable' | 'dry' | 'oily' | 'itchy' | 'sensitive';
  flakes: 'none' | 'minimal' | 'moderate';
  notes?: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  text: string;
  tags: string[];
}

export type NotificationPersona = 'clinical' | 'gentle' | 'coach';

export interface ReminderSettings {
  enabled: boolean;
  morningTime: string;
  eveningTime: string;
  showerDayReminder: boolean;
  // Upgraded Smart Notification suite
  persona?: NotificationPersona;
  vibration?: boolean;
  sound?: boolean;
  morningEnabled?: boolean;
  afternoonEnabled?: boolean;
  afternoonTime?: string;
  nightEnabled?: boolean;
  nightTime?: string;
  washDayEnabled?: boolean;
  washDays?: number[];
  washTime?: string;
  preWashEveEnabled?: boolean;
  preWashEveTime?: string;
  milestonePhotoEnabled?: boolean;
  patchTestAlertAt?: number | null;
  patchTestProductName?: string | null;
}

// Daily Food & Water and Scheduled Hair Wash Configuration
export interface DailyFoodWaterConfig {
  // Morning suggestions & goals
  morningWaterGoal: string;
  morningFoodSuggestion: string;
  
  // Afternoon suggestions & goals
  afternoonWaterGoal: string;
  afternoonFoodSuggestion: string;
  
  // Night suggestions & goals
  nightWaterGoal: string;
  nightFoodSuggestion: string;
  
  // Wash schedule
  washEnabled: boolean;
  washDays: number[]; // 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday. Default: [1, 4]
  washPostCareTip: string; // Conditioner and gentle drying advice
  
  // Daily gentle detangling reminder
  dailyDetangleEnabled: boolean;
  dailyDetangleTip: string;
  
  // Monthly progress photo
  monthlyPhotoPromptEnabled: boolean;
  
  // Reminder times & quiet alerts
  remindersEnabled: boolean;
  morningReminderTime: string;
  afternoonReminderTime: string;
  nightReminderTime: string;
  washReminderTime: string;

  // Legacy field compatibility
  morningWaterGlasses?: number;
  morningFood?: string;
  afternoonWaterGlasses?: number;
  afternoonFood?: string;
  nightWaterGlasses?: number;
  nightFoodOptions?: string[];
}

// Daily Checklist Completion State (resets per date)
export interface DailyChecklistState {
  date: string; // YYYY-MM-DD
  
  // Morning individual action checkboxes
  morningWaterDone: boolean;
  morningFoodDone: boolean;
  morningWashDone: boolean;
  morningDetangleDone?: boolean;
  morningSkipped: boolean; // "Skip today" without guilt
  
  // Afternoon individual action checkboxes
  afternoonWaterDone: boolean;
  afternoonFoodDone: boolean;
  afternoonSkipped: boolean; // "Skip today"
  
  // Night individual action checkboxes
  nightWaterDone: boolean;
  nightFoodDone: boolean;
  nightSkipped: boolean; // "Skip today"
  
  // Monthly progress photo dismissed month (YYYY-MM)
  monthlyPhotoDismissedMonth?: string;

  // Legacy compatibility fields
  morningCompleted?: boolean;
  afternoonCompleted?: boolean;
  nightCompleted?: boolean;
  nightFoodSelected?: string;
}

export interface ShelfProduct {
  id: string;
  name: string;
  brand: string;
  category: 'shampoo' | 'conditioner' | 'oil' | 'serum' | 'mask' | 'leave_in';
  status: 'in_use' | 'loved' | 'irritating' | 'wishlist';
  ingredients: string;
  cleanScore?: number;
  notes?: string;
}

export interface HairScanResult {
  frontPhotoUrl: string;
  topPhotoUrl: string;
  sidePhotoUrl: string;
  scannedAt: string;
  hairType: 'Straight' | 'Wavy' | 'Curly' | 'Coily';
  texture: 'Fine' | 'Medium' | 'Coarse';
  scalpCondition: 'Oily' | 'Dry' | 'Balanced' | 'Sensitive';
  frizzLevel: 'Low' | 'Moderate' | 'High';
  flakingLevel: 'None' | 'Mild' | 'Noticeable';
  concerns: string[];
  overallScore: number;
}

export interface PlanDayHabit {
  id: string;
  title: string;
  category: 'wash' | 'condition' | 'hydrate' | 'nutrition' | 'night' | 'photo' | 'scalp';
  completed: boolean;
}

export interface PlanDay {
  dayNumber: number; // 1 to 30
  weekNumber: number; // 1 to 4
  phaseTitle: string;
  title: string;
  focus: string;
  habits: PlanDayHabit[];
  foodTip: string;
  hairTip: string;
  isMilestonePhotoDay?: boolean;
}

export interface ProductCheckResult {
  productName: string;
  brand: string;
  category: string;
  matchPercentage: number;
  verdict: 'Suitable for your current routine' | 'Highly recommended' | 'Use with caution' | 'Not recommended';
  verdictColor: 'emerald' | 'teal' | 'amber' | 'rose';
  goodPoints: string[];
  thingsToConsider: string[];
  howToUse: string;
}

export interface ExportDataPackage {
  app: string;
  version: string;
  exportedAt: string;
  profile: UserProfile;
  routines: RoutineTask[];
  photos: PhotoRecord[];
  scalpChecks: ScalpCheck[];
  diary: DiaryEntry[];
  reminders: ReminderSettings;
  foodWaterConfig?: DailyFoodWaterConfig;
  dailyChecklistState?: DailyChecklistState;
  shelfProducts?: ShelfProduct[];
  hairScanResult?: HairScanResult | null;
  thirtyDayPlan?: PlanDay[];
}
