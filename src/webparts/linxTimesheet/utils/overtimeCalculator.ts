import { ITimeEntry } from "../models/ITimeEntry";
import { IAppConfiguration } from "../models/IConfiguration";
import { getEffectiveHoursByDate } from "./effectiveHours";

export interface IOvertimeResult {
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  dailyBreakdown: IDailyBreakdown[];
}

export interface IDailyBreakdown {
  date: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
}

/**
 * Calculate overtime for a set of time entries (typically one week).
 * Applies both daily and weekly thresholds.
 *
 * Logic:
 * 1. Sum hours per day
 * 2. Apply daily overtime threshold (e.g., anything over 8h/day)
 * 3. Sum all daily regular hours
 * 4. Apply weekly overtime threshold (e.g., anything over 40h/week)
 */
export function calculateOvertime(
  entries: ITimeEntry[],
  config: IAppConfiguration
): IOvertimeResult {
  const dailyThreshold = config.overtimeDailyThreshold;
  const weeklyThreshold = config.overtimeWeeklyThreshold;

  // Group hours by date, using effective hours to avoid Clock/Timer double-counting
  const byDate = getEffectiveHoursByDate(entries);

  const dailyBreakdown: IDailyBreakdown[] = [];
  let weeklyRegular = 0;
  let weeklyOvertime = 0;

  // Apply daily threshold
  for (const [date, hours] of byDate) {
    const dailyRegular = Math.min(hours, dailyThreshold);
    const dailyOT = Math.max(0, hours - dailyThreshold);
    weeklyRegular += dailyRegular;
    weeklyOvertime += dailyOT;
    dailyBreakdown.push({
      date,
      totalHours: hours,
      regularHours: dailyRegular,
      overtimeHours: dailyOT,
    });
  }

  // Apply weekly threshold on top of daily regular hours
  if (weeklyRegular > weeklyThreshold) {
    const additionalOT = weeklyRegular - weeklyThreshold;
    weeklyOvertime += additionalOT;
    weeklyRegular = weeklyThreshold;
  }

  // Sort breakdown by date
  dailyBreakdown.sort((a, b) => a.date.localeCompare(b.date));

  return {
    regularHours: Math.round(weeklyRegular * 100) / 100,
    overtimeHours: Math.round(weeklyOvertime * 100) / 100,
    totalHours: Math.round((weeklyRegular + weeklyOvertime) * 100) / 100,
    dailyBreakdown,
  };
}

/**
 * Check if a single day's hours exceed the daily overtime threshold.
 */
export function isDailyOvertime(
  totalHoursForDay: number,
  config: IAppConfiguration
): boolean {
  return totalHoursForDay > config.overtimeDailyThreshold;
}
