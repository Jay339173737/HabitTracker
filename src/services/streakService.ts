import { getCheckInsForHabit } from './checkInService';
import { getTodayKey, addDays } from './dateUtils';

// How many consecutive missed days are forgiven before a streak breaks.
// 0 = strict (any missed day breaks it). 1 = one grace day, Duolingo-style —
// makes the app feel less punishing without gutting the whole feature.
const STREAK_FREEZE_DAYS = 1;

export async function getCurrentStreak(habitId: string): Promise<number> {
  const completedDates = await getCheckInsForHabit(habitId);
  if (completedDates.length === 0) return 0;

  const completedSet = new Set(completedDates);
  const today = getTodayKey();

  // If today isn't checked off yet, start counting from yesterday so an
  // unfinished "today" doesn't zero out an otherwise-live streak.
  let cursor = completedSet.has(today) ? today : addDays(today, -1);
  let streak = 0;
  let freezesUsed = 0;

  while (true) {
    if (completedSet.has(cursor)) {
      streak += 1;
    } else if (freezesUsed < STREAK_FREEZE_DAYS) {
      freezesUsed += 1; // forgive this gap, keep counting backward
    } else {
      break;
    }
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export async function getLongestStreak(habitId: string): Promise<number> {
  const completedDates = await getCheckInsForHabit(habitId); // ascending
  if (completedDates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const gap = daysGap(completedDates[i - 1], completedDates[i]);
    if (gap <= 1 + STREAK_FREEZE_DAYS) {
      current += 1;
    } else {
      current = 1;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function daysGap(dateKeyA: string, dateKeyB: string): number {
  const a = new Date(dateKeyA);
  const b = new Date(dateKeyB);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

// Presentable, low-effort feature: which badges has this streak earned?
export function getMilestoneBadges(streak: number): number[] {
  const milestones = [7, 30, 100, 365];
  return milestones.filter(m => streak >= m);
}
