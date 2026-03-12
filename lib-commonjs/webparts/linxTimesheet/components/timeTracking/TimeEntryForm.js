"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeEntryForm = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Panel_1 = require("@fluentui/react/lib/Panel");
var Button_1 = require("@fluentui/react/lib/Button");
var TextField_1 = require("@fluentui/react/lib/TextField");
var DatePicker_1 = require("@fluentui/react/lib/DatePicker");
var Dropdown_1 = require("@fluentui/react/lib/Dropdown");
var SpinButton_1 = require("@fluentui/react/lib/SpinButton");
var Stack_1 = require("@fluentui/react/lib/Stack");
var TimeEntryForm = function (_a) {
    var _b, _c;
    var isOpen = _a.isOpen, entry = _a.entry, onSave = _a.onSave, onDismiss = _a.onDismiss, projectOptions = _a.projectOptions, taskOptions = _a.taskOptions;
    var _d = tslib_1.__read(React.useState({
        entryDate: entry ? new Date(entry.EntryDate) : new Date(),
        startTime: (entry === null || entry === void 0 ? void 0 : entry.ClockIn) ? new Date(entry.ClockIn).toTimeString().slice(0, 5) : "09:00",
        endTime: (entry === null || entry === void 0 ? void 0 : entry.ClockOut) ? new Date(entry.ClockOut).toTimeString().slice(0, 5) : "17:00",
        breakMinutes: (entry === null || entry === void 0 ? void 0 : entry.BreakMinutes) || 0,
        projectId: (entry === null || entry === void 0 ? void 0 : entry.ProjectId) || null,
        taskId: (entry === null || entry === void 0 ? void 0 : entry.TaskId) || null,
        notes: (entry === null || entry === void 0 ? void 0 : entry.Notes) || "",
    }), 2), state = _d[0], setState = _d[1];
    var _e = tslib_1.__read(React.useState(false), 2), saving = _e[0], setSaving = _e[1];
    var handleSave = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, onSave(state)];
                case 2:
                    _a.sent();
                    onDismiss();
                    return [3 /*break*/, 4];
                case 3:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var onRenderFooterContent = function () { return (React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
        React.createElement(Button_1.PrimaryButton, { text: "Save", onClick: handleSave, disabled: saving }),
        React.createElement(Button_1.DefaultButton, { text: "Cancel", onClick: onDismiss }))); };
    return (React.createElement(Panel_1.Panel, { isOpen: isOpen, onDismiss: onDismiss, headerText: entry ? "Edit Time Entry" : "New Time Entry", type: Panel_1.PanelType.medium, onRenderFooterContent: onRenderFooterContent, isFooterAtBottom: true },
        React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 }, styles: { root: { paddingTop: 16 } } },
            React.createElement(DatePicker_1.DatePicker, { label: "Date", value: state.entryDate, onSelectDate: function (date) { return date && setState(tslib_1.__assign(tslib_1.__assign({}, state), { entryDate: date })); } }),
            React.createElement(TextField_1.TextField, { label: "Start Time", type: "time", value: state.startTime, onChange: function (_, v) { return setState(tslib_1.__assign(tslib_1.__assign({}, state), { startTime: v || "" })); } }),
            React.createElement(TextField_1.TextField, { label: "End Time", type: "time", value: state.endTime, onChange: function (_, v) { return setState(tslib_1.__assign(tslib_1.__assign({}, state), { endTime: v || "" })); } }),
            React.createElement(SpinButton_1.SpinButton, { label: "Break (minutes)", min: 0, max: 480, step: 5, value: String(state.breakMinutes), onChange: function (_, v) { return setState(tslib_1.__assign(tslib_1.__assign({}, state), { breakMinutes: Number(v) || 0 })); } }),
            React.createElement(Dropdown_1.Dropdown, { label: "Project", options: projectOptions, selectedKey: (_b = state.projectId) !== null && _b !== void 0 ? _b : "", onChange: function (_, opt) {
                    return setState(tslib_1.__assign(tslib_1.__assign({}, state), { projectId: opt && opt.key !== "" ? opt.key : null, taskId: null }));
                } }),
            state.projectId && (React.createElement(Dropdown_1.Dropdown, { label: "Task", options: taskOptions, selectedKey: (_c = state.taskId) !== null && _c !== void 0 ? _c : "", onChange: function (_, opt) {
                    return setState(tslib_1.__assign(tslib_1.__assign({}, state), { taskId: opt && opt.key !== "" ? opt.key : null }));
                } })),
            React.createElement(TextField_1.TextField, { label: "Notes", multiline: true, rows: 3, value: state.notes, onChange: function (_, v) { return setState(tslib_1.__assign(tslib_1.__assign({}, state), { notes: v || "" })); } }))));
};
exports.TimeEntryForm = TimeEntryForm;
//# sourceMappingURL=TimeEntryForm.js.map