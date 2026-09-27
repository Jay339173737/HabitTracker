import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export type Habit = {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  routineId?: string;
  frequency: "once" | "daily";
  completedDates: string[];
};

export type RoutineHabit = {
  name: string;
  icon: string;
  color: string;
  requirement: string;
  recurrence: string;
  frequency: "once" | "daily";
};

export type Routine = {
  id: string;
  title: string;
  description: string;
  category: "Productivity" | "Mental Wellbeing";
  habitCount: number;
  premium?: boolean;
  color?: string;
  habits: RoutineHabit[];
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
  addHabit: (h: Omit<Habit, "id" | "completedDates">) => void;
  addHabitsFromTemplates: (
    list: Omit<Habit, "id" | "completedDates">[],
  ) => void;
  toggleHabit: (id: string, date: string) => void;
  addNote: (text: string) => void;
};

const DEFAULT_ROUTINES: Routine[] = [
  {
    id: "1",
    title: "Simple Productive Day",
    description: "A clear five-step routine for planning and focused work.",
    category: "Productivity",
    habitCount: 5,
    color: "#5B7FD1",
    habits: [
      {
        name: "Write Your Top 3 Tasks",
        icon: "📝",
        color: "#EDEDED",
        requirement: "Once",
        recurrence: "Everyday",
        frequency: "daily",
      },
      {
        name: "Focus for 25 Minutes",
        icon: "⏰",
        color: "#DCE6FA",
        requirement: "At least 25m 0s",
        recurrence: "Everyday",
        frequency: "daily",
      },
      {
        name: "Take a 5-Minute Screen Break",
        icon: "📱",
        color: "#DCF3EC",
        requirement: "At least 5m 0s",
        recurrence: "Everyday",
        frequency: "daily",
      },
      {
        name: "Clear Your Desk",
        icon: "💼",
        color: "#EDEDED",
        requirement: "Once",
        recurrence: "Everyday",
        frequency: "daily",
      },
      // 5th habit — placeholder to complete the set of 5, rename freely
      {
        name: "Review Tomorrow's Top Task",
        icon: "🗒️",
        color: "#EDEDED",
        requirement: "Once",
        recurrence: "Everyday",
        frequency: "daily",
      },
    ],
  },
  {
    id: "2",
    title: "Deep Focus System",
    description: "A complete premium routine for one deep work session.",
    category: "Productivity",
    habitCount: 5,
    premium: true,
    color: "#CC8800",
    habits: [
      {
        name: "Write Your Top 3 Tasks",
        icon: "📝",
        color: "#EDEDED",
        requirement: "Once",
        recurrence: "Everyday",
        frequency: "daily",
      },
      {
        name: "Silence Notifications",
        icon: "🔕",
        color: "#EDEDED",
        requirement: "Once",
        recurrence: "Everyday",
        frequency: "daily",
      },
      {
        name: "Focus for 25 Minutes",
        icon: "⏰",
        color: "#DCE6FA",
        requirement: "At least 25m 0s",
        recurrence: "Everyday",
        frequency: "daily",
      },
      {
        name: "Take a 5-Minute Screen Break",
        icon: "📱",
        color: "#DCF3EC",
        requirement: "At least 5m 0s",
        recurrence: "Everyday",
        frequency: "daily",
      },
      {
        name: "Take a 10-Minute Walk",
        icon: "🚶",
        color: "#DCF3EC",
        requirement: "At least 10m 0s",
        recurrence: "Everyday",
        frequency: "daily",
      },
    ],
  },
  {
    id: "3",
    title: "Focus Starter",
    description: "Three simple actions for a focused work session.",
    category: "Productivity",
    habitCount: 3,
    color: "#5B7FD1",
    habits: [
      {
        name: "Write Your Top 3 Tasks",
        icon: "📝",
        color: "#EDEDED",
        requirement: "Once",
        recurrence: "Everyday",
        frequency: "daily",
      },
      {
        name: "Focus for 25 Minutes",
        icon: "⏰",
        color: "#DCE6FA",
        requirement: "At least 25m 0s",
        recurrence: "Everyday",
        frequency: "daily",
      },
      {
        name: "Clear Your Desk",
        icon: "💼",
        color: "#EDEDED",
        requirement: "Once",
        recurrence: "Everyday",
        frequency: "daily",
      },
    ],
  },
  {
    id: "4",
    title: "Mindful Productivity",
    description: "A premium routine combining meditation and focused work.",
    category: "Mental Wellbeing",
    habitCount: 4,
    premium: true,
    color: "#AA00AA",
    habits: [
      {
        name: "Meditate for 10 Minutes",
        icon: "🧘",
        color: "#EEE3F5",
        requirement: "At least 10m 0s",
        recurrence: "Everyday",
        frequency: "daily",
      },
      {
        name: "Write Your Top 3 Tasks",
        icon: "📝",
        color: "#EDEDED",
        requirement: "Once",
        recurrence: "Everyday",
        frequency: "daily",
      },
      {
        name: "Focus for 25 Minutes",
        icon: "⏰",
        color: "#DCE6FA",
        requirement: "At least 25m 0s",
        recurrence: "Everyday",
        frequency: "daily",
      },
      {
        name: "Reflect in Journal",
        icon: "📓",
        color: "#EDEDED",
        requirement: "Once",
        recurrence: "Everyday",
        frequency: "daily",
      },
    ],
  },
];

export const useStore = create<State>((set) => ({
  habits: [],
  routines: DEFAULT_ROUTINES,
  notes: [],
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem("habittracker-data");
      if (raw) {
        const data = JSON.parse(raw);
        set({ habits: data.habits ?? [], notes: data.notes ?? [] });
      }
    } catch (e) {
      console.warn("Failed to load data", e);
    }
    set({ loaded: true });
  },

  addHabit: (h) => {
    set((s) => ({
      habits: [
        ...s.habits,
        { ...h, id: Date.now().toString(), completedDates: [] },
      ],
    }));
    persist();
  },

  addHabitsFromTemplates: (list) => {
    set((s) => ({
      habits: [
        ...s.habits,
        ...list.map((h, i) => ({
          ...h,
          id: `${Date.now()}-${i}`,
          completedDates: [],
        })),
      ],
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
          : h,
      ),
    }));
    persist();
  },

  addNote: (text) => {
    set((s) => ({
      notes: [
        {
          id: Date.now().toString(),
          text,
          date: new Date().toISOString().slice(0, 10),
        },
        ...s.notes,
      ],
    }));
    persist();
  },
}));

function persist() {
  const { habits, notes } = useStore.getState();
  AsyncStorage.setItem(
    "habittracker-data",
    JSON.stringify({ habits, notes }),
  ).catch(() => {});
}

// Optional Supabase sync hooks live in src/lib/supabase.ts (wire them up later).
