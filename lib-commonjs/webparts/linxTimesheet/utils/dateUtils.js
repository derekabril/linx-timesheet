"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getISOWeekNumber = getISOWeekNumber;
exports.getWeekStart = getWeekStart;
exports.getWeekEnd = getWeekEnd;
exports.toDateString = toDateString;
exports.formatDisplayDate = formatDisplayDate;
exports.formatTime = formatTime;
exports.calculateHours = calculateHours;
exports.getWeekDates = getWeekDates;
exports.isSameDay = isSameDay;
exports.getBusinessDays = getBusinessDays;
exports.buildTimeString = buildTimeString;
exports.combineDateAndTime = combineDateAndTime;
/**
 * Get week number for a given date (Sunday-start weeks).
 */
function getISOWeekNumber(date) {
    var target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var jan1 = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    var jan1Day = jan1.getUTCDay();
    var dayOfYear = Math.floor((target.getTime() - jan1.getTime()) / 86400000);
    return Math.floor((dayOfYear + jan1Day) / 7) + 1;
}
/**
 * Get the Sunday (start) of the week containing the given date.
 */
function getWeekStart(date) {
    var d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
}
/**
 * Get the Saturday (end) of the week containing the given date.
 */
function getWeekEnd(date) {
    var start = getWeekStart(date);
    var end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
}
/**
 * Format a date as YYYY-MM-DD (SharePoint date-only format).
 */
function toDateString(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return "".concat(y, "-").concat(m, "-").concat(d);
}
/**
 * Format a date as a display string, e.g., "Mon, Mar 3, 2026".
 */
function formatDisplayDate(dateStr) {
    var date = new Date(dateStr);
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
function formatTime(dateTimeStr) {
    if (!dateTimeStr)
        return "--";
    var date = new Date(dateTimeStr);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}
/**
 * Calculate hours between two datetime strings (break time is included in total).
 */
function calculateHours(clockIn, clockOut) {
    var start = new Date(clockIn).getTime();
    var end = new Date(clockOut).getTime();
    var diffMs = end - start;
    var diffHours = diffMs / (1000 * 60 * 60);
    return Math.max(0, Math.round(diffHours * 100) / 100);
}
/**
 * Get all dates in a week (Mon-Sun) for a given date.
 */
function getWeekDates(date) {
    var start = getWeekStart(date);
    var dates = [];
    for (var i = 0; i < 7; i++) {
        var d = new Date(start);
        d.setDate(start.getDate() + i);
        dates.push(d);
    }
    return dates;
}
/**
 * Check if two dates are the same calendar day.
 */
function isSameDay(a, b) {
    return (a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate());
}
/**
 * Get business days between two dates (excludes weekends).
 */
function getBusinessDays(start, end) {
    var count = 0;
    var cur = new Date(start);
    while (cur <= end) {
        var day = cur.getDay();
        if (day !== 0 && day !== 6)
            count++;
        cur.setDate(cur.getDate() + 1);
    }
    return count;
}
/**
 * Build a time-of-day string like "08:30" from hours and minutes.
 */
function buildTimeString(hours, minutes) {
    return "".concat(String(hours).padStart(2, "0"), ":").concat(String(minutes).padStart(2, "0"));
}
/**
 * Combine a date string (YYYY-MM-DD) with a time string (HH:MM) into an ISO datetime.
 */
function combineDateAndTime(dateStr, timeStr) {
    return new Date("".concat(dateStr, "T").concat(timeStr, ":00")).toISOString();
}
//# sourceMappingURL=dateUtils.js.map