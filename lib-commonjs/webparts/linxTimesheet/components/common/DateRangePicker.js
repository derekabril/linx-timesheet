"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateRangePicker = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DatePicker_1 = require("@fluentui/react/lib/DatePicker");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Label_1 = require("@fluentui/react/lib/Label");
var DateRangePicker = function (_a) {
    var startDate = _a.startDate, endDate = _a.endDate, onStartDateChange = _a.onStartDateChange, onEndDateChange = _a.onEndDateChange, label = _a.label;
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 } },
        label && React.createElement(Label_1.Label, null, label),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 12 } },
            React.createElement(DatePicker_1.DatePicker, { label: "Start Date", value: startDate || undefined, onSelectDate: onStartDateChange, placeholder: "Select start date", styles: { root: { width: 180 } } }),
            React.createElement(DatePicker_1.DatePicker, { label: "End Date", value: endDate || undefined, onSelectDate: onEndDateChange, placeholder: "Select end date", minDate: startDate || undefined, styles: { root: { width: 180 } } }))));
};
exports.DateRangePicker = DateRangePicker;
//# sourceMappingURL=DateRangePicker.js.map