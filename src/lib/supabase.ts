import { createClient } from '@supabase/supabase-js';

// Fill these in your .env file (see README step 5).
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---- Example functions (wire these into src/store.ts when you're ready) ----
// The app works fully offline with AsyncStorage; Supabase is for cloud sync.

export async function fetchHabitsFromCloud() {
  const { data, error } = await supabase.from('habits').select('*');
  if (error) console.warn('fetchHabits error', error.message);
  return data ?? [];
}

export async function pushHabitToCloud(habit: any) {
  const { error } = await supabase.from('habits').upsert(habit);
  if (error) console.warn('pushHabit error', error.message);
}

export async function toggleHabitOnCloud(id: string, completedDates: string[]) {
  const { error } = await supabase.from('habits').update({ completed_dates: completedDates }).eq('id', id);
  if (error) console.warn('toggleHabit error', error.message);
}
