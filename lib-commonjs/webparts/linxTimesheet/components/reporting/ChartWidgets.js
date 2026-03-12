"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleBarChart = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var Styling_1 = require("@fluentui/react/lib/Styling");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var barContainerClass = (0, Styling_1.mergeStyles)({
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
});
var barLabelClass = (0, Styling_1.mergeStyles)({
    width: 80,
    fontSize: 12,
    textAlign: "right",
    flexShrink: 0,
});
var barValueClass = (0, Styling_1.mergeStyles)({
    position: "absolute",
    right: 4,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 11,
    fontWeight: 600,
});
var SimpleBarChart = function (_a) {
    var title = _a.title, data = _a.data, maxValue = _a.maxValue;
    var max = maxValue || Math.max.apply(Math, tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(data.map(function (d) { return d.value; })), false), [1], false));
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, title),
        data.map(function (item, idx) {
            var width = (item.value / max) * 100;
            var barFillClass = (0, Styling_1.mergeStyles)({
                height: "100%",
                width: "".concat(width, "%"),
                backgroundColor: item.color || colors.textLink,
                borderRadius: 4,
                transition: "width 0.3s ease",
            });
            return (React.createElement("div", { key: idx, className: barContainerClass },
                React.createElement("span", { className: barLabelClass }, item.label),
                React.createElement("div", { style: {
                        flex: 1,
                        height: 20,
                        backgroundColor: colors.bgSection,
                        borderRadius: 4,
                        overflow: "hidden",
                        position: "relative",
                    } },
                    React.createElement("div", { className: barFillClass }),
                    React.createElement("span", { className: barValueClass },
                        item.value.toFixed(1),
                        "h"))));
        })));
};
exports.SimpleBarChart = SimpleBarChart;
//# sourceMappingURL=ChartWidgets.js.map