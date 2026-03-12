"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalActions = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Button_1 = require("@fluentui/react/lib/Button");
var Stack_1 = require("@fluentui/react/lib/Stack");
var TextField_1 = require("@fluentui/react/lib/TextField");
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var useSubmissions_1 = require("../../hooks/useSubmissions");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var ApprovalActions = function (_a) {
    var submissionId = _a.submissionId, onComplete = _a.onComplete;
    var _b = (0, useSubmissions_1.useSubmissions)(), approve = _b.approve, reject = _b.reject, loading = _b.loading;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var _c = tslib_1.__read(React.useState(""), 2), comments = _c[0], setComments = _c[1];
    var _d = tslib_1.__read(React.useState(null), 2), error = _d[0], setError = _d[1];
    var handleApprove = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, approve(submissionId, comments)];
                case 2:
                    _a.sent();
                    onComplete();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : "Failed to approve");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleReject = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!comments.trim()) {
                        setError("Please provide a reason for rejection.");
                        return [2 /*return*/];
                    }
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, reject(submissionId, comments)];
                case 2:
                    _a.sent();
                    onComplete();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    setError(err_2 instanceof Error ? err_2.message : "Failed to reject");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 }, styles: { root: { padding: "16px 0" } } },
        error && React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.error }, error),
        React.createElement(TextField_1.TextField, { label: "Comments", placeholder: "Add comments (required for rejection)", multiline: true, rows: 3, value: comments, onChange: function (_, v) { return setComments(v || ""); }, styles: { root: { maxWidth: 520 } } }),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
            React.createElement(Button_1.PrimaryButton, { text: "Approve", iconProps: { iconName: "CheckMark" }, onClick: handleApprove, disabled: loading }),
            React.createElement(Button_1.DefaultButton, { text: "Reject", iconProps: { iconName: "Cancel" }, onClick: handleReject, disabled: loading, styles: {
                    root: { borderColor: colors.borderError, color: colors.borderError },
                    rootHovered: { borderColor: colors.borderErrorHover, color: colors.borderErrorHover },
                } }))));
};
exports.ApprovalActions = ApprovalActions;
//# sourceMappingURL=ApprovalActions.js.map