"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectForm = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Panel_1 = require("@fluentui/react/lib/Panel");
var Button_1 = require("@fluentui/react/lib/Button");
var TextField_1 = require("@fluentui/react/lib/TextField");
var DatePicker_1 = require("@fluentui/react/lib/DatePicker");
var SpinButton_1 = require("@fluentui/react/lib/SpinButton");
var Stack_1 = require("@fluentui/react/lib/Stack");
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var validationUtils_1 = require("../../utils/validationUtils");
var ProjectForm = function (_a) {
    var isOpen = _a.isOpen, project = _a.project, onSave = _a.onSave, onDismiss = _a.onDismiss;
    var _b = tslib_1.__read(React.useState((project === null || project === void 0 ? void 0 : project.Title) || ""), 2), title = _b[0], setTitle = _b[1];
    var _c = tslib_1.__read(React.useState((project === null || project === void 0 ? void 0 : project.ProjectCode) || ""), 2), projectCode = _c[0], setProjectCode = _c[1];
    var _d = tslib_1.__read(React.useState((project === null || project === void 0 ? void 0 : project.Client) || ""), 2), client = _d[0], setClient = _d[1];
    var _e = tslib_1.__read(React.useState((project === null || project === void 0 ? void 0 : project.Description) || ""), 2), description = _e[0], setDescription = _e[1];
    var _f = tslib_1.__read(React.useState((project === null || project === void 0 ? void 0 : project.PlannedHours) || 0), 2), plannedHours = _f[0], setPlannedHours = _f[1];
    var _g = tslib_1.__read(React.useState((project === null || project === void 0 ? void 0 : project.HourlyRate) || 0), 2), hourlyRate = _g[0], setHourlyRate = _g[1];
    var _h = tslib_1.__read(React.useState((project === null || project === void 0 ? void 0 : project.StartDate) ? new Date(project.StartDate) : undefined), 2), startDate = _h[0], setStartDate = _h[1];
    var _j = tslib_1.__read(React.useState((project === null || project === void 0 ? void 0 : project.EndDate) ? new Date(project.EndDate) : undefined), 2), endDate = _j[0], setEndDate = _j[1];
    var _k = tslib_1.__read(React.useState([]), 2), errors = _k[0], setErrors = _k[1];
    var _l = tslib_1.__read(React.useState(false), 2), saving = _l[0], setSaving = _l[1];
    var handleSave = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var validation;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    validation = (0, validationUtils_1.validateProject)({ title: title, projectCode: projectCode });
                    if (!validation.isValid) {
                        setErrors(validation.errors);
                        return [2 /*return*/];
                    }
                    setErrors([]);
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, onSave({
                            Title: title,
                            ProjectCode: projectCode,
                            Client: client,
                            Description: description,
                            PlannedHours: plannedHours,
                            HourlyRate: hourlyRate,
                            StartDate: startDate === null || startDate === void 0 ? void 0 : startDate.toISOString(),
                            EndDate: endDate === null || endDate === void 0 ? void 0 : endDate.toISOString(),
                            IsActive: true,
                            ActualHours: (project === null || project === void 0 ? void 0 : project.ActualHours) || 0,
                            ProjectManagerId: (project === null || project === void 0 ? void 0 : project.ProjectManagerId) || 0,
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
    return (React.createElement(Panel_1.Panel, { isOpen: isOpen, onDismiss: onDismiss, headerText: project ? "Edit Project" : "New Project", type: Panel_1.PanelType.medium, onRenderFooterContent: function () { return (React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
            React.createElement(Button_1.PrimaryButton, { text: "Save", onClick: handleSave, disabled: saving }),
            React.createElement(Button_1.DefaultButton, { text: "Cancel", onClick: onDismiss }))); }, isFooterAtBottom: true },
        React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 }, styles: { root: { paddingTop: 16 } } },
            errors.length > 0 && (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.error }, errors.map(function (e, i) { return React.createElement("div", { key: i }, e); }))),
            React.createElement(TextField_1.TextField, { label: "Project Name", required: true, value: title, onChange: function (_, v) { return setTitle(v || ""); } }),
            React.createElement(TextField_1.TextField, { label: "Project Code", required: true, value: projectCode, onChange: function (_, v) { return setProjectCode(v || ""); } }),
            React.createElement(TextField_1.TextField, { label: "Client", value: client, onChange: function (_, v) { return setClient(v || ""); } }),
            React.createElement(TextField_1.TextField, { label: "Description", multiline: true, rows: 3, value: description, onChange: function (_, v) { return setDescription(v || ""); } }),
            React.createElement(SpinButton_1.SpinButton, { label: "Planned Hours", min: 0, max: 100000, step: 1, value: String(plannedHours), onChange: function (_, v) { return setPlannedHours(Number(v) || 0); } }),
            React.createElement(SpinButton_1.SpinButton, { label: "Hourly Rate ($)", min: 0, max: 10000, step: 5, value: String(hourlyRate), onChange: function (_, v) { return setHourlyRate(Number(v) || 0); } }),
            React.createElement(DatePicker_1.DatePicker, { label: "Start Date", value: startDate, onSelectDate: function (d) { return setStartDate(d || undefined); } }),
            React.createElement(DatePicker_1.DatePicker, { label: "End Date", value: endDate, onSelectDate: function (d) { return setEndDate(d || undefined); } }))));
};
exports.ProjectForm = ProjectForm;
//# sourceMappingURL=ProjectForm.js.map