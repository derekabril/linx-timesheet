"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalDashboard = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DetailsList_1 = require("@fluentui/react/lib/DetailsList");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var Pivot_1 = require("@fluentui/react/lib/Pivot");
var AppContext_1 = require("../../context/AppContext");
var useSubmissions_1 = require("../../hooks/useSubmissions");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var dateUtils_1 = require("../../utils/dateUtils");
var StatusBadge_1 = require("../common/StatusBadge");
var LoadingSpinner_1 = require("../common/LoadingSpinner");
var TimesheetReview_1 = require("./TimesheetReview");
var LeaveService_1 = require("../../services/LeaveService");
var PnPConfig_1 = require("../../services/PnPConfig");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var ApprovalDashboard = function () {
    var currentUser = (0, AppContext_1.useAppContext)().currentUser;
    var _a = (0, useSubmissions_1.useSubmissions)(), getPendingApprovals = _a.getPendingApprovals, getApprovedSubmissions = _a.getApprovedSubmissions;
    var _b = tslib_1.__read(React.useState([]), 2), pendingTimesheets = _b[0], setPendingTimesheets = _b[1];
    var _c = tslib_1.__read(React.useState([]), 2), approvedTimesheets = _c[0], setApprovedTimesheets = _c[1];
    var _d = tslib_1.__read(React.useState([]), 2), pendingLeave = _d[0], setPendingLeave = _d[1];
    var _e = tslib_1.__read(React.useState(true), 2), loading = _e[0], setLoading = _e[1];
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var _f = tslib_1.__read(React.useState(null), 2), selectedSubmission = _f[0], setSelectedSubmission = _f[1];
    var loadPending = React.useCallback(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a, timesheets, approved, leave;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!currentUser)
                        return [2 /*return*/];
                    setLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, Promise.all([
                            getPendingApprovals(currentUser.id),
                            getApprovedSubmissions(currentUser.id),
                            new LeaveService_1.LeaveService((0, PnPConfig_1.getSP)()).getPendingForApprover(currentUser.id),
                        ])];
                case 2:
                    _a = tslib_1.__read.apply(void 0, [_b.sent(), 3]), timesheets = _a[0], approved = _a[1], leave = _a[2];
                    setPendingTimesheets(timesheets);
                    setApprovedTimesheets(approved);
                    setPendingLeave(leave);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [currentUser, getPendingApprovals]);
    React.useEffect(function () {
        loadPending();
    }, [loadPending]);
    if (loading)
        return React.createElement(LoadingSpinner_1.LoadingSpinner, { label: "Loading approvals..." });
    if (selectedSubmission) {
        return (React.createElement(TimesheetReview_1.TimesheetReview, { submission: selectedSubmission, onBack: function () {
                setSelectedSubmission(null);
                loadPending();
            } }));
    }
    var timesheetColumns = [
        {
            key: "employee",
            name: "Employee",
            minWidth: 140,
            maxWidth: 200,
            onRender: function (item) { return item.EmployeeTitle || "User ".concat(item.EmployeeId); },
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
            name: "Overtime",
            minWidth: 70,
            maxWidth: 90,
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
            key: "review",
            name: "",
            minWidth: 60,
            maxWidth: 80,
            onRender: function (item) { return (React.createElement(Text_1.Text, { styles: { root: { color: colors.textLink, cursor: "pointer" } }, onClick: function () { return setSelectedSubmission(item); } }, "Review")); },
        },
    ];
    var leaveColumns = [
        {
            key: "employee",
            name: "Employee",
            minWidth: 140,
            maxWidth: 200,
            onRender: function (item) { return item.EmployeeTitle || "User ".concat(item.EmployeeId); },
        },
        { key: "type", name: "Type", fieldName: "LeaveType", minWidth: 80, maxWidth: 110 },
        {
            key: "dates",
            name: "Dates",
            minWidth: 180,
            maxWidth: 250,
            onRender: function (item) {
                return "".concat((0, dateUtils_1.formatDisplayDate)(item.StartDate), " - ").concat((0, dateUtils_1.formatDisplayDate)(item.EndDate));
            },
        },
        { key: "days", name: "Days", fieldName: "TotalDays", minWidth: 50, maxWidth: 60 },
        {
            key: "status",
            name: "Status",
            minWidth: 80,
            maxWidth: 100,
            onRender: function (item) { return React.createElement(StatusBadge_1.StatusBadge, { status: item.Status }); },
        },
    ];
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 16 }, styles: { root: { paddingTop: 16 } } },
        React.createElement(Text_1.Text, { variant: "large", styles: { root: { fontWeight: 600 } } }, "Pending Approvals"),
        React.createElement(Pivot_1.Pivot, null,
            React.createElement(Pivot_1.PivotItem, { headerText: "Timesheets (".concat(pendingTimesheets.length, ")"), itemIcon: "Clock" }, pendingTimesheets.length === 0 ? (React.createElement(Text_1.Text, { styles: { root: { padding: 16, color: colors.textSecondary, fontStyle: "italic" } } }, "No pending timesheet approvals.")) : (React.createElement(DetailsList_1.DetailsList, { items: pendingTimesheets, columns: timesheetColumns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none }))),
            React.createElement(Pivot_1.PivotItem, { headerText: "Approved (".concat(approvedTimesheets.length, ")"), itemIcon: "Completed" }, approvedTimesheets.length === 0 ? (React.createElement(Text_1.Text, { styles: { root: { padding: 16, color: colors.textSecondary, fontStyle: "italic" } } }, "No approved timesheets.")) : (React.createElement(DetailsList_1.DetailsList, { items: approvedTimesheets, columns: timesheetColumns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none }))),
            React.createElement(Pivot_1.PivotItem, { headerText: "Leave Requests (".concat(pendingLeave.length, ")"), itemIcon: "Calendar" }, pendingLeave.length === 0 ? (React.createElement(Text_1.Text, { styles: { root: { padding: 16, color: colors.textSecondary, fontStyle: "italic" } } }, "No pending leave approvals.")) : (React.createElement(DetailsList_1.DetailsList, { items: pendingLeave, columns: leaveColumns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none }))))));
};
exports.ApprovalDashboard = ApprovalDashboard;
//# sourceMappingURL=ApprovalDashboard.js.map