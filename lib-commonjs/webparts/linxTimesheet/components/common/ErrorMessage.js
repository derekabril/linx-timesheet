"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessage = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var ErrorMessage = function (_a) {
    var message = _a.message, onDismiss = _a.onDismiss;
    if (!message)
        return null;
    return (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.error, isMultiline: false, onDismiss: onDismiss, dismissButtonAriaLabel: "Close", styles: { root: { marginBottom: 8 } } }, message));
};
exports.ErrorMessage = ErrorMessage;
//# sourceMappingURL=ErrorMessage.js.map