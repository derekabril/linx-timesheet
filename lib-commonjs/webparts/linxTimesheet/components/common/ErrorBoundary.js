"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var ErrorBoundary = /** @class */ (function (_super) {
    tslib_1.__extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false, errorMessage: "" };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        return { hasError: true, errorMessage: error.message };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
    };
    ErrorBoundary.prototype.render = function () {
        if (this.state.hasError) {
            return (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.error, isMultiline: true },
                React.createElement("strong", null, "Something went wrong."),
                React.createElement("p", null, this.state.errorMessage),
                React.createElement("p", null, "Please refresh the page and try again.")));
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(React.Component));
exports.ErrorBoundary = ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map