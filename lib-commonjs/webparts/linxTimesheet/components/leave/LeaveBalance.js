"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveBalance = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var useLeaveRequests_1 = require("../../hooks/useLeaveRequests");
var AppContext_1 = require("../../context/AppContext");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var leaveCalculator_1 = require("../../utils/leaveCalculator");
var LeaveBalance = function () {
    var _a = (0, AppContext_1.useAppContext)(), currentUser = _a.currentUser, configuration = _a.configuration;
    var _b = (0, useAppTheme_1.useAppTheme)(), colors = _b.colors, theme = _b.theme;
    var year = new Date().getFullYear();
    var requests = (0, useLeaveRequests_1.useLeaveRequests)((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || null, year).requests;
    var balances = React.useMemo(function () { return (0, leaveCalculator_1.calculateLeaveBalances)(requests, configuration); }, [requests, configuration]);
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } },
            "Leave Balances (",
            year,
            ")"),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 12 }, wrap: true }, balances.map(function (b) { return (React.createElement(Stack_1.Stack, { key: b.leaveType, styles: {
                root: {
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: colors.bgCard,
                    border: "1px solid ".concat(theme.semanticColors.bodyDivider),
                    minWidth: 140,
                    textAlign: "center",
                },
            } },
            React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, b.leaveType),
            React.createElement(Text_1.Text, { variant: "xLarge", block: true, styles: { root: { fontWeight: 700, color: b.remaining <= 0 ? colors.textError : colors.textLink } } }, b.remaining),
            React.createElement(Text_1.Text, { variant: "tiny", block: true, styles: { root: { color: colors.textTertiary } } },
                b.used,
                " used / ",
                b.allocated,
                " total"),
            b.pending > 0 && (React.createElement(Text_1.Text, { variant: "tiny", block: true, styles: { root: { color: colors.textWarning } } },
                b.pending,
                " pending")))); }))));
};
exports.LeaveBalance = LeaveBalance;
//# sourceMappingURL=LeaveBalance.js.map