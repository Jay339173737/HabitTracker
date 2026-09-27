// Day-boundary helpers for the habit tracker.
// "Today" always means the calendar day in the DEVICE'S LOCAL time, not UTC —
// using `toISOString()` directly can silently roll a date back or forward a
// day depending on the user's timezone offset, so we build keys manually.

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Shifts a YYYY-MM-DD key by `amount` days (negative to go backward).
export function addDays(dateKey: string, amount: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + amount);
  return formatDateKey(date);
}

// Whole-day difference between two YYYY-MM-DD keys (endKey - startKey).
export function daysBetween(startKey: string, endKey: string): number {
  const [y1, m1, d1] = startKey.split('-').map(Number);
  const [y2, m2, d2] = endKey.split('-').map(Number);
  const start = new Date(y1, m1 - 1, d1);
  const end = new Date(y2, m2 - 1, d2);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

// 0 = Sunday ... 6 = Saturday, for a YYYY-MM-DD key.
export function getWeekdayIndex(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}
