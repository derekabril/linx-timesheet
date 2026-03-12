"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTimer = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var useTimer = function () {
    var _a = tslib_1.__read((0, react_1.useState)({
        isRunning: false,
        isPaused: false,
        elapsedSeconds: 0,
        startTime: null,
    }), 2), state = _a[0], setState = _a[1];
    var intervalRef = (0, react_1.useRef)(null);
    var clearTimer = (0, react_1.useCallback)(function () {
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);
    var start = (0, react_1.useCallback)(function () {
        clearTimer();
        setState({
            isRunning: true,
            isPaused: false,
            elapsedSeconds: 0,
            startTime: new Date(),
        });
        intervalRef.current = window.setInterval(function () {
            setState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { elapsedSeconds: prev.elapsedSeconds + 1 })); });
        }, 1000);
    }, [clearTimer]);
    var pause = (0, react_1.useCallback)(function () {
        clearTimer();
        setState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { isPaused: true, isRunning: false })); });
    }, [clearTimer]);
    var resume = (0, react_1.useCallback)(function () {
        setState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { isPaused: false, isRunning: true })); });
        intervalRef.current = window.setInterval(function () {
            setState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { elapsedSeconds: prev.elapsedSeconds + 1 })); });
        }, 1000);
    }, []);
    var stop = (0, react_1.useCallback)(function () {
        clearTimer();
        var finalState = tslib_1.__assign({}, state);
        setState({
            isRunning: false,
            isPaused: false,
            elapsedSeconds: 0,
            startTime: null,
        });
        return finalState;
    }, [state, clearTimer]);
    var reset = (0, react_1.useCallback)(function () {
        clearTimer();
        setState({
            isRunning: false,
            isPaused: false,
            elapsedSeconds: 0,
            startTime: null,
        });
    }, [clearTimer]);
    return tslib_1.__assign(tslib_1.__assign({}, state), { start: start, pause: pause, resume: resume, stop: stop, reset: reset });
};
exports.useTimer = useTimer;
//# sourceMappingURL=useTimer.js.map