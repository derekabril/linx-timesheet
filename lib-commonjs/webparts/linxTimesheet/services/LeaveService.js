"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveService = void 0;
var tslib_1 = require("tslib");
var constants_1 = require("../utils/constants");
var LEAVE_SELECT = [
    "Id", "Title", "EmployeeId", "Employee/Title", "LeaveType",
    "StartDate", "EndDate", "TotalDays", "Status", "ApproverId",
    "Approver/Title", "ApproverComments", "RequestDate", "Year",
    "Created", "Modified",
];
var LEAVE_EXPAND = ["Employee", "Approver"];
var LeaveService = /** @class */ (function () {
    function LeaveService(sp) {
        this.sp = sp;
    }
    LeaveService.prototype.getByEmployee = function (employeeId, year) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                return [2 /*return*/, (_a = (_b = this.sp.web.lists
                        .getByTitle(constants_1.LIST_NAMES.LEAVE_REQUESTS)
                        .items.filter("EmployeeId eq ".concat(employeeId, " and Year eq ").concat(year)))
                        .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(LEAVE_SELECT), false)))
                        .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(LEAVE_EXPAND), false)).orderBy("StartDate", false)
                        .top(constants_1.MAX_ITEMS_PER_QUERY)()];
            });
        });
    };
    LeaveService.prototype.getPendingForApprover = function (approverId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                return [2 /*return*/, (_a = (_b = this.sp.web.lists
                        .getByTitle(constants_1.LIST_NAMES.LEAVE_REQUESTS)
                        .items.filter("ApproverId eq ".concat(approverId, " and Status eq 'Submitted'")))
                        .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(LEAVE_SELECT), false)))
                        .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(LEAVE_EXPAND), false)).orderBy("RequestDate", false)
                        .top(constants_1.MAX_ITEMS_PER_QUERY)()];
            });
        });
    };
    LeaveService.prototype.create = function (request) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.LEAVE_REQUESTS)
                            .items.add(request)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    LeaveService.prototype.update = function (id, updates) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.LEAVE_REQUESTS)
                            .items.getById(id)
                            .update(updates)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LeaveService.prototype.approve = function (id, comments) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.update(id, {
                            Status: "Approved",
                            ApproverComments: comments,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LeaveService.prototype.reject = function (id, comments) {
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
    LeaveService.prototype.cancel = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.update(id, { Status: "Cancelled" })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return LeaveService;
}());
exports.LeaveService = LeaveService;
//# sourceMappingURL=LeaveService.js.map