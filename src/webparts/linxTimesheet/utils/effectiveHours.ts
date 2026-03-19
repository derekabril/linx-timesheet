import { ITimeEntry } from "../models/ITimeEntry";
import { EntryType, EntryStatus } from "../models/enums";

/**
 * Calculate effective hours from a set of time entries, avoiding double-counting
 * when Clock (attendance) entries overlap with Timer/Manual (task) entries.
 *
 * Per day: effective hours = max(clockHours, taskHours).
 * - Clock-only day: uses the clock hours (attendance umbrella).
 * - Task-only day: uses the task hours (no clock entry recorded).
 * - Both: clock hours already contain the task time, so take the larger value.
 */
export function calculateEffectiveHours(entries: ITimeEntry[]): number {
  const byDate = getEffectiveHoursByDate(entries);
  let total = 0;
  for (const hours of byDate.values()) {
    total += hours;
  }
  return Math.round(total * 100) / 100;
}

/**
 * Calculate effective hours grouped by date, avoiding double-counting.
 * Returns a Map of date string -> effective hours.
 */
export function getEffectiveHoursByDate(entries: ITimeEntry[]): Map<string, number> {
  const active = entries.filter((e) => e.Status !== EntryStatus.Voided);

  const clockByDate = new Map<string, number>();
  const taskByDate = new Map<string, number>();

  for (const entry of active) {
    if (entry.EntryType === EntryType.Clock) {
      clockByDate.set(entry.EntryDate, (clockByDate.get(entry.EntryDate) || 0) + entry.TotalHours);
    } else {
      taskByDate.set(entry.EntryDate, (taskByDate.get(entry.EntryDate) || 0) + entry.TotalHours);
    }
  }

  const result = new Map<string, number>();
  const allDates = new Set([...clockByDate.keys(), ...taskByDate.keys()]);

  for (const date of allDates) {
    const clockHours = clockByDate.get(date) || 0;
    const taskHours = taskByDate.get(date) || 0;
    result.set(date, Math.max(clockHours, taskHours));
  }

  return result;
}
