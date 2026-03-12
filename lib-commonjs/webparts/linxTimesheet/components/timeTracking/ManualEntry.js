"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualEntry = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Button_1 = require("@fluentui/react/lib/Button");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var TextField_1 = require("@fluentui/react/lib/TextField");
var DatePicker_1 = require("@fluentui/react/lib/DatePicker");
var Dropdown_1 = require("@fluentui/react/lib/Dropdown");
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var AppContext_1 = require("../../context/AppContext");
var TimesheetContext_1 = require("../../context/TimesheetContext");
var useTimeEntries_1 = require("../../hooks/useTimeEntries");
var useProjects_1 = require("../../hooks/useProjects");
var useTasks_1 = require("../../hooks/useTasks");
var validationUtils_1 = require("../../utils/validationUtils");
var enums_1 = require("../../models/enums");
var ErrorMessage_1 = require("../common/ErrorMessage");
exports.ManualEntry = React.memo(function () {
    var _a = (0, AppContext_1.useAppContext)(), currentUser = _a.currentUser, configuration = _a.configuration;
    var _b = (0, TimesheetContext_1.useTimesheetContext)(), refreshTodayEntries = _b.refreshTodayEntries, refreshWeekEntries = _b.refreshWeekEntries;
    var _c = (0, useTimeEntries_1.useTimeEntries)(), createManualEntry = _c.createManualEntry, loading = _c.loading, error = _c.error;
    var projects = (0, useProjects_1.useProjects)().projects;
    var _d = tslib_1.__read(React.useState(new Date()), 2), entryDate = _d[0], setEntryDate = _d[1];
    var _e = tslib_1.__read(React.useState("09:00"), 2), startTime = _e[0], setStartTime = _e[1];
    var _f = tslib_1.__read(React.useState("17:00"), 2), endTime = _f[0], setEndTime = _f[1];
    var _g = tslib_1.__read(React.useState(configuration.defaultBreakMinutes), 2), breakMinutes = _g[0], setBreakMinutes = _g[1];
    var _h = tslib_1.__read(React.useState(null), 2), projectId = _h[0], setProjectId = _h[1];
    var tasks = (0, useTasks_1.useTasks)(projectId).tasks;
    var _j = tslib_1.__read(React.useState(null), 2), taskId = _j[0], setTaskId = _j[1];
    var _k = tslib_1.__read(React.useState(""), 2), notes = _k[0], setNotes = _k[1];
    var _l = tslib_1.__read(React.useState([]), 2), validationErrors = _l[0], setValidationErrors = _l[1];
    var _m = tslib_1.__read(React.useState(false), 2), success = _m[0], setSuccess = _m[1];
    var projectOptions = tslib_1.__spreadArray([
        { key: "", text: "(No project)" }
    ], tslib_1.__read(projects.map(function (p) { return ({ key: p.Id, text: "".concat(p.ProjectCode, " - ").concat(p.Title) }); })), false);
    var taskOptions = tslib_1.__spreadArray([
        { key: "", text: "(No task)" }
    ], tslib_1.__read(tasks.map(function (t) { return ({ key: t.Id, text: "".concat(t.TaskCode, " - ").concat(t.Title) }); })), false);
    var handleSubmit = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var validation;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSuccess(false);
                    validation = (0, validationUtils_1.validateTimeEntry)({
                        entryDate: entryDate,
                        startTime: startTime,
                        endTime: endTime,
                        breakMinutes: breakMinutes,
                        projectId: projectId,
                        taskId: taskId,
                        notes: notes,
                        entryType: enums_1.EntryType.Manual,
                    });
                    if (!validation.isValid) {
                        setValidationErrors(validation.errors);
                        return [2 /*return*/];
                    }
                    setValidationErrors([]);
                    if (!currentUser)
                        return [2 /*return*/];
                    return [4 /*yield*/, createManualEntry(currentUser.id, entryDate, startTime, endTime, breakMinutes, projectId, taskId, notes)];
                case 1:
                    _a.sent();
                    // Reset form
                    setNotes("");
                    setSuccess(true);
                    return [4 /*yield*/, refreshTodayEntries()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, refreshWeekEntries()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Manual Time Entry"),
        error && React.createElement(ErrorMessage_1.ErrorMessage, { message: error }),
        validationErrors.length > 0 && (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.warning, isMultiline: true }, validationErrors.map(function (e, i) { return (React.createElement("div", { key: i }, e)); }))),
        success && (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.success, onDismiss: function () { return setSuccess(false); } }, "Time entry saved successfully.")),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 12 }, wrap: true },
            React.createElement(DatePicker_1.DatePicker, { label: "Date", value: entryDate, onSelectDate: function (date) { return date && setEntryDate(date); }, allowTextInput: true, calloutProps: { setInitialFocus: false, shouldRestoreFocus: false }, styles: { root: { width: 160 } } }),
            React.createElement(TextField_1.TextField, { label: "Start Time", type: "time", value: startTime, onChange: function (_, val) { return setStartTime(val || ""); }, styles: { root: { width: 120 } } }),
            React.createElement(TextField_1.TextField, { label: "End Time", type: "time", value: endTime, onChange: function (_, val) { return setEndTime(val || ""); }, styles: { root: { width: 120 } } }),
            React.createElement(TextField_1.TextField, { label: "Break (min)", type: "number", min: 0, max: 480, step: 5, value: String(breakMinutes), onChange: function (_, val) { return setBreakMinutes(Number(val) || 0); }, styles: { root: { width: 120 } } })),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 12 }, wrap: true },
            React.createElement(Dropdown_1.Dropdown, { label: "Project", placeholder: "Select project", options: projectOptions, selectedKey: projectId !== null && projectId !== void 0 ? projectId : "", onChange: function (_, opt) {
                    setProjectId(opt && opt.key !== "" ? opt.key : null);
                    setTaskId(null);
                }, styles: { root: { width: 250 } } }),
            projectId && (React.createElement(Dropdown_1.Dropdown, { label: "Task", placeholder: "Select task", options: taskOptions, selectedKey: taskId !== null && taskId !== void 0 ? taskId : "", onChange: function (_, opt) { return setTaskId(opt && opt.key !== "" ? opt.key : null); }, styles: { root: { width: 250 } } }))),
        React.createElement(TextField_1.TextField, { label: "Notes", multiline: true, rows: 2, value: notes, onChange: function (_, val) { return setNotes(val || ""); }, styles: { root: { maxWidth: 520 } } }),
        React.createElement(Button_1.PrimaryButton, { text: "Add Entry", iconProps: { iconName: "Add" }, onClick: handleSubmit, disabled: loading, styles: { root: { width: 140 } } })));
});
exports.ManualEntry.displayName = "ManualEntry";
//# sourceMappingURL=ManualEntry.js.map