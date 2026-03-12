"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatHours = formatHours;
exports.formatHoursHHMM = formatHoursHHMM;
exports.formatTimerDisplay = formatTimerDisplay;
exports.secondsToHours = secondsToHours;
/**
 * Format decimal hours into "Xh Ym" display string.
 * e.g., 8.5 -> "8h 30m", 0.25 -> "15m", 10 -> "10h"
 */
function formatHours(decimalHours) {
    if (decimalHours <= 0)
        return "0h";
    var hours = Math.floor(decimalHours);
    var minutes = Math.round((decimalHours - hours) * 60);
    if (hours === 0)
        return "".concat(minutes, "m");
    if (minutes === 0)
        return "".concat(hours, "h");
    return "".concat(hours, "h ").concat(minutes, "m");
}
/**
 * Format decimal hours as HH:MM string.
 * e.g., 8.5 -> "08:30"
 */
function formatHoursHHMM(decimalHours) {
    var hours = Math.floor(decimalHours);
    var minutes = Math.round((decimalHours - hours) * 60);
    return "".concat(String(hours).padStart(2, "0"), ":").concat(String(minutes).padStart(2, "0"));
}
/**
 * Format seconds into HH:MM:SS for timer display.
 */
function formatTimerDisplay(totalSeconds) {
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    return "".concat(String(hours).padStart(2, "0"), ":").concat(String(minutes).padStart(2, "0"), ":").concat(String(seconds).padStart(2, "0"));
}
/**
 * Convert seconds to decimal hours.
 */
function secondsToHours(seconds) {
    return Math.round((seconds / 3600) * 100) / 100;
}
//# sourceMappingURL=hoursFormatter.js.map