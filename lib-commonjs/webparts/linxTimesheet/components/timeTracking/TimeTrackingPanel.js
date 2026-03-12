"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeTrackingPanel = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Stack_1 = require("@fluentui/react/lib/Stack");
var Separator_1 = require("@fluentui/react/lib/Separator");
var ClockInOut_1 = require("./ClockInOut");
var Timer_1 = require("./Timer");
var ManualEntry_1 = require("./ManualEntry");
var BreakTracker_1 = require("./BreakTracker");
var DailySummary_1 = require("./DailySummary");
var TimeEntryList_1 = require("./TimeEntryList");
var SubmitTimesheet_1 = require("../approval/SubmitTimesheet");
var SubmissionHistory_1 = require("../approval/SubmissionHistory");
var TimesheetContext_1 = require("../../context/TimesheetContext");
var AppContext_1 = require("../../context/AppContext");
var LoadingSpinner_1 = require("../common/LoadingSpinner");
var TimeTrackingPanel = function () {
    var isLoading = (0, TimesheetContext_1.useTimesheetContext)().isLoading;
    var currentUser = (0, AppContext_1.useAppContext)().currentUser;
    if (!currentUser)
        return React.createElement(LoadingSpinner_1.LoadingSpinner, null);
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 16 }, styles: { root: { paddingTop: 16 } } },
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 16 }, wrap: true, styles: { root: { alignItems: "stretch" } } },
            React.createElement(Stack_1.Stack.Item, { grow: 1, styles: { root: { minWidth: 250, flexBasis: 0 } } },
                React.createElement(ClockInOut_1.ClockInOut, null)),
            React.createElement(Stack_1.Stack.Item, { grow: 1, styles: { root: { minWidth: 250, flexBasis: 0 } } },
                React.createElement(Timer_1.Timer, null)),
            React.createElement(Stack_1.Stack.Item, { grow: 1, styles: { root: { minWidth: 250, flexBasis: 0 } } },
                React.createElement(BreakTracker_1.BreakTracker, null))),
        React.createElement(Separator_1.Separator, null),
        React.createElement(DailySummary_1.DailySummary, null),
        React.createElement(Separator_1.Separator, null),
        React.createElement(ManualEntry_1.ManualEntry, null),
        React.createElement(Separator_1.Separator, null),
        isLoading ? React.createElement(LoadingSpinner_1.LoadingSpinner, { label: "Loading entries..." }) : React.createElement(TimeEntryList_1.TimeEntryList, null),
        React.createElement(Separator_1.Separator, null),
        React.createElement(SubmitTimesheet_1.SubmitTimesheet, null),
        React.createElement(Separator_1.Separator, null),
        React.createElement(SubmissionHistory_1.SubmissionHistory, null)));
};
exports.TimeTrackingPanel = TimeTrackingPanel;
//# sourceMappingURL=TimeTrackingPanel.js.map