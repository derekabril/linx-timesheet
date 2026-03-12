"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OvertimeSettings = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Button_1 = require("@fluentui/react/lib/Button");
var SpinButton_1 = require("@fluentui/react/lib/SpinButton");
var Dropdown_1 = require("@fluentui/react/lib/Dropdown");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var useConfiguration_1 = require("../../hooks/useConfiguration");
var OvertimeSettings = function () {
    var _a = (0, useConfiguration_1.useConfiguration)(), configuration = _a.configuration, saving = _a.saving, error = _a.error, saveConfiguration = _a.saveConfiguration;
    var _b = tslib_1.__read(React.useState(configuration), 2), config = _b[0], setConfig = _b[1];
    var _c = tslib_1.__read(React.useState(false), 2), success = _c[0], setSuccess = _c[1];
    React.useEffect(function () {
        setConfig(configuration);
    }, [configuration]);
    var handleSave = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSuccess(false);
                    return [4 /*yield*/, saveConfiguration(config)];
                case 1:
                    _a.sent();
                    setSuccess(true);
                    return [2 /*return*/];
            }
        });
    }); };
    var periodOptions = [
        { key: "Weekly", text: "Weekly" },
        { key: "BiWeekly", text: "Bi-Weekly" },
    ];
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 16 }, styles: { root: { paddingTop: 16, maxWidth: 500 } } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Overtime & General Settings"),
        error && React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.error }, error),
        success && (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.success, onDismiss: function () { return setSuccess(false); } }, "Settings saved successfully.")),
        React.createElement(SpinButton_1.SpinButton, { label: "Daily Overtime Threshold (hours)", min: 1, max: 24, step: 0.5, value: String(config.overtimeDailyThreshold), onChange: function (_, v) {
                return setConfig(tslib_1.__assign(tslib_1.__assign({}, config), { overtimeDailyThreshold: Number(v) || 8 }));
            } }),
        React.createElement(SpinButton_1.SpinButton, { label: "Weekly Overtime Threshold (hours)", min: 1, max: 168, step: 1, value: String(config.overtimeWeeklyThreshold), onChange: function (_, v) {
                return setConfig(tslib_1.__assign(tslib_1.__assign({}, config), { overtimeWeeklyThreshold: Number(v) || 40 }));
            } }),
        React.createElement(Dropdown_1.Dropdown, { label: "Submission Period", options: periodOptions, selectedKey: config.submissionPeriod, onChange: function (_, opt) {
                return opt &&
                    setConfig(tslib_1.__assign(tslib_1.__assign({}, config), { submissionPeriod: opt.key }));
            } }),
        React.createElement(SpinButton_1.SpinButton, { label: "Working Days Per Week", min: 1, max: 7, step: 1, value: String(config.workingDaysPerWeek), onChange: function (_, v) {
                return setConfig(tslib_1.__assign(tslib_1.__assign({}, config), { workingDaysPerWeek: Number(v) || 5 }));
            } }),
        React.createElement(SpinButton_1.SpinButton, { label: "Default Break Duration (minutes)", min: 0, max: 240, step: 5, value: String(config.defaultBreakMinutes), onChange: function (_, v) {
                return setConfig(tslib_1.__assign(tslib_1.__assign({}, config), { defaultBreakMinutes: Number(v) || 60 }));
            } }),
        React.createElement(Button_1.PrimaryButton, { text: "Save Settings", iconProps: { iconName: "Save" }, onClick: handleSave, disabled: saving, styles: { root: { width: 150 } } })));
};
exports.OvertimeSettings = OvertimeSettings;
//# sourceMappingURL=OvertimeSettings.js.map