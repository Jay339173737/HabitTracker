import { STORAGE_KEYS } from './storageKeys';
import { readJSON, writeJSON } from './storageService';
import { getTodayKey, getWeekdayIndex } from './dateUtils';
import type { Habit, NewHabitInput } from '@/types/habit';

function generateId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export async function getHabits(options?: { includeArchived?: boolean }): Promise<Habit[]> {
  const habits = await readJSON<Habit[]>(STORAGE_KEYS.HABITS, []);
  return options?.includeArchived ? habits : habits.filter(h => !h.archived);
}

export async function getHabitById(habitId: string): Promise<Habit | null> {
  const habits = await readJSON<Habit[]>(STORAGE_KEYS.HABITS, []);
  return habits.find(h => h.id === habitId) ?? null;
}

export async function createHabit(input: NewHabitInput): Promise<Habit> {
  const habits = await readJSON<Habit[]>(STORAGE_KEYS.HABITS, []);
  const newHabit: Habit = {
    id: generateId(),
    name: input.name,
    icon: input.icon ?? '✅',
    color: input.color ?? '#4F46E5',
    frequency: input.frequency ?? { type: 'daily' },
    createdAt: getTodayKey(),
    archived: false,
  };
  await writeJSON(STORAGE_KEYS.HABITS, [...habits, newHabit]);
  return newHabit;
}

export async function updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit | undefined> {
  const habits = await readJSON<Habit[]>(STORAGE_KEYS.HABITS, []);
  const next = habits.map(h => (h.id === habitId ? { ...h, ...updates } : h));
  await writeJSON(STORAGE_KEYS.HABITS, next);
  return next.find(h => h.id === habitId);
}

// Soft delete — keeps check-in history intact so past stats/streaks aren't lost.
export async function archiveHabit(habitId: string): Promise<Habit | undefined> {
  return updateHabit(habitId, { archived: true });
}

export async function restoreHabit(habitId: string): Promise<Habit | undefined> {
  return updateHabit(habitId, { archived: false });
}

// Hard delete — wipes the habit AND its check-in history. Use only for a real
// "delete forever" action; prefer archiveHabit() for the normal delete button.
export async function deleteHabitPermanently(habitId: string): Promise<void> {
  const habits = await readJSON<Habit[]>(STORAGE_KEYS.HABITS, []);
  await writeJSON(
    STORAGE_KEYS.HABITS,
    habits.filter(h => h.id !== habitId)
  );
}

// Is this habit "due" on a given date, based on its frequency rule?
// Useful for the today-screen so weekly habits don't show up on off days.
export function isHabitDueOn(habit: Habit, dateKey: string): boolean {
  switch (habit.frequency.type) {
    case 'daily':
      return true;
    case 'weekly':
      return habit.frequency.days.includes(getWeekdayIndex(dateKey));
    case 'custom':
      // Not locked to specific days — always available to check off.
      return true;
  }
}
