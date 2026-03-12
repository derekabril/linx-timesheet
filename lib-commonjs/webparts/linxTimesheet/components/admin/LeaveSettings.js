"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveSettings = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Button_1 = require("@fluentui/react/lib/Button");
var SpinButton_1 = require("@fluentui/react/lib/SpinButton");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var useConfiguration_1 = require("../../hooks/useConfiguration");
var enums_1 = require("../../models/enums");
var leaveTypes = [
    { key: enums_1.LeaveType.Vacation, label: "Vacation Days" },
    { key: enums_1.LeaveType.Sick, label: "Sick Days" },
    { key: enums_1.LeaveType.Personal, label: "Personal Days" },
    { key: enums_1.LeaveType.Bereavement, label: "Bereavement Days" },
    { key: enums_1.LeaveType.Other, label: "Other Days" },
];
var LeaveSettings = function () {
    var _a = (0, useConfiguration_1.useConfiguration)(), configuration = _a.configuration, saving = _a.saving, error = _a.error, saveConfiguration = _a.saveConfiguration;
    var _b = tslib_1.__read(React.useState(configuration), 2), config = _b[0], setConfig = _b[1];
    var _c = tslib_1.__read(React.useState(false), 2), success = _c[0], setSuccess = _c[1];
    React.useEffect(function () {
        setConfig(configuration);
    }, [configuration]);
    var updateLeaveBalance = function (key, value) {
        var _a;
        setConfig(tslib_1.__assign(tslib_1.__assign({}, config), { leaveBalances: tslib_1.__assign(tslib_1.__assign({}, config.leaveBalances), (_a = {}, _a[key] = value, _a)) }));
    };
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
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 16 }, styles: { root: { paddingTop: 16, maxWidth: 500 } } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Leave Balance Allocation (per employee/year)"),
        error && React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.error }, error),
        success && (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.success, onDismiss: function () { return setSuccess(false); } }, "Leave settings saved successfully.")),
        leaveTypes.map(function (_a) {
            var key = _a.key, label = _a.label;
            return (React.createElement(SpinButton_1.SpinButton, { key: key, label: label, min: 0, max: 365, step: 1, value: String(config.leaveBalances[key] || 0), onChange: function (_, v) { return updateLeaveBalance(key, Number(v) || 0); } }));
        }),
        React.createElement(Button_1.PrimaryButton, { text: "Save Leave Settings", iconProps: { iconName: "Save" }, onClick: handleSave, disabled: saving, styles: { root: { width: 180 } } })));
};
exports.LeaveSettings = LeaveSettings;
//# sourceMappingURL=LeaveSettings.js.map