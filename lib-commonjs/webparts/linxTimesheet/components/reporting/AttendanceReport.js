"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceReport = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var TimesheetContext_1 = require("../../context/TimesheetContext");
var AppContext_1 = require("../../context/AppContext");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var dateUtils_1 = require("../../utils/dateUtils");
var AttendanceReport = function () {
    var _a = (0, TimesheetContext_1.useTimesheetContext)(), weekEntries = _a.weekEntries, selectedWeek = _a.selectedWeek;
    var configuration = (0, AppContext_1.useAppContext)().configuration;
    var _b = (0, useAppTheme_1.useAppTheme)(), colors = _b.colors, theme = _b.theme;
    var clockEntries = weekEntries.filter(function (e) { return e.EntryType === "Clock" && e.ClockIn; });
    var lateArrivals = clockEntries.filter(function (e) {
        if (!e.ClockIn)
            return false;
        var clockInTime = new Date(e.ClockIn);
        return clockInTime.getHours() >= 9 && clockInTime.getMinutes() > 15;
    });
    var uniqueDays = new Set(weekEntries.map(function (e) { return e.EntryDate; }));
    var expectedDays = configuration.workingDaysPerWeek;
    var absentDays = expectedDays - uniqueDays.size;
    var dailyHours = new Map();
    weekEntries.forEach(function (e) {
        dailyHours.set(e.EntryDate, (dailyHours.get(e.EntryDate) || 0) + e.TotalHours);
    });
    var avgHours = dailyHours.size > 0
        ? Array.from(dailyHours.values()).reduce(function (a, b) { return a + b; }, 0) / dailyHours.size
        : 0;
    var cardStyle = {
        padding: "12px 16px",
        borderRadius: 8,
        backgroundColor: colors.bgCard,
        border: "1px solid ".concat(theme.semanticColors.bodyDivider),
    };
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 16 }, styles: { root: { paddingTop: 12 } } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } },
            "Attendance Patterns - Week ",
            selectedWeek.weekNumber),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 16 }, wrap: true },
            React.createElement("div", { style: cardStyle },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Days Present"),
                React.createElement(Text_1.Text, { variant: "xLarge", block: true, styles: { root: { fontWeight: 700, color: colors.textLink } } },
                    uniqueDays.size,
                    " / ",
                    expectedDays)),
            React.createElement("div", { style: cardStyle },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Absent Days"),
                React.createElement(Text_1.Text, { variant: "xLarge", block: true, styles: { root: { fontWeight: 700, color: absentDays > 0 ? colors.textError : colors.textSuccess } } }, Math.max(0, absentDays))),
            React.createElement("div", { style: cardStyle },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Late Arrivals"),
                React.createElement(Text_1.Text, { variant: "xLarge", block: true, styles: { root: { fontWeight: 700, color: lateArrivals.length > 0 ? colors.textWarning : colors.textSuccess } } }, lateArrivals.length)),
            React.createElement("div", { style: cardStyle },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Avg Daily Hours"),
                React.createElement(Text_1.Text, { variant: "xLarge", block: true, styles: { root: { fontWeight: 700 } } },
                    avgHours.toFixed(1),
                    "h"))),
        lateArrivals.length > 0 && (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
            React.createElement(Text_1.Text, { variant: "small", styles: { root: { fontWeight: 600, color: colors.textWarning } } }, "Late Arrivals:"),
            lateArrivals.map(function (entry) { return (React.createElement(Text_1.Text, { key: entry.Id, variant: "small", styles: { root: { color: colors.textSecondary } } },
                entry.EntryDate,
                " - Clocked in at ",
                (0, dateUtils_1.formatTime)(entry.ClockIn))); })))));
};
exports.AttendanceReport = AttendanceReport;
//# sourceMappingURL=AttendanceReport.js.map