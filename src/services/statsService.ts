import { getCheckInsForHabit } from './checkInService';
import { getTodayKey, addDays, getWeekdayIndex } from './dateUtils';
import type { Habit, HeatmapDay } from '@/types/habit';

// % of the last `days` days that were completed (default: last 30).
export async function getCompletionRate(habitId: string, days = 30): Promise<number> {
  const completed = new Set(await getCheckInsForHabit(habitId));
  const today = getTodayKey();
  let completedCount = 0;

  for (let i = 0; i < days; i++) {
    const dateKey = addDays(today, -i);
    if (completed.has(dateKey)) completedCount += 1;
  }

  return Math.round((completedCount / days) * 100);
}

// GitHub-contribution-graph style data, oldest first.
export async function getHeatmapData(habitId: string, days = 90): Promise<HeatmapDay[]> {
  const completed = new Set(await getCheckInsForHabit(habitId));
  const today = getTodayKey();
  const data: HeatmapDay[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const dateKey = addDays(today, -i);
    data.push({ date: dateKey, completed: completed.has(dateKey) });
  }

  return data;
}

// Which weekday this habit gets completed on most — a nice "insight" line for the UI.
export async function getBestWeekday(habitId: string): Promise<string | null> {
  const completedDates = await getCheckInsForHabit(habitId);
  const counts = [0, 0, 0, 0, 0, 0, 0]; // Sun..Sat

  completedDates.forEach(dateKey => {
    counts[getWeekdayIndex(dateKey)] += 1;
  });

  const maxCount = Math.max(...counts);
  if (maxCount === 0) return null;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[counts.indexOf(maxCount)];
}

// JSON export — backs a "backup my data" / "share my progress" feature.
export async function exportHabitData(habits: Habit[]): Promise<string> {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    habits: [] as Array<Habit & { checkIns: string[] }>,
  };

  for (const habit of habits) {
    const checkIns = await getCheckInsForHabit(habit.id);
    exportPayload.habits.push({ ...habit, checkIns });
  }

  return JSON.stringify(exportPayload, null, 2);
}
