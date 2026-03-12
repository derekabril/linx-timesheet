"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeeklyReport = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DetailsList_1 = require("@fluentui/react/lib/DetailsList");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var TimesheetContext_1 = require("../../context/TimesheetContext");
var AppContext_1 = require("../../context/AppContext");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var dateUtils_1 = require("../../utils/dateUtils");
var overtimeCalculator_1 = require("../../utils/overtimeCalculator");
var WeeklyReport = function () {
    var weekEntries = (0, TimesheetContext_1.useTimesheetContext)().weekEntries;
    var configuration = (0, AppContext_1.useAppContext)().configuration;
    var overtime = (0, overtimeCalculator_1.calculateOvertime)(weekEntries, configuration);
    var columns = [
        {
            key: "date",
            name: "Date",
            minWidth: 140,
            maxWidth: 180,
            onRender: function (item) { return (0, dateUtils_1.formatDisplayDate)(item.date); },
        },
        {
            key: "total",
            name: "Total Hours",
            minWidth: 90,
            maxWidth: 110,
            onRender: function (item) { return (0, hoursFormatter_1.formatHours)(item.totalHours); },
        },
        {
            key: "regular",
            name: "Regular",
            minWidth: 80,
            maxWidth: 100,
            onRender: function (item) { return (0, hoursFormatter_1.formatHours)(item.regularHours); },
        },
        {
            key: "overtime",
            name: "Overtime",
            minWidth: 80,
            maxWidth: 100,
            onRender: function (item) { return (React.createElement(Text_1.Text, { styles: { root: { color: item.overtimeHours > 0 ? "#d83b01" : undefined } } }, (0, hoursFormatter_1.formatHours)(item.overtimeHours))); },
        },
    ];
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Daily Breakdown"),
        React.createElement(DetailsList_1.DetailsList, { items: overtime.dailyBreakdown, columns: columns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none, compact: true }),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 24 }, styles: {
                root: { padding: "8px 0", borderTop: "2px solid #edebe9", fontWeight: 600 },
            } },
            React.createElement(Text_1.Text, null,
                "Total: ",
                (0, hoursFormatter_1.formatHours)(overtime.totalHours)),
            React.createElement(Text_1.Text, null,
                "Regular: ",
                (0, hoursFormatter_1.formatHours)(overtime.regularHours)),
            React.createElement(Text_1.Text, { styles: { root: { color: overtime.overtimeHours > 0 ? "#d83b01" : undefined } } },
                "Overtime: ",
                (0, hoursFormatter_1.formatHours)(overtime.overtimeHours)))));
};
exports.WeeklyReport = WeeklyReport;
//# sourceMappingURL=WeeklyReport.js.map