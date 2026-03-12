"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBadge = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Styling_1 = require("@fluentui/react/lib/Styling");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var StatusBadge = function (_a) {
    var status = _a.status;
    var _b = (0, useAppTheme_1.useAppTheme)(), theme = _b.theme, colors = _b.colors;
    var isDark = theme.isInverted;
    var statusColors = {
        Active: {
            bg: isDark ? "rgba(16, 124, 16, 0.2)" : "#dff6dd",
            text: colors.textSuccess,
        },
        Completed: {
            bg: isDark ? "rgba(0, 120, 212, 0.2)" : "#deecf9",
            text: colors.textLink,
        },
        Voided: {
            bg: isDark ? "rgba(209, 52, 56, 0.2)" : "#fed9cc",
            text: colors.textError,
        },
        Draft: {
            bg: isDark ? "rgba(255, 255, 255, 0.08)" : "#f3f2f1",
            text: colors.textSecondary,
        },
        Submitted: {
            bg: isDark ? "rgba(138, 105, 20, 0.2)" : "#fff4ce",
            text: colors.textWarning,
        },
        Approved: {
            bg: isDark ? "rgba(16, 124, 16, 0.2)" : "#dff6dd",
            text: colors.textSuccess,
        },
        Rejected: {
            bg: isDark ? "rgba(209, 52, 56, 0.2)" : "#fed9cc",
            text: colors.textError,
        },
        Processed: {
            bg: isDark ? "rgba(0, 120, 212, 0.2)" : "#deecf9",
            text: colors.textLink,
        },
        Cancelled: {
            bg: isDark ? "rgba(255, 255, 255, 0.08)" : "#f3f2f1",
            text: colors.textSecondary,
        },
    };
    var c = statusColors[status] || {
        bg: isDark ? "rgba(255, 255, 255, 0.08)" : "#f3f2f1",
        text: theme.semanticColors.bodyText,
    };
    var className = (0, Styling_1.mergeStyles)({
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.text,
    });
    return React.createElement("span", { className: className }, status);
};
exports.StatusBadge = StatusBadge;
//# sourceMappingURL=StatusBadge.js.map