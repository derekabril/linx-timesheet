"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLeaveRequests = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var PnPConfig_1 = require("../services/PnPConfig");
var LeaveService_1 = require("../services/LeaveService");
var AuditService_1 = require("../services/AuditService");
var enums_1 = require("../models/enums");
var constants_1 = require("../utils/constants");
var useLeaveRequests = function (employeeId, year) {
    var _a = tslib_1.__read((0, react_1.useState)([]), 2), requests = _a[0], setRequests = _a[1];
    var _b = tslib_1.__read((0, react_1.useState)(false), 2), loading = _b[0], setLoading = _b[1];
    var _c = tslib_1.__read((0, react_1.useState)(null), 2), error = _c[0], setError = _c[1];
    var sp = (0, PnPConfig_1.getSP)();
    var service = (0, react_1.useMemo)(function () { return new LeaveService_1.LeaveService(sp); }, [sp]);
    var auditService = (0, react_1.useMemo)(function () { return new AuditService_1.AuditService(sp); }, [sp]);
    var refresh = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!employeeId)
                        return [2 /*return*/];
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, service.getByEmployee(employeeId, year)];
                case 2:
                    data = _a.sent();
                    setRequests(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : "Failed to load leave requests");
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [employeeId, year]);
    (0, react_1.useEffect)(function () {
        refresh();
    }, [refresh]);
    var create = (0, react_1.useCallback)(function (request) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.create(request)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, auditService.logCreate(constants_1.LIST_NAMES.LEAVE_REQUESTS, result.Id, request)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, refresh()];
                case 3:
                    _a.sent();
                    return [2 /*return*/, result];
            }
        });
    }); }, [service, auditService, refresh]);
    var submit = (0, react_1.useCallback)(function (id) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.update(id, { Status: "Submitted" })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, auditService.logStatusChange(enums_1.AuditAction.Submit, constants_1.LIST_NAMES.LEAVE_REQUESTS, id, "Draft", "Submitted")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, refresh()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [service, auditService, refresh]);
    var cancel = (0, react_1.useCallback)(function (id) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.cancel(id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, refresh()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [service, refresh]);
    return { requests: requests, loading: loading, error: error, refresh: refresh, create: create, submit: submit, cancel: cancel };
};
exports.useLeaveRequests = useLeaveRequests;
//# sourceMappingURL=useLeaveRequests.js.map