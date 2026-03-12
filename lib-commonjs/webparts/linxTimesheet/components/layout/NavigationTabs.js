"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationTabs = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Pivot_1 = require("@fluentui/react/lib/Pivot");
var enums_1 = require("../../models/enums");
var NavigationTabs = function (_a) {
    var activeTab = _a.activeTab, isManager = _a.isManager, isAdmin = _a.isAdmin, onTabChange = _a.onTabChange;
    var handleChange = function (item) {
        if (item === null || item === void 0 ? void 0 : item.props.itemKey) {
            onTabChange(item.props.itemKey);
        }
    };
    return (React.createElement(Pivot_1.Pivot, { selectedKey: activeTab, onLinkClick: handleChange },
        React.createElement(Pivot_1.PivotItem, { headerText: "My Timesheet", itemKey: enums_1.AppTab.Timesheet, itemIcon: "Clock" }),
        React.createElement(Pivot_1.PivotItem, { headerText: "Projects", itemKey: enums_1.AppTab.Projects, itemIcon: "ProjectCollection" }),
        React.createElement(Pivot_1.PivotItem, { headerText: "Leave", itemKey: enums_1.AppTab.Leave, itemIcon: "Calendar" }),
        (isManager || isAdmin) && (React.createElement(Pivot_1.PivotItem, { headerText: "Approvals", itemKey: enums_1.AppTab.Approvals, itemIcon: "CheckMark" })),
        React.createElement(Pivot_1.PivotItem, { headerText: "Reports", itemKey: enums_1.AppTab.Reports, itemIcon: "BarChart4" }),
        isAdmin && (React.createElement(Pivot_1.PivotItem, { headerText: "Admin", itemKey: enums_1.AppTab.Admin, itemIcon: "Settings" }))));
};
exports.NavigationTabs = NavigationTabs;
//# sourceMappingURL=NavigationTabs.js.map