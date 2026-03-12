"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryCards = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var TimesheetContext_1 = require("../../context/TimesheetContext");
var AppContext_1 = require("../../context/AppContext");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var useLeaveRequests_1 = require("../../hooks/useLeaveRequests");
var overtimeCalculator_1 = require("../../utils/overtimeCalculator");
var leaveCalculator_1 = require("../../utils/leaveCalculator");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var enums_1 = require("../../models/enums");
var SummaryCards = function () {
    var _a = (0, TimesheetContext_1.useTimesheetContext)(), weekEntries = _a.weekEntries, currentSubmission = _a.currentSubmission, selectedWeek = _a.selectedWeek;
    var _b = (0, AppContext_1.useAppContext)(), currentUser = _b.currentUser, configuration = _b.configuration;
    var _c = (0, useAppTheme_1.useAppTheme)(), colors = _c.colors, theme = _c.theme;
    var year = new Date().getFullYear();
    var requests = (0, useLeaveRequests_1.useLeaveRequests)((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || null, year).requests;
    var overtime = (0, overtimeCalculator_1.calculateOvertime)(weekEntries, configuration);
    var balances = (0, leaveCalculator_1.calculateLeaveBalances)(requests, configuration);
    var vacationBalance = balances.find(function (b) { return b.leaveType === enums_1.LeaveType.Vacation; });
    var cardStyle = function (accentColor) { return ({
        padding: "16px 20px",
        borderRadius: 8,
        backgroundColor: colors.bgCard,
        border: "1px solid ".concat(theme.semanticColors.bodyDivider),
        borderLeft: "4px solid ".concat(accentColor),
        minWidth: 180,
        flex: "1 1 180px",
    }); };
    return (React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 16 }, wrap: true },
        React.createElement("div", { style: cardStyle(colors.textLink) },
            React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "This Week"),
            React.createElement(Text_1.Text, { variant: "xxLarge", block: true, styles: { root: { fontWeight: 700, color: colors.textLink } } }, (0, hoursFormatter_1.formatHours)(overtime.totalHours)),
            React.createElement(Text_1.Text, { variant: "tiny", styles: { root: { color: colors.textTertiary } } },
                "Week ",
                selectedWeek.weekNumber)),
        React.createElement("div", { style: cardStyle(colors.textSuccess) },
            React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Regular Hours"),
            React.createElement(Text_1.Text, { variant: "xxLarge", block: true, styles: { root: { fontWeight: 700, color: colors.textSuccess } } }, (0, hoursFormatter_1.formatHours)(overtime.regularHours))),
        React.createElement("div", { style: cardStyle(colors.textWarning) },
            React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Overtime"),
            React.createElement(Text_1.Text, { variant: "xxLarge", block: true, styles: { root: { fontWeight: 700, color: colors.textWarning } } }, (0, hoursFormatter_1.formatHours)(overtime.overtimeHours))),
        React.createElement("div", { style: cardStyle(colors.textAccent) },
            React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Vacation Balance"),
            React.createElement(Text_1.Text, { variant: "xxLarge", block: true, styles: { root: { fontWeight: 700, color: colors.textAccent } } }, vacationBalance ? "".concat(vacationBalance.remaining, "d") : "--")),
        React.createElement("div", { style: cardStyle(currentSubmission ? colors.textSuccess : colors.textWarning) },
            React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Submission"),
            React.createElement(Text_1.Text, { variant: "large", block: true, styles: { root: { fontWeight: 700, color: currentSubmission ? colors.textSuccess : colors.textWarning } } }, (currentSubmission === null || currentSubmission === void 0 ? void 0 : currentSubmission.Status) || "Not Submitted"))));
};
exports.SummaryCards = SummaryCards;
//# sourceMappingURL=SummaryCards.js.map