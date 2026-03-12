"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveCalendar = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Calendar_1 = require("@fluentui/react/lib/Calendar");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var AppContext_1 = require("../../context/AppContext");
var useLeaveRequests_1 = require("../../hooks/useLeaveRequests");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var LeaveCalendar = function () {
    var currentUser = (0, AppContext_1.useAppContext)().currentUser;
    var year = new Date().getFullYear();
    var requests = (0, useLeaveRequests_1.useLeaveRequests)((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || null, year).requests;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var _a = tslib_1.__read(React.useState(new Date()), 2), selectedDate = _a[0], setSelectedDate = _a[1];
    // Find leave requests that include the selected date
    var selectedDateStr = selectedDate.toISOString().split("T")[0];
    var activeLeave = requests.find(function (r) {
        var start = r.StartDate.split("T")[0];
        var end = r.EndDate.split("T")[0];
        return selectedDateStr >= start && selectedDateStr <= end && r.Status !== "Cancelled";
    });
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Leave Calendar"),
        React.createElement(Calendar_1.Calendar, { value: selectedDate, onSelectDate: function (date) { return setSelectedDate(date); }, showMonthPickerAsOverlay: true }),
        activeLeave && (React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textLink } } },
            activeLeave.LeaveType,
            " leave (",
            activeLeave.Status,
            ")"))));
};
exports.LeaveCalendar = LeaveCalendar;
//# sourceMappingURL=LeaveCalendar.js.map