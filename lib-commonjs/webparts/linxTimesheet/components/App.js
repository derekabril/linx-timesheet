"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Theme_1 = require("@fluentui/react/lib/Theme");
var AppContext_1 = require("../context/AppContext");
var TimesheetContext_1 = require("../context/TimesheetContext");
var ErrorBoundary_1 = require("./common/ErrorBoundary");
var AppShell_1 = require("./layout/AppShell");
var App = function (_a) {
    var context = _a.context, title = _a.title;
    return (React.createElement(Theme_1.ThemeProvider, null,
        React.createElement(ErrorBoundary_1.ErrorBoundary, null,
            React.createElement(AppContext_1.AppProvider, { context: context },
                React.createElement(TimesheetContext_1.TimesheetProvider, null,
                    React.createElement(AppShell_1.AppShell, { title: title }))))));
};
exports.default = App;
//# sourceMappingURL=App.js.map