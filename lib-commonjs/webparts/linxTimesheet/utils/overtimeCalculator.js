"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOvertime = calculateOvertime;
exports.isDailyOvertime = isDailyOvertime;
var tslib_1 = require("tslib");
var enums_1 = require("../models/enums");
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
function calculateOvertime(entries, config) {
    var e_1, _a, e_2, _b;
    var dailyThreshold = config.overtimeDailyThreshold;
    var weeklyThreshold = config.overtimeWeeklyThreshold;
    // Group hours by date, excluding voided entries
    var byDate = new Map();
    try {
        for (var entries_1 = tslib_1.__values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
            var entry = entries_1_1.value;
            if (entry.Status === enums_1.EntryStatus.Voided)
                continue;
            var key = entry.EntryDate;
            byDate.set(key, (byDate.get(key) || 0) + entry.TotalHours);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var dailyBreakdown = [];
    var weeklyRegular = 0;
    var weeklyOvertime = 0;
    try {
        // Apply daily threshold
        for (var byDate_1 = tslib_1.__values(byDate), byDate_1_1 = byDate_1.next(); !byDate_1_1.done; byDate_1_1 = byDate_1.next()) {
            var _c = tslib_1.__read(byDate_1_1.value, 2), date = _c[0], hours = _c[1];
            var dailyRegular = Math.min(hours, dailyThreshold);
            var dailyOT = Math.max(0, hours - dailyThreshold);
            weeklyRegular += dailyRegular;
            weeklyOvertime += dailyOT;
            dailyBreakdown.push({
                date: date,
                totalHours: hours,
                regularHours: dailyRegular,
                overtimeHours: dailyOT,
            });
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (byDate_1_1 && !byDate_1_1.done && (_b = byDate_1.return)) _b.call(byDate_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    // Apply weekly threshold on top of daily regular hours
    if (weeklyRegular > weeklyThreshold) {
        var additionalOT = weeklyRegular - weeklyThreshold;
        weeklyOvertime += additionalOT;
        weeklyRegular = weeklyThreshold;
    }
    // Sort breakdown by date
    dailyBreakdown.sort(function (a, b) { return a.date.localeCompare(b.date); });
    return {
        regularHours: Math.round(weeklyRegular * 100) / 100,
        overtimeHours: Math.round(weeklyOvertime * 100) / 100,
        totalHours: Math.round((weeklyRegular + weeklyOvertime) * 100) / 100,
        dailyBreakdown: dailyBreakdown,
    };
}
/**
 * Check if a single day's hours exceed the daily overtime threshold.
 */
function isDailyOvertime(totalHoursForDay, config) {
    return totalHoursForDay > config.overtimeDailyThreshold;
}
//# sourceMappingURL=overtimeCalculator.js.map