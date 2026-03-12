"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetProvider = exports.useTimesheetContext = exports.TimesheetContext = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var PnPConfig_1 = require("../services/PnPConfig");
var TimeEntryService_1 = require("../services/TimeEntryService");
var SubmissionService_1 = require("../services/SubmissionService");
var AppContext_1 = require("./AppContext");
var dateUtils_1 = require("../utils/dateUtils");
var defaultTimesheetContext = {
    selectedDate: new Date(),
    selectedWeek: { year: new Date().getFullYear(), weekNumber: (0, dateUtils_1.getISOWeekNumber)(new Date()) },
    todayEntries: [],
    weekEntries: [],
    activeClockEntry: null,
    currentSubmission: null,
    isLoading: false,
    error: null,
    setSelectedDate: function () { },
    refreshTodayEntries: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    refreshWeekEntries: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    refreshActiveEntry: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    refreshSubmission: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
};
exports.TimesheetContext = React.createContext(defaultTimesheetContext);
var useTimesheetContext = function () { return React.useContext(exports.TimesheetContext); };
exports.useTimesheetContext = useTimesheetContext;
var TimesheetProvider = function (_a) {
    var children = _a.children;
    var currentUser = (0, AppContext_1.useAppContext)().currentUser;
    var _b = tslib_1.__read(React.useState(new Date()), 2), selectedDate = _b[0], setSelectedDateState = _b[1];
    var _c = tslib_1.__read(React.useState({
        year: new Date().getFullYear(),
        weekNumber: (0, dateUtils_1.getISOWeekNumber)(new Date()),
    }), 2), selectedWeek = _c[0], setSelectedWeek = _c[1];
    var _d = tslib_1.__read(React.useState([]), 2), todayEntries = _d[0], setTodayEntries = _d[1];
    var _e = tslib_1.__read(React.useState([]), 2), weekEntries = _e[0], setWeekEntries = _e[1];
    var _f = tslib_1.__read(React.useState(null), 2), activeClockEntry = _f[0], setActiveClockEntry = _f[1];
    var _g = tslib_1.__read(React.useState(null), 2), currentSubmission = _g[0], setCurrentSubmission = _g[1];
    var _h = tslib_1.__read(React.useState(false), 2), isLoading = _h[0], setIsLoading = _h[1];
    var _j = tslib_1.__read(React.useState(null), 2), error = _j[0], setError = _j[1];
    var sp = (0, PnPConfig_1.getSP)();
    var timeEntryService = React.useMemo(function () { return new TimeEntryService_1.TimeEntryService(sp); }, [sp]);
    var submissionService = React.useMemo(function () { return new SubmissionService_1.SubmissionService(sp); }, [sp]);
    var setSelectedDate = React.useCallback(function (date) {
        setSelectedDateState(date);
        setSelectedWeek({
            year: date.getFullYear(),
            weekNumber: (0, dateUtils_1.getISOWeekNumber)(date),
        });
    }, []);
    var refreshTodayEntries = React.useCallback(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var entries, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentUser)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, timeEntryService.getToday(currentUser.id, (0, dateUtils_1.toDateString)(new Date()))];
                case 2:
                    entries = _a.sent();
                    setTodayEntries(entries);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error("Failed to load today entries:", err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [currentUser, timeEntryService]);
    var refreshWeekEntries = React.useCallback(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var entries, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentUser)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setIsLoading(true);
                    return [4 /*yield*/, timeEntryService.getByEmployeeAndWeek(currentUser.id, selectedWeek.year, selectedWeek.weekNumber)];
                case 2:
                    entries = _a.sent();
                    setWeekEntries(entries);
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    setError(err_2 instanceof Error ? err_2.message : "Failed to load entries");
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [currentUser, selectedWeek, timeEntryService]);
    var refreshActiveEntry = React.useCallback(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var entry, err_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentUser)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, timeEntryService.getActiveEntry(currentUser.id)];
                case 2:
                    entry = _a.sent();
                    setActiveClockEntry(entry);
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    console.error("Failed to load active entry:", err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [currentUser, timeEntryService]);
    var refreshSubmission = React.useCallback(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var sub, err_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentUser)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, submissionService.getByEmployeeAndWeek(currentUser.id, selectedWeek.year, selectedWeek.weekNumber)];
                case 2:
                    sub = _a.sent();
                    setCurrentSubmission(sub);
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    console.error("Failed to load submission:", err_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [currentUser, selectedWeek, submissionService]);
    // Load data when user or week changes
    React.useEffect(function () {
        if (currentUser) {
            refreshTodayEntries();
            refreshWeekEntries();
            refreshActiveEntry();
            refreshSubmission();
        }
    }, [currentUser, selectedWeek]);
    var value = {
        selectedDate: selectedDate,
        selectedWeek: selectedWeek,
        todayEntries: todayEntries,
        weekEntries: weekEntries,
        activeClockEntry: activeClockEntry,
        currentSubmission: currentSubmission,
        isLoading: isLoading,
        error: error,
        setSelectedDate: setSelectedDate,
        refreshTodayEntries: refreshTodayEntries,
        refreshWeekEntries: refreshWeekEntries,
        refreshActiveEntry: refreshActiveEntry,
        refreshSubmission: refreshSubmission,
    };
    return React.createElement(exports.TimesheetContext.Provider, { value: value }, children);
};
exports.TimesheetProvider = TimesheetProvider;
//# sourceMappingURL=TimesheetContext.js.map