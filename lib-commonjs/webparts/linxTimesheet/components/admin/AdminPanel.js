"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPanel = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Stack_1 = require("@fluentui/react/lib/Stack");
var Pivot_1 = require("@fluentui/react/lib/Pivot");
var Text_1 = require("@fluentui/react/lib/Text");
var OvertimeSettings_1 = require("./OvertimeSettings");
var LeaveSettings_1 = require("./LeaveSettings");
var HolidayManagement_1 = require("./HolidayManagement");
var AuditLogViewer_1 = require("./AuditLogViewer");
var AdminPanel = function () {
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 16 }, styles: { root: { paddingTop: 16 } } },
        React.createElement(Text_1.Text, { variant: "large", styles: { root: { fontWeight: 600 } } }, "Administration"),
        React.createElement(Pivot_1.Pivot, null,
            React.createElement(Pivot_1.PivotItem, { headerText: "Overtime", itemIcon: "Clock" },
                React.createElement(OvertimeSettings_1.OvertimeSettings, null)),
            React.createElement(Pivot_1.PivotItem, { headerText: "Leave", itemIcon: "Calendar" },
                React.createElement(LeaveSettings_1.LeaveSettings, null)),
            React.createElement(Pivot_1.PivotItem, { headerText: "Holidays", itemIcon: "CalendarDay" },
                React.createElement(HolidayManagement_1.HolidayManagement, null)),
            React.createElement(Pivot_1.PivotItem, { headerText: "Audit Log", itemIcon: "DocumentSearch" },
                React.createElement(AuditLogViewer_1.AuditLogViewer, null)))));
};
exports.AdminPanel = AdminPanel;
//# sourceMappingURL=AdminPanel.js.map