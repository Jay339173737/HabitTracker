import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Habit = {
  id: string;
  name: string;
  description?: string;
  icon: string; // emoji is fine for the MVP
  color: string;
  routineId?: string;
  frequency: 'once' | 'daily';
  completedDates: string[]; // 'YYYY-MM-DD'
};

export type Routine = {
  id: string;
  title: string;
  description: string;
  category: 'Productivity' | 'Mental Wellbeing';
  habitCount: number;
  premium?: boolean;
};

export type Note = {
  id: string;
  text: string;
  date: string;
};

type State = {
  habits: Habit[];
  routines: Routine[];
  notes: Note[];
  loaded: boolean;
  load: () => Promise<void>;
  addHabit: (h: Omit<Habit, 'id' | 'completedDates'>) => void;
  toggleHabit: (id: string, date: string) => void;
  addNote: (text: string) => void;
};

const DEFAULT_ROUTINES: Routine[] = [
  { id: '1', title: 'Simple Productive Day', description: 'A clear five-step routine for planning and focused work.', category: 'Productivity', habitCount: 5 },
  { id: '2', title: 'Deep Focus System', description: 'A complete premium routine for one deep work session.', category: 'Productivity', habitCount: 5, premium: true },
  { id: '3', title: 'Focus Starter', description: 'Three simple actions for a focused work session.', category: 'Productivity', habitCount: 3 },
  { id: '4', title: 'Mindful Productivity', description: 'A premium routine combining meditation and focused work.', category: 'Mental Wellbeing', habitCount: 4, premium: true },
];

export const useStore = create<State>((set) => ({
  habits: [],
  routines: DEFAULT_ROUTINES,
  notes: [],
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem('habittracker-data');
      if (raw) {
        const data = JSON.parse(raw);
        set({ habits: data.habits ?? [], notes: data.notes ?? [] });
      }
    } catch (e) {
      console.warn('Failed to load data', e);
    }
    set({ loaded: true });
  },

  addHabit: (h) => {
    set((s) => ({
      habits: [...s.habits, { ...h, id: Date.now().toString(), completedDates: [] }],
    }));
    persist();
  },

  toggleHabit: (id, date) => {
    set((s) => ({
      habits: s.habits.map((h) =>
        h.id === id
          ? {
              ...h,
              completedDates: h.completedDates.includes(date)
                ? h.completedDates.filter((d) => d !== date)
                : [...h.completedDates, date],
            }
          : h
      ),
    }));
    persist();
  },

  addNote: (text) => {
    set((s) => ({
      notes: [
        { id: Date.now().toString(), text, date: new Date().toISOString().slice(0, 10) },
        ...s.notes,
      ],
    }));
    persist();
  },
}));

function persist() {
  const { habits, notes } = useStore.getState();
  AsyncStorage.setItem('habittracker-data', JSON.stringify({ habits, notes })).catch(() => {});
}

// Optional Supabase sync hooks live in src/lib/supabase.ts (wire them up later).
