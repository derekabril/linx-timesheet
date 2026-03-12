"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetReview = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DetailsList_1 = require("@fluentui/react/lib/DetailsList");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var Button_1 = require("@fluentui/react/lib/Button");
var TextField_1 = require("@fluentui/react/lib/TextField");
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var useSubmissions_1 = require("../../hooks/useSubmissions");
var TimeEntryService_1 = require("../../services/TimeEntryService");
var PnPConfig_1 = require("../../services/PnPConfig");
var dateUtils_1 = require("../../utils/dateUtils");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var StatusBadge_1 = require("../common/StatusBadge");
var LoadingSpinner_1 = require("../common/LoadingSpinner");
var ApprovalActions_1 = require("./ApprovalActions");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var TimesheetReview = function (_a) {
    var submission = _a.submission, onBack = _a.onBack;
    var _b = tslib_1.__read(React.useState([]), 2), entries = _b[0], setEntries = _b[1];
    var _c = tslib_1.__read(React.useState(true), 2), loading = _c[0], setLoading = _c[1];
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var _d = tslib_1.__read(React.useState(""), 2), revokeComments = _d[0], setRevokeComments = _d[1];
    var _e = tslib_1.__read(React.useState(null), 2), revokeError = _e[0], setRevokeError = _e[1];
    var _f = (0, useSubmissions_1.useSubmissions)(), revokeApproval = _f.revokeApproval, revokeLoading = _f.loading;
    React.useEffect(function () {
        var load = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var service, data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        service = new TimeEntryService_1.TimeEntryService((0, PnPConfig_1.getSP)());
                        return [4 /*yield*/, service.getBySubmission(submission.Id)];
                    case 1:
                        data = _a.sent();
                        setEntries(data);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        load();
    }, [submission.Id]);
    var columns = [
        {
            key: "date",
            name: "Date",
            minWidth: 120,
            maxWidth: 150,
            onRender: function (item) { return (0, dateUtils_1.formatDisplayDate)(item.EntryDate); },
        },
        { key: "type", name: "Type", fieldName: "EntryType", minWidth: 60, maxWidth: 80 },
        {
            key: "start",
            name: "Start",
            minWidth: 80,
            maxWidth: 100,
            onRender: function (item) { return (0, dateUtils_1.formatTime)(item.ClockIn); },
        },
        {
            key: "end",
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
            key: "notes",
            name: "Notes",
            fieldName: "Notes",
            minWidth: 150,
            maxWidth: 250,
            onRender: function (item) { return item.Notes || "--"; },
        },
    ];
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 16 }, styles: { root: { paddingTop: 16 } } },
        React.createElement(Stack_1.Stack, { horizontal: true, verticalAlign: "center", tokens: { childrenGap: 8 } },
            React.createElement(Button_1.IconButton, { iconProps: { iconName: "Back" }, onClick: onBack, title: "Back" }),
            React.createElement(Text_1.Text, { variant: "large", styles: { root: { fontWeight: 600 } } }, "Timesheet Review")),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 24 }, wrap: true },
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 2 } },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Employee"),
                React.createElement(Text_1.Text, null, submission.EmployeeTitle || "User ".concat(submission.EmployeeId))),
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 2 } },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Period"),
                React.createElement(Text_1.Text, null,
                    (0, dateUtils_1.formatDisplayDate)(submission.PeriodStart),
                    " - ",
                    (0, dateUtils_1.formatDisplayDate)(submission.PeriodEnd))),
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 2 } },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Total Hours"),
                React.createElement(Text_1.Text, { styles: { root: { fontWeight: 600 } } }, (0, hoursFormatter_1.formatHours)(submission.TotalHours))),
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 2 } },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Overtime"),
                React.createElement(Text_1.Text, { styles: { root: { color: submission.OvertimeHours > 0 ? colors.textWarning : undefined } } }, (0, hoursFormatter_1.formatHours)(submission.OvertimeHours))),
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 2 } },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Status"),
                React.createElement(StatusBadge_1.StatusBadge, { status: submission.Status }))),
        loading ? (React.createElement(LoadingSpinner_1.LoadingSpinner, { label: "Loading entries..." })) : (React.createElement(DetailsList_1.DetailsList, { items: entries, columns: columns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none, compact: true })),
        submission.Status === "Submitted" && (React.createElement(ApprovalActions_1.ApprovalActions, { submissionId: submission.Id, onComplete: onBack })),
        submission.Status === "Approved" && (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 }, styles: { root: { padding: "16px 0" } } },
            revokeError && React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.error }, revokeError),
            React.createElement(TextField_1.TextField, { label: "Reason for revoking approval", placeholder: "Explain why this approval is being revoked (required)", multiline: true, rows: 3, value: revokeComments, onChange: function (_, v) { return setRevokeComments(v || ""); }, styles: { root: { maxWidth: 520 } } }),
            React.createElement(Button_1.DefaultButton, { text: "Revoke Approval", iconProps: { iconName: "Undo" }, disabled: revokeLoading, onClick: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    var err_1;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!revokeComments.trim()) {
                                    setRevokeError("Please provide a reason for revoking the approval.");
                                    return [2 /*return*/];
                                }
                                setRevokeError(null);
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, revokeApproval(submission.Id, revokeComments)];
                            case 2:
                                _a.sent();
                                onBack();
                                return [3 /*break*/, 4];
                            case 3:
                                err_1 = _a.sent();
                                setRevokeError(err_1 instanceof Error ? err_1.message : "Failed to revoke approval");
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }, styles: {
                    root: { borderColor: colors.textWarning, color: colors.textWarning },
                    rootHovered: { borderColor: colors.borderErrorHover, color: colors.borderErrorHover },
                } })))));
};
exports.TimesheetReview = TimesheetReview;
//# sourceMappingURL=TimesheetReview.js.map