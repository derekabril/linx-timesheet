"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTimeEntries = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var PnPConfig_1 = require("../services/PnPConfig");
var TimeEntryService_1 = require("../services/TimeEntryService");
var AuditService_1 = require("../services/AuditService");
var enums_1 = require("../models/enums");
var constants_1 = require("../utils/constants");
var dateUtils_1 = require("../utils/dateUtils");
var useTimeEntries = function () {
    var _a = tslib_1.__read((0, react_1.useState)(false), 2), loading = _a[0], setLoading = _a[1];
    var _b = tslib_1.__read((0, react_1.useState)(null), 2), error = _b[0], setError = _b[1];
    var sp = (0, PnPConfig_1.getSP)();
    var service = (0, react_1.useMemo)(function () { return new TimeEntryService_1.TimeEntryService(sp); }, [sp]);
    var auditService = (0, react_1.useMemo)(function () { return new AuditService_1.AuditService(sp); }, [sp]);
    var clockIn = (0, react_1.useCallback)(function (employeeId, projectId, taskId) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var now, entry, result, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    now = new Date();
                    entry = {
                        Title: "Clock-".concat((0, dateUtils_1.toDateString)(now)),
                        EmployeeId: employeeId,
                        EntryDate: (0, dateUtils_1.toDateString)(now),
                        ClockIn: now.toISOString(),
                        BreakMinutes: 0,
                        TotalHours: 0,
                        EntryType: enums_1.EntryType.Clock,
                        ProjectId: projectId,
                        TaskId: taskId,
                        Notes: "",
                        Status: enums_1.EntryStatus.Active,
                        IsOvertime: false,
                        OvertimeHours: 0,
                        WeekNumber: (0, dateUtils_1.getISOWeekNumber)(now),
                        Year: now.getFullYear(),
                    };
                    return [4 /*yield*/, service.create(entry)];
                case 2:
                    result = _a.sent();
                    return [4 /*yield*/, auditService.logCreate(constants_1.LIST_NAMES.TIME_ENTRIES, result.Id, entry)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, result];
                case 4:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : "Failed to clock in");
                    throw err_1;
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [service, auditService]);
    var clockOut = (0, react_1.useCallback)(function (entryId_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return tslib_1.__awaiter(void 0, tslib_1.__spreadArray([entryId_1], tslib_1.__read(args_1), false), void 0, function (entryId, breakMinutes) {
            var now, entries, current, clockIn_1, totalHours, updates, err_2;
            if (breakMinutes === void 0) { breakMinutes = 0; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, 6, 7]);
                        now = new Date();
                        return [4 /*yield*/, service.getToday(0, (0, dateUtils_1.toDateString)(now))];
                    case 2:
                        entries = _a.sent();
                        current = entries.find(function (e) { return e.Id === entryId; });
                        clockIn_1 = (current === null || current === void 0 ? void 0 : current.ClockIn) || now.toISOString();
                        totalHours = (0, dateUtils_1.calculateHours)(clockIn_1, now.toISOString());
                        updates = {
                            ClockOut: now.toISOString(),
                            BreakMinutes: breakMinutes,
                            TotalHours: totalHours,
                            Status: enums_1.EntryStatus.Completed,
                        };
                        return [4 /*yield*/, service.update(entryId, updates)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, auditService.logStatusChange(enums_1.AuditAction.ClockOut, constants_1.LIST_NAMES.TIME_ENTRIES, entryId, enums_1.EntryStatus.Active, enums_1.EntryStatus.Completed)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        err_2 = _a.sent();
                        setError(err_2 instanceof Error ? err_2.message : "Failed to clock out");
                        throw err_2;
                    case 6:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }, [service, auditService]);
    var createManualEntry = (0, react_1.useCallback)(function (employeeId, date, startTime, endTime, breakMinutes, projectId, taskId, notes) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var dateStr, clockIn_2, clockOut_1, totalHours, entry, result, err_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    dateStr = (0, dateUtils_1.toDateString)(date);
                    clockIn_2 = new Date("".concat(dateStr, "T").concat(startTime, ":00")).toISOString();
                    clockOut_1 = new Date("".concat(dateStr, "T").concat(endTime, ":00")).toISOString();
                    totalHours = (0, dateUtils_1.calculateHours)(clockIn_2, clockOut_1);
                    entry = {
                        Title: "Manual-".concat(dateStr),
                        EmployeeId: employeeId,
                        EntryDate: dateStr,
                        ClockIn: clockIn_2,
                        ClockOut: clockOut_1,
                        BreakMinutes: breakMinutes,
                        TotalHours: totalHours,
                        EntryType: enums_1.EntryType.Manual,
                        ProjectId: projectId || undefined,
                        TaskId: taskId || undefined,
                        Notes: notes,
                        Status: enums_1.EntryStatus.Completed,
                        IsOvertime: false,
                        OvertimeHours: 0,
                        WeekNumber: (0, dateUtils_1.getISOWeekNumber)(date),
                        Year: date.getFullYear(),
                    };
                    return [4 /*yield*/, service.create(entry)];
                case 2:
                    result = _a.sent();
                    return [4 /*yield*/, auditService.logCreate(constants_1.LIST_NAMES.TIME_ENTRIES, result.Id, entry)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, result];
                case 4:
                    err_3 = _a.sent();
                    setError(err_3 instanceof Error ? err_3.message : "Failed to create entry");
                    throw err_3;
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [service, auditService]);
    var createTimerEntry = (0, react_1.useCallback)(function (employeeId, startTime, totalSeconds, projectId, taskId, notes) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var now, totalHours, entry, result, err_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    now = new Date();
                    totalHours = Math.round((totalSeconds / 3600) * 100) / 100;
                    entry = {
                        Title: "Timer-".concat((0, dateUtils_1.toDateString)(startTime)),
                        EmployeeId: employeeId,
                        EntryDate: (0, dateUtils_1.toDateString)(startTime),
                        ClockIn: startTime.toISOString(),
                        ClockOut: now.toISOString(),
                        BreakMinutes: 0,
                        TotalHours: totalHours,
                        EntryType: enums_1.EntryType.Timer,
                        ProjectId: projectId || undefined,
                        TaskId: taskId || undefined,
                        Notes: notes,
                        Status: enums_1.EntryStatus.Completed,
                        IsOvertime: false,
                        OvertimeHours: 0,
                        WeekNumber: (0, dateUtils_1.getISOWeekNumber)(startTime),
                        Year: startTime.getFullYear(),
                    };
                    return [4 /*yield*/, service.create(entry)];
                case 2:
                    result = _a.sent();
                    return [4 /*yield*/, auditService.logCreate(constants_1.LIST_NAMES.TIME_ENTRIES, result.Id, entry)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, result];
                case 4:
                    err_4 = _a.sent();
                    setError(err_4 instanceof Error ? err_4.message : "Failed to save timer entry");
                    throw err_4;
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [service, auditService]);
    var voidEntry = (0, react_1.useCallback)(function (entryId) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var err_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, service.void(entryId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, auditService.logStatusChange(enums_1.AuditAction.Delete, constants_1.LIST_NAMES.TIME_ENTRIES, entryId, "Completed", "Voided")];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_5 = _a.sent();
                    setError(err_5 instanceof Error ? err_5.message : "Failed to void entry");
                    throw err_5;
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [service, auditService]);
    return {
        loading: loading,
        error: error,
        clockIn: clockIn,
        clockOut: clockOut,
        createManualEntry: createManualEntry,
        createTimerEntry: createTimerEntry,
        voidEntry: voidEntry,
    };
};
exports.useTimeEntries = useTimeEntries;
//# sourceMappingURL=useTimeEntries.js.map