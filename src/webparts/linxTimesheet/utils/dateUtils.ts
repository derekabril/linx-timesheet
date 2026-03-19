/**
 * Get week number for a given date (Sunday-start weeks).
 */
export function getISOWeekNumber(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const jan1 = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const jan1Day = jan1.getUTCDay();
  const dayOfYear = Math.floor((target.getTime() - jan1.getTime()) / 86400000);
  return Math.floor((dayOfYear + jan1Day) / 7) + 1;
}

/**
 * Get the Sunday (start) of the week containing the given date.
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the Saturday (end) of the week containing the given date.
 */
export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Format a date as YYYY-MM-DD (SharePoint date-only format).
 */
export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Format a date as a display string, e.g., "Mon, Mar 3, 2026".
 */
export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a datetime string to time only, e.g., "8:30 AM".
 */
export function formatTime(dateTimeStr: string | null): string {
  if (!dateTimeStr) return "--";
  const date = new Date(dateTimeStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Calculate hours between two datetime strings, subtracting break time.
 */
export function calculateHours(
  clockIn: string,
  clockOut: string,
  breakMinutes: number = 0,
): number {
  const start = new Date(clockIn).getTime();
  const end = new Date(clockOut).getTime();
  const diffMs = end - start;
  const diffHours = (diffMs / (1000 * 60 * 60)) - (breakMinutes / 60);
  return Math.max(0, Math.round(diffHours * 100) / 100);
}

/**
 * Get all dates in a week (Mon-Sun) for a given date.
 */
export function getWeekDates(date: Date): Date[] {
  const start = getWeekStart(date);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
}

/**
 * Check if two dates are the same calendar day.
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Get business days between two dates (excludes weekends).
 */
export function getBusinessDays(start: Date, end: Date): number {
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

/**
 * Build a time-of-day string like "08:30" from hours and minutes.
 */
export function buildTimeString(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Combine a date string (YYYY-MM-DD) with a time string (HH:MM) into an ISO datetime.
 */
export function combineDateAndTime(dateStr: string, timeStr: string): string {
  return new Date(`${dateStr}T${timeStr}:00`).toISOString();
}
