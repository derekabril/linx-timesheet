"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitTimesheet = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Button_1 = require("@fluentui/react/lib/Button");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var TimesheetContext_1 = require("../../context/TimesheetContext");
var AppContext_1 = require("../../context/AppContext");
var useSubmissions_1 = require("../../hooks/useSubmissions");
var overtimeCalculator_1 = require("../../utils/overtimeCalculator");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var StatusBadge_1 = require("../common/StatusBadge");
var ConfirmDialog_1 = require("../common/ConfirmDialog");
var enums_1 = require("../../models/enums");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var SubmitTimesheet = function () {
    var _a = (0, AppContext_1.useAppContext)(), currentUser = _a.currentUser, configuration = _a.configuration;
    var _b = (0, TimesheetContext_1.useTimesheetContext)(), weekEntries = _b.weekEntries, currentSubmission = _b.currentSubmission, selectedWeek = _b.selectedWeek, refreshSubmission = _b.refreshSubmission, refreshWeekEntries = _b.refreshWeekEntries;
    var _c = (0, useSubmissions_1.useSubmissions)(), submitWeek = _c.submitWeek, loading = _c.loading;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var _d = tslib_1.__read(React.useState(false), 2), showConfirm = _d[0], setShowConfirm = _d[1];
    var _e = tslib_1.__read(React.useState(false), 2), success = _e[0], setSuccess = _e[1];
    var _f = tslib_1.__read(React.useState(null), 2), error = _f[0], setError = _f[1];
    var _g = tslib_1.__read(React.useState(false), 2), refreshing = _g[0], setRefreshing = _g[1];
    var handleRefresh = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRefreshing(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, refreshSubmission()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, refreshWeekEntries()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : "Failed to refresh");
                    return [3 /*break*/, 6];
                case 5:
                    setRefreshing(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var completedEntries = weekEntries.filter(function (e) { return e.Status === enums_1.EntryStatus.Completed || e.Status === enums_1.EntryStatus.Active; });
    var overtime = (0, overtimeCalculator_1.calculateOvertime)(completedEntries, configuration);
    var canSubmit = !currentSubmission &&
        completedEntries.length > 0 &&
        (currentUser === null || currentUser === void 0 ? void 0 : currentUser.managerId);
    var handleSubmit = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentUser || !currentUser.managerId)
                        return [2 /*return*/];
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, submitWeek(currentUser.id, currentUser.managerId, selectedWeek.year, selectedWeek.weekNumber, completedEntries, configuration)];
                case 2:
                    _a.sent();
                    setSuccess(true);
                    setShowConfirm(false);
                    return [4 /*yield*/, refreshSubmission()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, refreshWeekEntries()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    setError(err_2 instanceof Error ? err_2.message : "Failed to submit");
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Submit Timesheet"),
        error && React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.error }, error),
        success && (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.success, onDismiss: function () { return setSuccess(false); } }, "Timesheet submitted for approval.")),
        currentSubmission ? (React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 8 }, verticalAlign: "center" },
            React.createElement(Text_1.Text, null,
                "Week ",
                selectedWeek.weekNumber,
                " status:"),
            React.createElement(StatusBadge_1.StatusBadge, { status: currentSubmission.Status }),
            React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } },
                "(",
                (0, hoursFormatter_1.formatHours)(currentSubmission.TotalHours),
                " total,",
                " ",
                (0, hoursFormatter_1.formatHours)(currentSubmission.OvertimeHours),
                " overtime)"),
            React.createElement(Button_1.IconButton, { iconProps: { iconName: "Refresh" }, title: "Refresh submission status", disabled: refreshing, onClick: handleRefresh }))) : (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 } },
            React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } },
                completedEntries.length,
                " entries | ",
                (0, hoursFormatter_1.formatHours)(overtime.regularHours),
                " regular |",
                " ",
                (0, hoursFormatter_1.formatHours)(overtime.overtimeHours),
                " overtime | ",
                (0, hoursFormatter_1.formatHours)(overtime.totalHours),
                " total"),
            React.createElement(Button_1.PrimaryButton, { text: "Submit for Approval", iconProps: { iconName: "Send" }, onClick: function () { return setShowConfirm(true); }, disabled: !canSubmit || loading, styles: { root: { width: 200 } } }),
            !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.managerId) && (React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textWarning } } }, "No manager configured. Contact your admin.")))),
        React.createElement(ConfirmDialog_1.ConfirmDialog, { isOpen: showConfirm, title: "Submit Timesheet", message: "Submit Week ".concat(selectedWeek.weekNumber, " (").concat((0, hoursFormatter_1.formatHours)(overtime.totalHours), " total hours) for approval? You won't be able to edit entries after submission."), confirmText: "Submit", onConfirm: handleSubmit, onCancel: function () { return setShowConfirm(false); } })));
};
exports.SubmitTimesheet = SubmitTimesheet;
//# sourceMappingURL=SubmitTimesheet.js.map