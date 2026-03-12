"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeEntryList = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DetailsList_1 = require("@fluentui/react/lib/DetailsList");
var Button_1 = require("@fluentui/react/lib/Button");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var TimesheetContext_1 = require("../../context/TimesheetContext");
var useTimeEntries_1 = require("../../hooks/useTimeEntries");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var dateUtils_1 = require("../../utils/dateUtils");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var StatusBadge_1 = require("../common/StatusBadge");
var ConfirmDialog_1 = require("../common/ConfirmDialog");
var overtimeCalculator_1 = require("../../utils/overtimeCalculator");
var AppContext_1 = require("../../context/AppContext");
var TimeEntryList = function () {
    var _a = (0, TimesheetContext_1.useTimesheetContext)(), weekEntries = _a.weekEntries, currentSubmission = _a.currentSubmission, refreshWeekEntries = _a.refreshWeekEntries, selectedWeek = _a.selectedWeek;
    var configuration = (0, AppContext_1.useAppContext)().configuration;
    var voidEntry = (0, useTimeEntries_1.useTimeEntries)().voidEntry;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var _b = tslib_1.__read(React.useState(null), 2), deleteId = _b[0], setDeleteId = _b[1];
    var isLocked = currentSubmission !== null && currentSubmission.Status !== "Draft" && currentSubmission.Status !== "Rejected" && currentSubmission.Status !== "Cancelled";
    var overtime = (0, overtimeCalculator_1.calculateOvertime)(weekEntries, configuration);
    var handleVoid = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (deleteId === null)
                        return [2 /*return*/];
                    return [4 /*yield*/, voidEntry(deleteId)];
                case 1:
                    _a.sent();
                    setDeleteId(null);
                    return [4 /*yield*/, refreshWeekEntries()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var columns = [
        {
            key: "date",
            name: "Date",
            fieldName: "EntryDate",
            minWidth: 120,
            maxWidth: 150,
            onRender: function (item) { return (0, dateUtils_1.formatDisplayDate)(item.EntryDate); },
        },
        {
            key: "type",
            name: "Type",
            fieldName: "EntryType",
            minWidth: 60,
            maxWidth: 80,
        },
        {
            key: "clockIn",
            name: "Start",
            minWidth: 80,
            maxWidth: 100,
            onRender: function (item) { return (0, dateUtils_1.formatTime)(item.ClockIn); },
        },
        {
            key: "clockOut",
            name: "End",
            minWidth: 80,
            maxWidth: 100,
            onRender: function (item) { return (0, dateUtils_1.formatTime)(item.ClockOut); },
        },
        {
            key: "break",
            name: "Break",
            minWidth: 50,
            maxWidth: 60,
            onRender: function (item) { return "".concat(item.BreakMinutes, "m"); },
        },
        {
            key: "hours",
            name: "Hours",
            minWidth: 60,
            maxWidth: 80,
            onRender: function (item) { return (React.createElement(Text_1.Text, { styles: { root: { fontWeight: 600 } } }, (0, hoursFormatter_1.formatHours)(item.TotalHours))); },
        },
        {
            key: "project",
            name: "Project",
            minWidth: 120,
            maxWidth: 180,
            onRender: function (item) { return item.ProjectTitle || "--"; },
        },
        {
            key: "status",
            name: "Status",
            minWidth: 80,
            maxWidth: 100,
            onRender: function (item) { return React.createElement(StatusBadge_1.StatusBadge, { status: item.Status }); },
        },
        {
            key: "actions",
            name: "",
            minWidth: 40,
            maxWidth: 40,
            onRender: function (item) {
                return !isLocked && item.Status !== "Voided" ? (React.createElement(Button_1.IconButton, { iconProps: { iconName: "Delete" }, title: "Void entry", onClick: function () { return setDeleteId(item.Id); } })) : null;
            },
        },
    ];
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 } },
        React.createElement(Stack_1.Stack, { horizontal: true, horizontalAlign: "space-between", verticalAlign: "center" },
            React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } },
                "Week ",
                selectedWeek.weekNumber,
                ", ",
                selectedWeek.year),
            React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 16 } },
                React.createElement(Text_1.Text, { variant: "small" },
                    "Regular: ",
                    React.createElement("strong", null, (0, hoursFormatter_1.formatHours)(overtime.regularHours))),
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: overtime.overtimeHours > 0 ? colors.textWarning : undefined } } },
                    "Overtime: ",
                    React.createElement("strong", null, (0, hoursFormatter_1.formatHours)(overtime.overtimeHours))),
                React.createElement(Text_1.Text, { variant: "small" },
                    "Total: ",
                    React.createElement("strong", null, (0, hoursFormatter_1.formatHours)(overtime.totalHours))))),
        isLocked && (React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textWarning, fontStyle: "italic" } } }, "This week has been submitted and is locked for editing.")),
        React.createElement(DetailsList_1.DetailsList, { items: weekEntries, columns: columns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none, isHeaderVisible: true, compact: true }),
        React.createElement(ConfirmDialog_1.ConfirmDialog, { isOpen: deleteId !== null, title: "Void Time Entry", message: "Are you sure you want to void this time entry? This action cannot be undone.", confirmText: "Void", onConfirm: handleVoid, onCancel: function () { return setDeleteId(null); } })));
};
exports.TimeEntryList = TimeEntryList;
//# sourceMappingURL=TimeEntryList.js.map