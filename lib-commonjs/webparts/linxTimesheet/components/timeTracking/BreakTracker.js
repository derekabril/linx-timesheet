"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreakTracker = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Button_1 = require("@fluentui/react/lib/Button");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var TimesheetContext_1 = require("../../context/TimesheetContext");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var BreakTracker = function () {
    var activeClockEntry = (0, TimesheetContext_1.useTimesheetContext)().activeClockEntry;
    var _a = (0, useAppTheme_1.useAppTheme)(), colors = _a.colors, theme = _a.theme;
    var _b = tslib_1.__read(React.useState(false), 2), isOnBreak = _b[0], setIsOnBreak = _b[1];
    var _c = tslib_1.__read(React.useState(0), 2), breakSeconds = _c[0], setBreakSeconds = _c[1];
    var _d = tslib_1.__read(React.useState(0), 2), totalBreakSeconds = _d[0], setTotalBreakSeconds = _d[1];
    var intervalRef = React.useRef(null);
    var startBreak = function () {
        setIsOnBreak(true);
        intervalRef.current = window.setInterval(function () {
            setBreakSeconds(function (prev) { return prev + 1; });
        }, 1000);
    };
    var endBreak = function () {
        setIsOnBreak(false);
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTotalBreakSeconds(function (prev) { return prev + breakSeconds; });
        setBreakSeconds(0);
    };
    // Clean up interval on unmount
    React.useEffect(function () {
        return function () {
            if (intervalRef.current)
                window.clearInterval(intervalRef.current);
        };
    }, []);
    var totalMinutes = Math.floor((totalBreakSeconds + breakSeconds) / 60);
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 }, styles: {
            root: {
                padding: 16,
                borderRadius: 8,
                backgroundColor: colors.bgCard,
                border: "1px solid ".concat(theme.semanticColors.bodyDivider),
                height: "100%",
                boxSizing: "border-box",
            },
        } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Break"),
        isOnBreak && (React.createElement(Text_1.Text, { variant: "large", styles: { root: { fontFamily: "'Courier New', monospace", textAlign: "center" } } }, (0, hoursFormatter_1.formatTimerDisplay)(breakSeconds))),
        React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } },
            "Total break today: ",
            totalMinutes,
            " min"),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 8 } }, !isOnBreak ? (React.createElement(Button_1.DefaultButton, { text: "Start Break", iconProps: { iconName: "Coffee" }, onClick: startBreak, disabled: !activeClockEntry })) : (React.createElement(Button_1.DefaultButton, { text: "End Break", iconProps: { iconName: "Play" }, onClick: endBreak }))),
        !activeClockEntry && (React.createElement(Text_1.Text, { variant: "tiny", styles: { root: { color: colors.textTertiary } } }, "Clock in first to track breaks"))));
};
exports.BreakTracker = BreakTracker;
//# sourceMappingURL=BreakTracker.js.map