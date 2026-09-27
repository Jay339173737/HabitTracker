import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as habitService from '@/services/habitService';
import * as checkInService from '@/services/checkInService';
import * as streakService from '@/services/streakService';
import { getTodayKey } from '@/services/dateUtils';
import type { Habit, NewHabitInput, StreakInfo } from '@/types/habit';

// This is the ONLY thing screens in src/app/ should need to import.
// Wrap the root layout in <HabitProvider>, then call useHabits() anywhere.

interface HabitContextValue {
  habits: Habit[];
  todayStatus: Record<string, boolean>;
  streaks: Record<string, StreakInfo>;
  loading: boolean;
  addHabit: (input: NewHabitInput) => Promise<void>;
  toggleToday: (habitId: string) => Promise<void>;
  removeHabit: (habitId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const HabitContext = createContext<HabitContextValue | null>(null);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayStatus, setTodayStatus] = useState<Record<string, boolean>>({});
  const [streaks, setStreaks] = useState<Record<string, StreakInfo>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const loadedHabits = await habitService.getHabits();
    const today = getTodayKey();

    const statusEntries = await Promise.all(
      loadedHabits.map(async (h): Promise<[string, boolean]> => [
        h.id,
        await checkInService.isCompletedOn(h.id, today),
      ])
    );
    const streakEntries = await Promise.all(
      loadedHabits.map(async (h): Promise<[string, StreakInfo]> => [
        h.id,
        {
          current: await streakService.getCurrentStreak(h.id),
          longest: await streakService.getLongestStreak(h.id),
        },
      ])
    );

    setHabits(loadedHabits);
    setTodayStatus(Object.fromEntries(statusEntries));
    setStreaks(Object.fromEntries(streakEntries));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addHabit = useCallback(
    async (input: NewHabitInput) => {
      await habitService.createHabit(input);
      await refresh();
    },
    [refresh]
  );

  const toggleToday = useCallback(
    async (habitId: string) => {
      await checkInService.toggleCheckIn(habitId, getTodayKey());
      await refresh(); // simplest correct approach — patch local state later if lists get large
    },
    [refresh]
  );

  const removeHabit = useCallback(
    async (habitId: string) => {
      await habitService.archiveHabit(habitId); // soft delete, keeps history for stats
      await refresh();
    },
    [refresh]
  );

  return (
    <HabitContext.Provider
      value={{ habits, todayStatus, streaks, loading, addHabit, toggleToday, removeHabit, refresh }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits(): HabitContextValue {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within a HabitProvider');
  return ctx;
}
