"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppShell = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Pivot_1 = require("@fluentui/react/lib/Pivot");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var Styling_1 = require("@fluentui/react/lib/Styling");
var AppContext_1 = require("../../context/AppContext");
var LoadingSpinner_1 = require("../common/LoadingSpinner");
var ErrorMessage_1 = require("../common/ErrorMessage");
var TimeTrackingPanel_1 = require("../timeTracking/TimeTrackingPanel");
var ProjectList_1 = require("../projects/ProjectList");
var LeavePanel_1 = require("../leave/LeavePanel");
var ApprovalDashboard_1 = require("../approval/ApprovalDashboard");
var ReportingDashboard_1 = require("../reporting/ReportingDashboard");
var AdminPanel_1 = require("../admin/AdminPanel");
var enums_1 = require("../../models/enums");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var containerClass = (0, Styling_1.mergeStyles)({
    maxWidth: 1200,
    margin: "0 auto",
    padding: "16px 20px",
});
var headerClass = (0, Styling_1.mergeStyles)({
    marginBottom: 16,
});
var AppShell = function (_a) {
    var title = _a.title;
    var _b = (0, AppContext_1.useAppContext)(), isLoading = _b.isLoading, error = _b.error, isManager = _b.isManager, isAdmin = _b.isAdmin, currentUser = _b.currentUser;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var _c = tslib_1.__read(React.useState(enums_1.AppTab.Timesheet), 2), activeTab = _c[0], setActiveTab = _c[1];
    if (isLoading) {
        return React.createElement(LoadingSpinner_1.LoadingSpinner, { label: "Initializing Linx Timesheet..." });
    }
    if (error) {
        return (React.createElement("div", { className: containerClass },
            React.createElement(ErrorMessage_1.ErrorMessage, { message: error })));
    }
    var handleTabChange = function (item) {
        if (item === null || item === void 0 ? void 0 : item.props.itemKey) {
            setActiveTab(item.props.itemKey);
        }
    };
    return (React.createElement("div", { className: containerClass },
        React.createElement(Stack_1.Stack, { className: headerClass },
            React.createElement(Text_1.Text, { variant: "xLarge", styles: { root: { fontWeight: 600 } } }, title),
            currentUser && (React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } },
                "Welcome, ",
                currentUser.displayName))),
        React.createElement(Pivot_1.Pivot, { selectedKey: activeTab, onLinkClick: handleTabChange, styles: { root: { marginBottom: 16 } } },
            React.createElement(Pivot_1.PivotItem, { headerText: "My Timesheet", itemKey: enums_1.AppTab.Timesheet, itemIcon: "Clock" },
                React.createElement(TimeTrackingPanel_1.TimeTrackingPanel, null)),
            React.createElement(Pivot_1.PivotItem, { headerText: "Projects", itemKey: enums_1.AppTab.Projects, itemIcon: "ProjectCollection" },
                React.createElement(ProjectList_1.ProjectList, null)),
            React.createElement(Pivot_1.PivotItem, { headerText: "Leave", itemKey: enums_1.AppTab.Leave, itemIcon: "Calendar" },
                React.createElement(LeavePanel_1.LeavePanel, null)),
            (isManager || isAdmin) && (React.createElement(Pivot_1.PivotItem, { headerText: "Approvals", itemKey: enums_1.AppTab.Approvals, itemIcon: "CheckMark" },
                React.createElement(ApprovalDashboard_1.ApprovalDashboard, null))),
            React.createElement(Pivot_1.PivotItem, { headerText: "Reports", itemKey: enums_1.AppTab.Reports, itemIcon: "BarChart4" },
                React.createElement(ReportingDashboard_1.ReportingDashboard, null)),
            isAdmin && (React.createElement(Pivot_1.PivotItem, { headerText: "Admin", itemKey: enums_1.AppTab.Admin, itemIcon: "Settings" },
                React.createElement(AdminPanel_1.AdminPanel, null))))));
};
exports.AppShell = AppShell;
//# sourceMappingURL=AppShell.js.map