"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionService = void 0;
var tslib_1 = require("tslib");
var constants_1 = require("../utils/constants");
var SubmissionService = /** @class */ (function () {
    function SubmissionService(sp) {
        this.sp = sp;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SubmissionService.mapSubmission = function (item) {
        var _a, _b;
        return tslib_1.__assign(tslib_1.__assign({}, item), { EmployeeTitle: (_b = (_a = item.Employee) === null || _a === void 0 ? void 0 : _a.Title) !== null && _b !== void 0 ? _b : item.EmployeeTitle });
    };
    SubmissionService.mapSubmissions = function (items) {
        return items.map(SubmissionService.mapSubmission);
    };
    /**
     * Get submissions for an employee for a given year.
     */
    SubmissionService.prototype.getByEmployee = function (employeeId, year) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.SUBMISSIONS)
                            .items.filter("EmployeeId eq ".concat(employeeId, " and Year eq ").concat(year)))
                            .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(constants_1.SUBMISSION_FIELDS.SELECT), false)))
                            .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(constants_1.SUBMISSION_FIELDS.EXPAND), false)).orderBy("PeriodStart", false)
                            .top(constants_1.MAX_ITEMS_PER_QUERY)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, SubmissionService.mapSubmissions(items)];
                }
            });
        });
    };
    /**
     * Get a specific submission for a given employee and week.
     */
    SubmissionService.prototype.getByEmployeeAndWeek = function (employeeId, year, weekNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.SUBMISSIONS)
                            .items.filter("EmployeeId eq ".concat(employeeId, " and Year eq ").concat(year, " and WeekNumber eq ").concat(weekNumber, " and Status ne 'Cancelled' and Status ne 'Rejected'")))
                            .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(constants_1.SUBMISSION_FIELDS.SELECT), false)))
                            .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(constants_1.SUBMISSION_FIELDS.EXPAND), false)).top(1)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, items.length > 0 ? SubmissionService.mapSubmission(items[0]) : null];
                }
            });
        });
    };
    /**
     * Get pending submissions for a manager to approve.
     */
    SubmissionService.prototype.getPendingForApprover = function (approverId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.SUBMISSIONS)
                            .items.filter("ApproverId eq ".concat(approverId, " and Status eq 'Submitted'")))
                            .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(constants_1.SUBMISSION_FIELDS.SELECT), false)))
                            .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(constants_1.SUBMISSION_FIELDS.EXPAND), false)).orderBy("SubmittedDate", false)
                            .top(constants_1.MAX_ITEMS_PER_QUERY)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, SubmissionService.mapSubmissions(items)];
                }
            });
        });
    };
    /**
     * Create a new submission.
     */
    SubmissionService.prototype.create = function (submission) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.SUBMISSIONS)
                            .items.add(submission)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Update a submission.
     */
    SubmissionService.prototype.update = function (id, updates) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.SUBMISSIONS)
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
     * Submit a timesheet for approval.
     */
    SubmissionService.prototype.submit = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.update(id, {
                            Status: "Submitted",
                            SubmittedDate: new Date().toISOString(),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Approve a timesheet submission.
     */
    SubmissionService.prototype.approve = function (id, comments) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.update(id, {
                            Status: "Approved",
                            ApprovedDate: new Date().toISOString(),
                            ApproverComments: comments,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reject a timesheet submission.
     */
    SubmissionService.prototype.reject = function (id, comments) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.update(id, {
                            Status: "Rejected",
                            ApproverComments: comments,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Revoke an approved timesheet (manager returns it for correction).
     */
    SubmissionService.prototype.revokeApproval = function (id, comments) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.update(id, {
                            Status: "Submitted",
                            ApprovedDate: null,
                            ApproverComments: comments,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get approved submissions for a manager.
     */
    SubmissionService.prototype.getApprovedForApprover = function (approverId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.SUBMISSIONS)
                            .items.filter("ApproverId eq ".concat(approverId, " and Status eq 'Approved'")))
                            .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(constants_1.SUBMISSION_FIELDS.SELECT), false)))
                            .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(constants_1.SUBMISSION_FIELDS.EXPAND), false)).orderBy("ApprovedDate", false)
                            .top(constants_1.MAX_ITEMS_PER_QUERY)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, SubmissionService.mapSubmissions(items)];
                }
            });
        });
    };
    /**
     * Cancel a submitted timesheet (employee withdraws it).
     */
    SubmissionService.prototype.cancel = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.update(id, {
                            Status: "Cancelled",
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Mark as processed (sent to payroll).
     */
    SubmissionService.prototype.markProcessed = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.update(id, { Status: "Processed" })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SubmissionService;
}());
exports.SubmissionService = SubmissionService;
//# sourceMappingURL=SubmissionService.js.map