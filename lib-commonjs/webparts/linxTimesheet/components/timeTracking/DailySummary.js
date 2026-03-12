"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailySummary = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var TimesheetContext_1 = require("../../context/TimesheetContext");
var AppContext_1 = require("../../context/AppContext");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var enums_1 = require("../../models/enums");
var statStyle = {
    textAlign: "center",
    padding: "8px 16px",
    minWidth: 100,
};
var DailySummary = function () {
    var todayEntries = (0, TimesheetContext_1.useTimesheetContext)().todayEntries;
    var configuration = (0, AppContext_1.useAppContext)().configuration;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var completedEntries = todayEntries.filter(function (e) { return e.Status !== enums_1.EntryStatus.Voided; });
    var totalHours = completedEntries.reduce(function (sum, e) { return sum + e.TotalHours; }, 0);
    var totalBreakMins = completedEntries.reduce(function (sum, e) { return sum + e.BreakMinutes; }, 0);
    var overtimeHours = Math.max(0, totalHours - configuration.overtimeDailyThreshold);
    var regularHours = totalHours - overtimeHours;
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 }, styles: { root: { padding: 16, borderRadius: 8, backgroundColor: colors.bgSection } } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Today's Summary"),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 24 }, wrap: true },
            React.createElement("div", { style: statStyle },
                React.createElement(Text_1.Text, { variant: "xxLarge", styles: { root: { fontWeight: 700, color: colors.textLink } } }, (0, hoursFormatter_1.formatHours)(totalHours)),
                React.createElement(Text_1.Text, { variant: "small", block: true, styles: { root: { color: colors.textSecondary } } }, "Total Hours")),
            React.createElement("div", { style: statStyle },
                React.createElement(Text_1.Text, { variant: "xxLarge", styles: { root: { fontWeight: 700, color: colors.textSuccess } } }, (0, hoursFormatter_1.formatHours)(regularHours)),
                React.createElement(Text_1.Text, { variant: "small", block: true, styles: { root: { color: colors.textSecondary } } }, "Regular")),
            React.createElement("div", { style: statStyle },
                React.createElement(Text_1.Text, { variant: "xxLarge", styles: { root: { fontWeight: 700, color: overtimeHours > 0 ? colors.textWarning : colors.textSecondary } } }, (0, hoursFormatter_1.formatHours)(overtimeHours)),
                React.createElement(Text_1.Text, { variant: "small", block: true, styles: { root: { color: colors.textSecondary } } }, "Overtime")),
            React.createElement("div", { style: statStyle },
                React.createElement(Text_1.Text, { variant: "xxLarge", styles: { root: { fontWeight: 700 } } },
                    totalBreakMins,
                    "m"),
                React.createElement(Text_1.Text, { variant: "small", block: true, styles: { root: { color: colors.textSecondary } } }, "Breaks")),
            React.createElement("div", { style: statStyle },
                React.createElement(Text_1.Text, { variant: "xxLarge", styles: { root: { fontWeight: 700 } } }, completedEntries.length),
                React.createElement(Text_1.Text, { variant: "small", block: true, styles: { root: { color: colors.textSecondary } } }, "Entries")))));
};
exports.DailySummary = DailySummary;
//# sourceMappingURL=DailySummary.js.map