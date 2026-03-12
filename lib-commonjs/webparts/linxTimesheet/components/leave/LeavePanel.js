"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeavePanel = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Stack_1 = require("@fluentui/react/lib/Stack");
var Separator_1 = require("@fluentui/react/lib/Separator");
var LeaveBalance_1 = require("./LeaveBalance");
var LeaveRequestForm_1 = require("./LeaveRequestForm");
var LeaveRequestList_1 = require("./LeaveRequestList");
var HolidayList_1 = require("./HolidayList");
var AppContext_1 = require("../../context/AppContext");
var LoadingSpinner_1 = require("../common/LoadingSpinner");
var LeavePanel = function () {
    var currentUser = (0, AppContext_1.useAppContext)().currentUser;
    if (!currentUser)
        return React.createElement(LoadingSpinner_1.LoadingSpinner, null);
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 16 }, styles: { root: { paddingTop: 16 } } },
        React.createElement(LeaveBalance_1.LeaveBalance, null),
        React.createElement(Separator_1.Separator, null),
        React.createElement(LeaveRequestForm_1.LeaveRequestForm, null),
        React.createElement(Separator_1.Separator, null),
        React.createElement(LeaveRequestList_1.LeaveRequestList, null),
        React.createElement(Separator_1.Separator, null),
        React.createElement(HolidayList_1.HolidayList, null)));
};
exports.LeavePanel = LeavePanel;
//# sourceMappingURL=LeavePanel.js.map