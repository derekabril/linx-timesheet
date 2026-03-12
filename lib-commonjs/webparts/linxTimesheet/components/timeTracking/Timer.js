"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Button_1 = require("@fluentui/react/lib/Button");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var Dropdown_1 = require("@fluentui/react/lib/Dropdown");
var TextField_1 = require("@fluentui/react/lib/TextField");
var Dialog_1 = require("@fluentui/react/lib/Dialog");
var Styling_1 = require("@fluentui/react/lib/Styling");
var useTimer_1 = require("../../hooks/useTimer");
var useTimeEntries_1 = require("../../hooks/useTimeEntries");
var useProjects_1 = require("../../hooks/useProjects");
var useTasks_1 = require("../../hooks/useTasks");
var AppContext_1 = require("../../context/AppContext");
var TimesheetContext_1 = require("../../context/TimesheetContext");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var timerDisplayClass = (0, Styling_1.mergeStyles)({
    fontSize: 36,
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
    textAlign: "center",
    padding: "8px 0",
});
var Timer = function () {
    var currentUser = (0, AppContext_1.useAppContext)().currentUser;
    var _a = (0, TimesheetContext_1.useTimesheetContext)(), refreshTodayEntries = _a.refreshTodayEntries, refreshWeekEntries = _a.refreshWeekEntries;
    var timer = (0, useTimer_1.useTimer)();
    var createTimerEntry = (0, useTimeEntries_1.useTimeEntries)().createTimerEntry;
    var projects = (0, useProjects_1.useProjects)().projects;
    var _b = (0, useAppTheme_1.useAppTheme)(), colors = _b.colors, theme = _b.theme;
    var _c = tslib_1.__read(React.useState(null), 2), selectedProjectId = _c[0], setSelectedProjectId = _c[1];
    var tasks = (0, useTasks_1.useTasks)(selectedProjectId).tasks;
    var _d = tslib_1.__read(React.useState(false), 2), showSaveDialog = _d[0], setShowSaveDialog = _d[1];
    var _e = tslib_1.__read(React.useState(null), 2), saveProjectId = _e[0], setSaveProjectId = _e[1];
    var _f = tslib_1.__read(React.useState(null), 2), saveTaskId = _f[0], setSaveTaskId = _f[1];
    var _g = tslib_1.__read(React.useState(""), 2), saveNotes = _g[0], setSaveNotes = _g[1];
    var _h = tslib_1.__read(React.useState({
        elapsedSeconds: 0,
        startTime: null,
    }), 2), stoppedState = _h[0], setStoppedState = _h[1];
    var handleStop = function () {
        var state = timer.stop();
        setStoppedState({ elapsedSeconds: state.elapsedSeconds, startTime: state.startTime });
        setSaveProjectId(selectedProjectId);
        setShowSaveDialog(true);
    };
    var handleSave = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentUser || !stoppedState.startTime)
                        return [2 /*return*/];
                    return [4 /*yield*/, createTimerEntry(currentUser.id, stoppedState.startTime, stoppedState.elapsedSeconds, saveProjectId, saveTaskId, saveNotes)];
                case 1:
                    _a.sent();
                    setShowSaveDialog(false);
                    setSaveNotes("");
                    setSaveProjectId(null);
                    setSaveTaskId(null);
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
    var handleDiscard = function () {
        setShowSaveDialog(false);
        setSaveNotes("");
    };
    var projectOptions = projects.map(function (p) { return ({
        key: p.Id,
        text: "".concat(p.ProjectCode, " - ").concat(p.Title),
    }); });
    var taskOptions = tasks.map(function (t) { return ({
        key: t.Id,
        text: "".concat(t.TaskCode, " - ").concat(t.Title),
    }); });
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 }, styles: {
            root: {
                padding: 16,
                borderRadius: 8,
                backgroundColor: colors.bgCard,
                border: "1px solid ".concat(theme.semanticColors.bodyDivider),
                height: "100%",
                boxSizing: "border-box",
            },
        } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Timer"),
        React.createElement("div", { className: timerDisplayClass }, (0, hoursFormatter_1.formatTimerDisplay)(timer.elapsedSeconds)),
        React.createElement(Stack_1.Stack, { horizontal: true, horizontalAlign: "center", tokens: { childrenGap: 8 } },
            !timer.isRunning && !timer.isPaused && (React.createElement(Button_1.PrimaryButton, { text: "Start", iconProps: { iconName: "Play" }, onClick: timer.start })),
            timer.isRunning && (React.createElement(React.Fragment, null,
                React.createElement(Button_1.DefaultButton, { text: "Pause", iconProps: { iconName: "Pause" }, onClick: timer.pause }),
                React.createElement(Button_1.DefaultButton, { text: "Stop", iconProps: { iconName: "Stop" }, onClick: handleStop, styles: { root: { borderColor: colors.borderError, color: colors.borderError } } }))),
            timer.isPaused && (React.createElement(React.Fragment, null,
                React.createElement(Button_1.PrimaryButton, { text: "Resume", iconProps: { iconName: "Play" }, onClick: timer.resume }),
                React.createElement(Button_1.DefaultButton, { text: "Stop", iconProps: { iconName: "Stop" }, onClick: handleStop, styles: { root: { borderColor: colors.borderError, color: colors.borderError } } }),
                React.createElement(Button_1.IconButton, { iconProps: { iconName: "Delete" }, title: "Reset", onClick: timer.reset })))),
        (timer.isRunning || timer.isPaused) && (React.createElement(Dropdown_1.Dropdown, { label: "Project (optional)", placeholder: "Select project", options: projectOptions, selectedKey: selectedProjectId, onChange: function (_, opt) { return setSelectedProjectId(opt ? opt.key : null); } })),
        React.createElement(Dialog_1.Dialog, { hidden: !showSaveDialog, onDismiss: handleDiscard, dialogContentProps: {
                type: Dialog_1.DialogType.normal,
                title: "Save Timer Entry",
                subText: "Duration: ".concat((0, hoursFormatter_1.formatTimerDisplay)(stoppedState.elapsedSeconds)),
            }, modalProps: { isBlocking: true }, minWidth: 400 },
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 } },
                React.createElement(Dropdown_1.Dropdown, { label: "Project", placeholder: "Select project", options: projectOptions, selectedKey: saveProjectId, onChange: function (_, opt) {
                        setSaveProjectId(opt ? opt.key : null);
                        setSaveTaskId(null);
                    } }),
                saveProjectId && (React.createElement(Dropdown_1.Dropdown, { label: "Task", placeholder: "Select task", options: taskOptions, selectedKey: saveTaskId, onChange: function (_, opt) { return setSaveTaskId(opt ? opt.key : null); } })),
                React.createElement(TextField_1.TextField, { label: "Notes", multiline: true, rows: 3, value: saveNotes, onChange: function (_, val) { return setSaveNotes(val || ""); } })),
            React.createElement(Dialog_1.DialogFooter, null,
                React.createElement(Button_1.PrimaryButton, { text: "Save", onClick: handleSave }),
                React.createElement(Button_1.DefaultButton, { text: "Discard", onClick: handleDiscard })))));
};
exports.Timer = Timer;
//# sourceMappingURL=Timer.js.map