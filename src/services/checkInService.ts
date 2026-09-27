import { STORAGE_KEYS } from './storageKeys';
import { readJSON, writeJSON } from './storageService';
import { getTodayKey } from './dateUtils';
import type { CheckInStore, CheckInLog } from '@/types/habit';

async function getAllCheckIns(): Promise<CheckInStore> {
  return readJSON<CheckInStore>(STORAGE_KEYS.CHECKINS, {});
}

export async function isCompletedOn(habitId: string, dateKey: string): Promise<boolean> {
  const all = await getAllCheckIns();
  return !!all[habitId]?.[dateKey];
}

// Flips completion state for one date. Calling this twice in a row just
// toggles back — so a laggy double-tap in the UI never double-counts a day.
export async function toggleCheckIn(habitId: string, dateKey: string = getTodayKey()): Promise<boolean> {
  const all = await getAllCheckIns();
  const habitLog: CheckInLog = { ...(all[habitId] || {}) };

  if (habitLog[dateKey]) {
    delete habitLog[dateKey]; // un-check
  } else {
    habitLog[dateKey] = true; // check off
  }

  const next: CheckInStore = { ...all, [habitId]: habitLog };
  await writeJSON(STORAGE_KEYS.CHECKINS, next);
  return !!habitLog[dateKey];
}

// Sorted ascending list of completed date keys — the shape every stats/streak
// calculation is built on.
export async function getCheckInsForHabit(habitId: string): Promise<string[]> {
  const all = await getAllCheckIns();
  return Object.keys(all[habitId] || {}).sort();
}

export async function deleteCheckInsForHabit(habitId: string): Promise<void> {
  const all = await getAllCheckIns();
  const next = { ...all };
  delete next[habitId];
  await writeJSON(STORAGE_KEYS.CHECKINS, next);
}
