"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRequestForm = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Button_1 = require("@fluentui/react/lib/Button");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var DatePicker_1 = require("@fluentui/react/lib/DatePicker");
var Dropdown_1 = require("@fluentui/react/lib/Dropdown");
var TextField_1 = require("@fluentui/react/lib/TextField");
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var AppContext_1 = require("../../context/AppContext");
var useLeaveRequests_1 = require("../../hooks/useLeaveRequests");
var enums_1 = require("../../models/enums");
var dateUtils_1 = require("../../utils/dateUtils");
var validationUtils_1 = require("../../utils/validationUtils");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var leaveTypeOptions = [
    { key: enums_1.LeaveType.Vacation, text: "Vacation" },
    { key: enums_1.LeaveType.Sick, text: "Sick Leave" },
    { key: enums_1.LeaveType.Personal, text: "Personal" },
    { key: enums_1.LeaveType.Bereavement, text: "Bereavement" },
    { key: enums_1.LeaveType.Other, text: "Other" },
];
var LeaveRequestForm = function () {
    var currentUser = (0, AppContext_1.useAppContext)().currentUser;
    var year = new Date().getFullYear();
    var _a = (0, useLeaveRequests_1.useLeaveRequests)((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || null, year), create = _a.create, submit = _a.submit;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var _b = tslib_1.__read(React.useState(enums_1.LeaveType.Vacation), 2), leaveType = _b[0], setLeaveType = _b[1];
    var _c = tslib_1.__read(React.useState(null), 2), startDate = _c[0], setStartDate = _c[1];
    var _d = tslib_1.__read(React.useState(null), 2), endDate = _d[0], setEndDate = _d[1];
    var _e = tslib_1.__read(React.useState(""), 2), notes = _e[0], setNotes = _e[1];
    var _f = tslib_1.__read(React.useState([]), 2), errors = _f[0], setErrors = _f[1];
    var _g = tslib_1.__read(React.useState(false), 2), success = _g[0], setSuccess = _g[1];
    var _h = tslib_1.__read(React.useState(false), 2), saving = _h[0], setSaving = _h[1];
    var totalDays = startDate && endDate ? (0, dateUtils_1.getBusinessDays)(startDate, endDate) : 0;
    var handleSubmit = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var validation, request, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSuccess(false);
                    validation = (0, validationUtils_1.validateLeaveRequest)({ startDate: startDate, endDate: endDate, leaveType: leaveType });
                    if (!validation.isValid) {
                        setErrors(validation.errors);
                        return [2 /*return*/];
                    }
                    if (!currentUser || !startDate || !endDate)
                        return [2 /*return*/];
                    setErrors([]);
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 4, 5]);
                    request = {
                        Title: "".concat(leaveType, " - ").concat((0, dateUtils_1.toDateString)(startDate)),
                        EmployeeId: currentUser.id,
                        LeaveType: leaveType,
                        StartDate: (0, dateUtils_1.toDateString)(startDate),
                        EndDate: (0, dateUtils_1.toDateString)(endDate),
                        TotalDays: totalDays,
                        Status: enums_1.LeaveStatus.Submitted,
                        ApproverId: currentUser.managerId || currentUser.id,
                        ApproverComments: "",
                        RequestDate: new Date().toISOString(),
                        Year: startDate.getFullYear(),
                    };
                    return [4 /*yield*/, create(request)];
                case 2:
                    result = _a.sent();
                    return [4 /*yield*/, submit(result.Id)];
                case 3:
                    _a.sent();
                    setStartDate(null);
                    setEndDate(null);
                    setNotes("");
                    setSuccess(true);
                    return [3 /*break*/, 5];
                case 4:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Request Leave"),
        errors.length > 0 && (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.error }, errors.map(function (e, i) { return React.createElement("div", { key: i }, e); }))),
        success && (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.success, onDismiss: function () { return setSuccess(false); } }, "Leave request submitted successfully.")),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 12 }, wrap: true },
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
                React.createElement(Text_1.Text, { variant: "small" }, "Leave Type"),
                React.createElement(Dropdown_1.Dropdown, { options: leaveTypeOptions, selectedKey: leaveType, onChange: function (_, opt) { return opt && setLeaveType(opt.key); }, styles: { root: { width: 180 } } })),
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
                React.createElement(Text_1.Text, { variant: "small" }, "Start Date"),
                React.createElement(DatePicker_1.DatePicker, { value: startDate || undefined, onSelectDate: function (d) { return setStartDate(d || null); }, styles: { root: { width: 160 } } })),
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
                React.createElement(Text_1.Text, { variant: "small" }, "End Date"),
                React.createElement(DatePicker_1.DatePicker, { value: endDate || undefined, onSelectDate: function (d) { return setEndDate(d || null); }, minDate: startDate || undefined, styles: { root: { width: 160 } } })),
            React.createElement(Stack_1.Stack, { verticalAlign: "end" },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary, lineHeight: "32px" } } }, totalDays > 0 ? "".concat(totalDays, " business day(s)") : ""))),
        React.createElement(TextField_1.TextField, { label: "Notes (optional)", multiline: true, rows: 2, value: notes, onChange: function (_, v) { return setNotes(v || ""); }, styles: { root: { maxWidth: 520 } } }),
        React.createElement(Button_1.PrimaryButton, { text: "Submit Request", iconProps: { iconName: "Send" }, onClick: handleSubmit, disabled: saving || !startDate || !endDate, styles: { root: { width: 160 } } })));
};
exports.LeaveRequestForm = LeaveRequestForm;
//# sourceMappingURL=LeaveRequestForm.js.map