// Discriminated union so TypeScript can narrow `frequency.days` / `timesPerWeek`
// correctly based on `type`, without optional-property gymnastics elsewhere.
export type HabitFrequency =
  | { type: 'daily' }
  | { type: 'weekly'; days: number[] } // 0 (Sun) .. 6 (Sat)
  | { type: 'custom'; timesPerWeek: number };

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  createdAt: string; // YYYY-MM-DD
  archived: boolean;
}

export interface NewHabitInput {
  name: string;
  icon?: string;
  color?: string;
  frequency?: HabitFrequency;
}

export interface StreakInfo {
  current: number;
  longest: number;
}

// Check-ins are stored as: { [habitId]: { [dateKey: string]: true } }
// Only positive completions are stored — a missing key means "not completed".
export type CheckInLog = Record<string, true>;
export type CheckInStore = Record<string, CheckInLog>;

export interface HeatmapDay {
  date: string;
  completed: boolean;
}
