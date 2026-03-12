"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskForm = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Panel_1 = require("@fluentui/react/lib/Panel");
var Button_1 = require("@fluentui/react/lib/Button");
var TextField_1 = require("@fluentui/react/lib/TextField");
var SpinButton_1 = require("@fluentui/react/lib/SpinButton");
var Stack_1 = require("@fluentui/react/lib/Stack");
var TaskForm = function (_a) {
    var isOpen = _a.isOpen, projectId = _a.projectId, onSave = _a.onSave, onDismiss = _a.onDismiss;
    var _b = tslib_1.__read(React.useState(""), 2), title = _b[0], setTitle = _b[1];
    var _c = tslib_1.__read(React.useState(""), 2), taskCode = _c[0], setTaskCode = _c[1];
    var _d = tslib_1.__read(React.useState(0), 2), plannedHours = _d[0], setPlannedHours = _d[1];
    var _e = tslib_1.__read(React.useState(false), 2), saving = _e[0], setSaving = _e[1];
    var handleSave = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!title.trim() || !taskCode.trim())
                        return [2 /*return*/];
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, onSave({
                            Title: title,
                            ProjectId: projectId,
                            TaskCode: taskCode,
                            PlannedHours: plannedHours,
                            IsActive: true,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(Panel_1.Panel, { isOpen: isOpen, onDismiss: onDismiss, headerText: "New Task", type: Panel_1.PanelType.smallFixedFar, onRenderFooterContent: function () { return (React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
            React.createElement(Button_1.PrimaryButton, { text: "Save", onClick: handleSave, disabled: saving || !title.trim() }),
            React.createElement(Button_1.DefaultButton, { text: "Cancel", onClick: onDismiss }))); }, isFooterAtBottom: true },
        React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 }, styles: { root: { paddingTop: 16 } } },
            React.createElement(TextField_1.TextField, { label: "Task Name", required: true, value: title, onChange: function (_, v) { return setTitle(v || ""); } }),
            React.createElement(TextField_1.TextField, { label: "Task Code", required: true, value: taskCode, onChange: function (_, v) { return setTaskCode(v || ""); } }),
            React.createElement(SpinButton_1.SpinButton, { label: "Planned Hours", min: 0, max: 10000, step: 1, value: String(plannedHours), onChange: function (_, v) { return setPlannedHours(Number(v) || 0); } }))));
};
exports.TaskForm = TaskForm;
//# sourceMappingURL=TaskForm.js.map