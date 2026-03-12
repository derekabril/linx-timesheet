"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmDialog = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Dialog_1 = require("@fluentui/react/lib/Dialog");
var Button_1 = require("@fluentui/react/lib/Button");
var ConfirmDialog = function (_a) {
    var isOpen = _a.isOpen, title = _a.title, message = _a.message, _b = _a.confirmText, confirmText = _b === void 0 ? "Confirm" : _b, _c = _a.cancelText, cancelText = _c === void 0 ? "Cancel" : _c, onConfirm = _a.onConfirm, onCancel = _a.onCancel;
    return (React.createElement(Dialog_1.Dialog, { hidden: !isOpen, onDismiss: onCancel, dialogContentProps: {
            type: Dialog_1.DialogType.normal,
            title: title,
            subText: message,
        }, modalProps: { isBlocking: true } },
        React.createElement(Dialog_1.DialogFooter, null,
            React.createElement(Button_1.PrimaryButton, { onClick: onConfirm, text: confirmText }),
            React.createElement(Button_1.DefaultButton, { onClick: onCancel, text: cancelText }))));
};
exports.ConfirmDialog = ConfirmDialog;
//# sourceMappingURL=ConfirmDialog.js.map