"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockInOut = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Button_1 = require("@fluentui/react/lib/Button");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var TimesheetContext_1 = require("../../context/TimesheetContext");
var AppContext_1 = require("../../context/AppContext");
var useTimeEntries_1 = require("../../hooks/useTimeEntries");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var dateUtils_1 = require("../../utils/dateUtils");
var ErrorMessage_1 = require("../common/ErrorMessage");
var ClockInOut = function () {
    var currentUser = (0, AppContext_1.useAppContext)().currentUser;
    var _a = (0, TimesheetContext_1.useTimesheetContext)(), activeClockEntry = _a.activeClockEntry, refreshActiveEntry = _a.refreshActiveEntry, refreshTodayEntries = _a.refreshTodayEntries, refreshWeekEntries = _a.refreshWeekEntries;
    var _b = (0, useTimeEntries_1.useTimeEntries)(), clockIn = _b.clockIn, clockOut = _b.clockOut, loading = _b.loading, error = _b.error;
    var _c = (0, useAppTheme_1.useAppTheme)(), colors = _c.colors, theme = _c.theme;
    var handleClockIn = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentUser)
                        return [2 /*return*/];
                    return [4 /*yield*/, clockIn(currentUser.id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, refreshActiveEntry()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, refreshTodayEntries()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleClockOut = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!activeClockEntry)
                        return [2 /*return*/];
                    return [4 /*yield*/, clockOut(activeClockEntry.Id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, refreshActiveEntry()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, refreshTodayEntries()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, refreshWeekEntries()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var isClockedIn = activeClockEntry !== null;
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
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Clock In / Out"),
        error && React.createElement(ErrorMessage_1.ErrorMessage, { message: error }),
        React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
            React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } },
                "Status:",
                " ",
                React.createElement("strong", { style: { color: isClockedIn ? colors.textSuccess : colors.textSecondary } }, isClockedIn ? "Clocked In" : "Not Clocked In")),
            isClockedIn && (activeClockEntry === null || activeClockEntry === void 0 ? void 0 : activeClockEntry.ClockIn) && (React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } },
                "Since: ",
                (0, dateUtils_1.formatTime)(activeClockEntry.ClockIn)))),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 8 } }, !isClockedIn ? (React.createElement(Button_1.PrimaryButton, { text: "Clock In", iconProps: { iconName: "Play" }, onClick: handleClockIn, disabled: loading })) : (React.createElement(Button_1.DefaultButton, { text: "Clock Out", iconProps: { iconName: "Stop" }, onClick: handleClockOut, disabled: loading, styles: {
                root: { borderColor: colors.borderError, color: colors.borderError },
                rootHovered: { borderColor: colors.borderErrorHover, color: colors.borderErrorHover },
            } })))));
};
exports.ClockInOut = ClockInOut;
//# sourceMappingURL=ClockInOut.js.map