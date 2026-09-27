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

export interface ReminderSettings {
  enabled: boolean;
  morningTime: string;
  eveningTime: string;
  showerDayReminder: boolean;
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
}
