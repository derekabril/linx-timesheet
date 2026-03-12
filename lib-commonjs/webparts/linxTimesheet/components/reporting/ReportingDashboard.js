"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingDashboard = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Stack_1 = require("@fluentui/react/lib/Stack");
var Pivot_1 = require("@fluentui/react/lib/Pivot");
var SummaryCards_1 = require("./SummaryCards");
var WeeklyReport_1 = require("./WeeklyReport");
var MonthlyReport_1 = require("./MonthlyReport");
var ProjectCostReport_1 = require("./ProjectCostReport");
var AttendanceReport_1 = require("./AttendanceReport");
var ExportToolbar_1 = require("./ExportToolbar");
var AppContext_1 = require("../../context/AppContext");
var TimesheetContext_1 = require("../../context/TimesheetContext");
var ReportingDashboard = function () {
    var _a = (0, AppContext_1.useAppContext)(), currentUser = _a.currentUser, isManager = _a.isManager;
    var weekEntries = (0, TimesheetContext_1.useTimesheetContext)().weekEntries;
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 16 }, styles: { root: { paddingTop: 16 } } },
        React.createElement(SummaryCards_1.SummaryCards, null),
        React.createElement(Pivot_1.Pivot, null,
            React.createElement(Pivot_1.PivotItem, { headerText: "Weekly", itemIcon: "CalendarWeek" },
                React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 }, styles: { root: { paddingTop: 12 } } },
                    React.createElement(ExportToolbar_1.ExportToolbar, { data: weekEntries, reportName: "weekly-timesheet" }),
                    React.createElement(WeeklyReport_1.WeeklyReport, null))),
            React.createElement(Pivot_1.PivotItem, { headerText: "Monthly", itemIcon: "Calendar" },
                React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 }, styles: { root: { paddingTop: 12 } } },
                    React.createElement(MonthlyReport_1.MonthlyReport, null))),
            React.createElement(Pivot_1.PivotItem, { headerText: "Project Costs", itemIcon: "Money" },
                React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 }, styles: { root: { paddingTop: 12 } } },
                    React.createElement(ProjectCostReport_1.ProjectCostReport, null))),
            isManager && (React.createElement(Pivot_1.PivotItem, { headerText: "Attendance", itemIcon: "People" },
                React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 }, styles: { root: { paddingTop: 12 } } },
                    React.createElement(AttendanceReport_1.AttendanceReport, null)))))));
};
exports.ReportingDashboard = ReportingDashboard;
//# sourceMappingURL=ReportingDashboard.js.map