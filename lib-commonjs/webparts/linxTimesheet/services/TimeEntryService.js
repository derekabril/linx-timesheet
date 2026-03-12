"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeEntryService = void 0;
var tslib_1 = require("tslib");
var constants_1 = require("../utils/constants");
var TimeEntryService = /** @class */ (function () {
    function TimeEntryService(sp) {
        this.sp = sp;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TimeEntryService.mapEntry = function (item) {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__assign(tslib_1.__assign({}, item), { EmployeeTitle: (_b = (_a = item.Employee) === null || _a === void 0 ? void 0 : _a.Title) !== null && _b !== void 0 ? _b : item.EmployeeTitle, ProjectTitle: (_d = (_c = item.Project) === null || _c === void 0 ? void 0 : _c.Title) !== null && _d !== void 0 ? _d : item.ProjectTitle, TaskTitle: (_f = (_e = item.Task) === null || _e === void 0 ? void 0 : _e.Title) !== null && _f !== void 0 ? _f : item.TaskTitle });
    };
    TimeEntryService.mapEntries = function (items) {
        return items.map(TimeEntryService.mapEntry);
    };
    /**
     * Get time entries for a specific employee, year, and week.
     * Uses indexed columns (Year, WeekNumber, Employee) for optimal query.
     */
    TimeEntryService.prototype.getByEmployeeAndWeek = function (employeeId, year, weekNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.TIME_ENTRIES)
                            .items.filter("EmployeeId eq ".concat(employeeId, " and Year eq ").concat(year, " and WeekNumber eq ").concat(weekNumber, " and Status ne 'Voided'")))
                            .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(constants_1.TIME_ENTRY_FIELDS.SELECT), false)))
                            .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(constants_1.TIME_ENTRY_FIELDS.EXPAND), false)).orderBy("EntryDate", true)
                            .orderBy("ClockIn", true)
                            .top(constants_1.MAX_ITEMS_PER_QUERY)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, TimeEntryService.mapEntries(items)];
                }
            });
        });
    };
    /**
     * Get today's entries for a specific employee.
     */
    TimeEntryService.prototype.getToday = function (employeeId, todayStr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.TIME_ENTRIES)
                            .items.filter("EmployeeId eq ".concat(employeeId, " and EntryDate eq '").concat(todayStr, "' and Status ne 'Voided'")))
                            .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(constants_1.TIME_ENTRY_FIELDS.SELECT), false)))
                            .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(constants_1.TIME_ENTRY_FIELDS.EXPAND), false)).orderBy("ClockIn", true)
                            .top(50)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, TimeEntryService.mapEntries(items)];
                }
            });
        });
    };
    /**
     * Get the currently active (clocked-in but not clocked-out) entry.
     */
    TimeEntryService.prototype.getActiveEntry = function (employeeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.TIME_ENTRIES)
                            .items.filter("EmployeeId eq ".concat(employeeId, " and Status eq 'Active' and EntryType eq 'Clock'")))
                            .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(constants_1.TIME_ENTRY_FIELDS.SELECT), false)))
                            .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(constants_1.TIME_ENTRY_FIELDS.EXPAND), false)).orderBy("Created", false)
                            .top(1)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, items.length > 0 ? TimeEntryService.mapEntry(items[0]) : null];
                }
            });
        });
    };
    /**
     * Get entries by submission ID (for approval review).
     */
    TimeEntryService.prototype.getBySubmission = function (submissionId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.TIME_ENTRIES)
                            .items.filter("SubmissionId eq ".concat(submissionId)))
                            .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(constants_1.TIME_ENTRY_FIELDS.SELECT), false)))
                            .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(constants_1.TIME_ENTRY_FIELDS.EXPAND), false)).orderBy("EntryDate", true)
                            .orderBy("ClockIn", true)
                            .top(constants_1.MAX_ITEMS_PER_QUERY)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, TimeEntryService.mapEntries(items)];
                }
            });
        });
    };
    /**
     * Get entries for a date range and employee (for reporting).
     */
    TimeEntryService.prototype.getByDateRange = function (employeeId, startDate, endDate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.TIME_ENTRIES)
                            .items.filter("EmployeeId eq ".concat(employeeId, " and EntryDate ge '").concat(startDate, "' and EntryDate le '").concat(endDate, "' and Status ne 'Voided'")))
                            .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(constants_1.TIME_ENTRY_FIELDS.SELECT), false)))
                            .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(constants_1.TIME_ENTRY_FIELDS.EXPAND), false)).orderBy("EntryDate", true)
                            .top(constants_1.MAX_ITEMS_PER_QUERY)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, TimeEntryService.mapEntries(items)];
                }
            });
        });
    };
    /**
     * Get entries for all employees in a date range (manager reporting).
     */
    TimeEntryService.prototype.getAllByDateRange = function (startDate, endDate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.TIME_ENTRIES)
                            .items.filter("EntryDate ge '".concat(startDate, "' and EntryDate le '").concat(endDate, "' and Status ne 'Voided'")))
                            .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(constants_1.TIME_ENTRY_FIELDS.SELECT), false)))
                            .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(constants_1.TIME_ENTRY_FIELDS.EXPAND), false)).orderBy("EntryDate", true)
                            .top(constants_1.MAX_ITEMS_PER_QUERY)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, TimeEntryService.mapEntries(items)];
                }
            });
        });
    };
    /**
     * Create a new time entry.
     */
    TimeEntryService.prototype.create = function (entry) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.TIME_ENTRIES)
                            .items.add(entry)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Update an existing time entry.
     */
    TimeEntryService.prototype.update = function (id, updates) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.TIME_ENTRIES)
                            .items.getById(id)
                            .update(updates)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Soft-delete (void) a time entry. Never hard-delete for compliance.
     */
    TimeEntryService.prototype.void = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.update(id, { Status: "Voided" })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Link entries to a submission (batch update SubmissionId).
     */
    TimeEntryService.prototype.linkToSubmission = function (entryIds, submissionId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var list, entryIds_1, entryIds_1_1, id, e_1_1;
            var e_1, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        list = this.sp.web.lists.getByTitle(constants_1.LIST_NAMES.TIME_ENTRIES);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        entryIds_1 = tslib_1.__values(entryIds), entryIds_1_1 = entryIds_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!entryIds_1_1.done) return [3 /*break*/, 5];
                        id = entryIds_1_1.value;
                        return [4 /*yield*/, list.items.getById(id).update({ SubmissionId: submissionId })];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        entryIds_1_1 = entryIds_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (entryIds_1_1 && !entryIds_1_1.done && (_a = entryIds_1.return)) _a.call(entryIds_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Unlink entries from a submission (set SubmissionId to null).
     */
    TimeEntryService.prototype.unlinkFromSubmission = function (entryIds) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var list, entryIds_2, entryIds_2_1, id, e_2_1;
            var e_2, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        list = this.sp.web.lists.getByTitle(constants_1.LIST_NAMES.TIME_ENTRIES);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        entryIds_2 = tslib_1.__values(entryIds), entryIds_2_1 = entryIds_2.next();
                        _b.label = 2;
                    case 2:
                        if (!!entryIds_2_1.done) return [3 /*break*/, 5];
                        id = entryIds_2_1.value;
                        return [4 /*yield*/, list.items.getById(id).update({ SubmissionId: null })];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        entryIds_2_1 = entryIds_2.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (entryIds_2_1 && !entryIds_2_1.done && (_a = entryIds_2.return)) _a.call(entryIds_2);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return TimeEntryService;
}());
exports.TimeEntryService = TimeEntryService;
//# sourceMappingURL=TimeEntryService.js.map