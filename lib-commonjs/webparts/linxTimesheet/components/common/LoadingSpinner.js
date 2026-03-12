"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingSpinner = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Spinner_1 = require("@fluentui/react/lib/Spinner");
var Stack_1 = require("@fluentui/react/lib/Stack");
var LoadingSpinner = function (_a) {
    var _b = _a.label, label = _b === void 0 ? "Loading..." : _b, _c = _a.size, size = _c === void 0 ? Spinner_1.SpinnerSize.large : _c;
    return (React.createElement(Stack_1.Stack, { horizontalAlign: "center", verticalAlign: "center", styles: { root: { minHeight: 200, padding: 20 } } },
        React.createElement(Spinner_1.Spinner, { size: size, label: label })));
};
exports.LoadingSpinner = LoadingSpinner;
//# sourceMappingURL=LoadingSpinner.js.map