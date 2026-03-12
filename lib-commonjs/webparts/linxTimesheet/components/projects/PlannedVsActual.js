"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannedVsActual = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var Styling_1 = require("@fluentui/react/lib/Styling");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var barContainerClass = (0, Styling_1.mergeStyles)({
    position: "relative",
    height: 32,
    borderRadius: 4,
    overflow: "hidden",
});
var PlannedVsActual = function (_a) {
    var project = _a.project;
    var _b = (0, useAppTheme_1.useAppTheme)(), colors = _b.colors, theme = _b.theme;
    if (project.PlannedHours <= 0)
        return null;
    var ratio = project.ActualHours / project.PlannedHours;
    var percentage = Math.min(ratio * 100, 100);
    var isOver = ratio > 1;
    var barClass = (0, Styling_1.mergeStyles)({
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "".concat(percentage, "%"),
        backgroundColor: isOver ? colors.textError : colors.textLink,
        transition: "width 0.3s ease",
        borderRadius: 4,
    });
    var labelClass = (0, Styling_1.mergeStyles)({
        position: "absolute",
        top: "50%",
        left: 8,
        transform: "translateY(-50%)",
        fontSize: 12,
        fontWeight: 600,
        color: percentage > 30 ? "#fff" : theme.semanticColors.bodyText,
    });
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Planned vs Actual"),
        React.createElement("div", { className: barContainerClass, style: { backgroundColor: colors.bgSection } },
            React.createElement("div", { className: barClass }),
            React.createElement("span", { className: labelClass },
                (0, hoursFormatter_1.formatHours)(project.ActualHours),
                " / ",
                (0, hoursFormatter_1.formatHours)(project.PlannedHours),
                " ",
                "(",
                Math.round(ratio * 100),
                "%)")),
        isOver && (React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textError } } },
            "Over budget by ",
            (0, hoursFormatter_1.formatHours)(project.ActualHours - project.PlannedHours)))));
};
exports.PlannedVsActual = PlannedVsActual;
//# sourceMappingURL=PlannedVsActual.js.map