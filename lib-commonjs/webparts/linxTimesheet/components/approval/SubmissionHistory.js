"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionHistory = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DetailsList_1 = require("@fluentui/react/lib/DetailsList");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var Button_1 = require("@fluentui/react/lib/Button");
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var AppContext_1 = require("../../context/AppContext");
var TimesheetContext_1 = require("../../context/TimesheetContext");
var useSubmissions_1 = require("../../hooks/useSubmissions");
var SubmissionService_1 = require("../../services/SubmissionService");
var TimeEntryService_1 = require("../../services/TimeEntryService");
var PnPConfig_1 = require("../../services/PnPConfig");
var enums_1 = require("../../models/enums");
var dateUtils_1 = require("../../utils/dateUtils");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var StatusBadge_1 = require("../common/StatusBadge");
var LoadingSpinner_1 = require("../common/LoadingSpinner");
var ConfirmDialog_1 = require("../common/ConfirmDialog");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var SubmissionHistory = function () {
    var currentUser = (0, AppContext_1.useAppContext)().currentUser;
    var _a = (0, TimesheetContext_1.useTimesheetContext)(), refreshSubmission = _a.refreshSubmission, refreshWeekEntries = _a.refreshWeekEntries;
    var _b = (0, useSubmissions_1.useSubmissions)(), cancelSubmission = _b.cancelSubmission, cancelLoading = _b.loading;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var _c = tslib_1.__read(React.useState([]), 2), submissions = _c[0], setSubmissions = _c[1];
    var _d = tslib_1.__read(React.useState(true), 2), loading = _d[0], setLoading = _d[1];
    var _e = tslib_1.__read(React.useState(null), 2), cancelTarget = _e[0], setCancelTarget = _e[1];
    var _f = tslib_1.__read(React.useState(null), 2), error = _f[0], setError = _f[1];
    var _g = tslib_1.__read(React.useState(null), 2), success = _g[0], setSuccess = _g[1];
    var sp = (0, PnPConfig_1.getSP)();
    var submissionService = React.useMemo(function () { return new SubmissionService_1.SubmissionService(sp); }, [sp]);
    var timeEntryService = React.useMemo(function () { return new TimeEntryService_1.TimeEntryService(sp); }, [sp]);
    var loadSubmissions = React.useCallback(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentUser)
                        return [2 /*return*/];
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, submissionService.getByEmployee(currentUser.id, new Date().getFullYear())];
                case 2:
                    data = _a.sent();
                    setSubmissions(data);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [currentUser, submissionService]);
    React.useEffect(function () {
        loadSubmissions();
    }, [loadSubmissions]);
    var handleCancel = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var entries, entryIds, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!cancelTarget)
                        return [2 /*return*/];
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, timeEntryService.getBySubmission(cancelTarget.Id)];
                case 2:
                    entries = _a.sent();
                    entryIds = entries.map(function (e) { return e.Id; });
                    return [4 /*yield*/, cancelSubmission(cancelTarget.Id, entryIds)];
                case 3:
                    _a.sent();
                    setSuccess("Week ".concat(cancelTarget.WeekNumber, " submission cancelled. You can now edit and resubmit."));
                    setCancelTarget(null);
                    return [4 /*yield*/, loadSubmissions()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, refreshSubmission()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, refreshWeekEntries()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : "Failed to cancel submission");
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var columns = [
        {
            key: "week",
            name: "Week",
            minWidth: 60,
            maxWidth: 80,
            onRender: function (item) { return "W".concat(item.WeekNumber); },
        },
        {
            key: "period",
            name: "Period",
            minWidth: 180,
            maxWidth: 250,
            onRender: function (item) {
                return "".concat((0, dateUtils_1.formatDisplayDate)(item.PeriodStart), " - ").concat((0, dateUtils_1.formatDisplayDate)(item.PeriodEnd));
            },
        },
        {
            key: "hours",
            name: "Total",
            minWidth: 70,
            maxWidth: 90,
            onRender: function (item) { return (0, hoursFormatter_1.formatHours)(item.TotalHours); },
        },
        {
            key: "overtime",
            name: "OT",
            minWidth: 60,
            maxWidth: 80,
            onRender: function (item) { return (0, hoursFormatter_1.formatHours)(item.OvertimeHours); },
        },
        {
            key: "status",
            name: "Status",
            minWidth: 80,
            maxWidth: 100,
            onRender: function (item) { return React.createElement(StatusBadge_1.StatusBadge, { status: item.Status }); },
        },
        {
            key: "comments",
            name: "Comments",
            minWidth: 150,
            maxWidth: 250,
            onRender: function (item) { return item.ApproverComments || "--"; },
        },
        {
            key: "actions",
            name: "",
            minWidth: 50,
            maxWidth: 50,
            onRender: function (item) {
                return item.Status === enums_1.SubmissionStatus.Submitted ? (React.createElement(Button_1.IconButton, { iconProps: { iconName: "Cancel" }, title: "Cancel submission", ariaLabel: "Cancel submission", disabled: cancelLoading, onClick: function () { return setCancelTarget(item); }, styles: {
                        root: { color: colors.borderError },
                        rootHovered: { color: colors.borderErrorHover },
                    } })) : null;
            },
        },
    ];
    if (loading)
        return React.createElement(LoadingSpinner_1.LoadingSpinner, { label: "Loading history..." });
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Submission History"),
        error && React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.error, onDismiss: function () { return setError(null); } }, error),
        success && React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.success, onDismiss: function () { return setSuccess(null); } }, success),
        submissions.length === 0 ? (React.createElement(Text_1.Text, { styles: { root: { color: colors.textSecondary, fontStyle: "italic" } } }, "No submissions yet.")) : (React.createElement(DetailsList_1.DetailsList, { items: submissions, columns: columns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none, compact: true })),
        React.createElement(ConfirmDialog_1.ConfirmDialog, { isOpen: cancelTarget !== null, title: "Cancel Submission", message: cancelTarget ? "Cancel Week ".concat(cancelTarget.WeekNumber, " submission? This will withdraw it from your approver and allow you to edit entries and resubmit.") : "", confirmText: "Cancel Submission", cancelText: "Keep", onConfirm: handleCancel, onCancel: function () { return setCancelTarget(null); } })));
};
exports.SubmissionHistory = SubmissionHistory;
//# sourceMappingURL=SubmissionHistory.js.map