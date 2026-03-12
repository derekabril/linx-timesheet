"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubmissions = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var PnPConfig_1 = require("../services/PnPConfig");
var SubmissionService_1 = require("../services/SubmissionService");
var TimeEntryService_1 = require("../services/TimeEntryService");
var AuditService_1 = require("../services/AuditService");
var enums_1 = require("../models/enums");
var constants_1 = require("../utils/constants");
var overtimeCalculator_1 = require("../utils/overtimeCalculator");
var dateUtils_1 = require("../utils/dateUtils");
var useSubmissions = function () {
    var _a = tslib_1.__read((0, react_1.useState)(false), 2), loading = _a[0], setLoading = _a[1];
    var _b = tslib_1.__read((0, react_1.useState)(null), 2), error = _b[0], setError = _b[1];
    var sp = (0, PnPConfig_1.getSP)();
    var submissionService = (0, react_1.useMemo)(function () { return new SubmissionService_1.SubmissionService(sp); }, [sp]);
    var timeEntryService = (0, react_1.useMemo)(function () { return new TimeEntryService_1.TimeEntryService(sp); }, [sp]);
    var auditService = (0, react_1.useMemo)(function () { return new AuditService_1.AuditService(sp); }, [sp]);
    /**
     * Create and submit a weekly timesheet.
     */
    var submitWeek = (0, react_1.useCallback)(function (employeeId, approverId, year, weekNumber, entries, config) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var overtime, weekStart, weekEnd, submission, result, entryIds, err_1;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, 6, 7]);
                    overtime = (0, overtimeCalculator_1.calculateOvertime)(entries, config);
                    weekStart = (0, dateUtils_1.getWeekStart)(new Date(((_a = entries[0]) === null || _a === void 0 ? void 0 : _a.EntryDate) || new Date()));
                    weekEnd = (0, dateUtils_1.getWeekEnd)(weekStart);
                    submission = {
                        Title: "Week ".concat(weekNumber, ", ").concat(year),
                        EmployeeId: employeeId,
                        PeriodStart: (0, dateUtils_1.toDateString)(weekStart),
                        PeriodEnd: (0, dateUtils_1.toDateString)(weekEnd),
                        TotalHours: overtime.totalHours,
                        OvertimeHours: overtime.overtimeHours,
                        RegularHours: overtime.regularHours,
                        Status: enums_1.SubmissionStatus.Submitted,
                        ApproverId: approverId,
                        WeekNumber: weekNumber,
                        Year: year,
                    };
                    return [4 /*yield*/, submissionService.create(submission)];
                case 2:
                    result = _b.sent();
                    entryIds = entries.map(function (e) { return e.Id; });
                    return [4 /*yield*/, timeEntryService.linkToSubmission(entryIds, result.Id)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, auditService.logCreate(constants_1.LIST_NAMES.SUBMISSIONS, result.Id, submission)];
                case 4:
                    _b.sent();
                    return [2 /*return*/, result];
                case 5:
                    err_1 = _b.sent();
                    setError(err_1 instanceof Error ? err_1.message : "Failed to submit timesheet");
                    throw err_1;
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); }, [submissionService, timeEntryService, auditService]);
    var approve = (0, react_1.useCallback)(function (submissionId, comments) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, submissionService.approve(submissionId, comments)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, auditService.logStatusChange(enums_1.AuditAction.Approve, constants_1.LIST_NAMES.SUBMISSIONS, submissionId, enums_1.SubmissionStatus.Submitted, enums_1.SubmissionStatus.Approved)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_2 = _a.sent();
                    setError(err_2 instanceof Error ? err_2.message : "Failed to approve");
                    throw err_2;
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [submissionService, auditService]);
    var reject = (0, react_1.useCallback)(function (submissionId, comments) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var err_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, submissionService.reject(submissionId, comments)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, auditService.logStatusChange(enums_1.AuditAction.Reject, constants_1.LIST_NAMES.SUBMISSIONS, submissionId, enums_1.SubmissionStatus.Submitted, enums_1.SubmissionStatus.Rejected)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_3 = _a.sent();
                    setError(err_3 instanceof Error ? err_3.message : "Failed to reject");
                    throw err_3;
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [submissionService, auditService]);
    var revokeApproval = (0, react_1.useCallback)(function (submissionId, comments) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var err_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, submissionService.revokeApproval(submissionId, comments)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, auditService.logStatusChange(enums_1.AuditAction.Update, constants_1.LIST_NAMES.SUBMISSIONS, submissionId, enums_1.SubmissionStatus.Approved, enums_1.SubmissionStatus.Submitted)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_4 = _a.sent();
                    setError(err_4 instanceof Error ? err_4.message : "Failed to revoke approval");
                    throw err_4;
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [submissionService, auditService]);
    var getApprovedSubmissions = (0, react_1.useCallback)(function (approverId) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, submissionService.getApprovedForApprover(approverId)];
        });
    }); }, [submissionService]);
    var cancelSubmission = (0, react_1.useCallback)(function (submissionId, entryIds) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var err_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, submissionService.cancel(submissionId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, timeEntryService.unlinkFromSubmission(entryIds)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, auditService.logStatusChange(enums_1.AuditAction.Delete, constants_1.LIST_NAMES.SUBMISSIONS, submissionId, enums_1.SubmissionStatus.Submitted, enums_1.SubmissionStatus.Cancelled)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    err_5 = _a.sent();
                    setError(err_5 instanceof Error ? err_5.message : "Failed to cancel submission");
                    throw err_5;
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); }, [submissionService, timeEntryService, auditService]);
    var getPendingApprovals = (0, react_1.useCallback)(function (approverId) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, submissionService.getPendingForApprover(approverId)];
        });
    }); }, [submissionService]);
    return { loading: loading, error: error, submitWeek: submitWeek, approve: approve, reject: reject, revokeApproval: revokeApproval, cancelSubmission: cancelSubmission, getPendingApprovals: getPendingApprovals, getApprovedSubmissions: getApprovedSubmissions };
};
exports.useSubmissions = useSubmissions;
//# sourceMappingURL=useSubmissions.js.map