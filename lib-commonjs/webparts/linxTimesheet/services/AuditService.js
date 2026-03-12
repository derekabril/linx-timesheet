"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
var tslib_1 = require("tslib");
require("@pnp/sp/site-users");
var enums_1 = require("../models/enums");
var constants_1 = require("../utils/constants");
var AuditService = /** @class */ (function () {
    function AuditService(sp) {
        this.currentUserId = null;
        this.sp = sp;
    }
    AuditService.prototype.ensureCurrentUserId = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var user;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.currentUserId === null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sp.web.currentUser.select("Id")()];
                    case 1:
                        user = _a.sent();
                        this.currentUserId = user.Id;
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.currentUserId];
                }
            });
        });
    };
    /**
     * Log an audit entry. Called after every mutation.
     */
    AuditService.prototype.log = function (entry) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var userId, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = entry.PerformedById;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.ensureCurrentUserId()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        userId = _a;
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle(constants_1.LIST_NAMES.AUDIT_LOG)
                                .items.add(tslib_1.__assign(tslib_1.__assign({}, entry), { PerformedById: userId, Year: new Date().getFullYear() }))];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Convenience method to log a create action.
     */
    AuditService.prototype.logCreate = function (targetList, targetItemId, newValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.log({
                            Title: "Created item ".concat(targetItemId, " in ").concat(targetList),
                            Action: enums_1.AuditAction.Create,
                            TargetList: targetList,
                            TargetItemId: targetItemId,
                            NewValue: JSON.stringify(newValue),
                            Year: new Date().getFullYear(),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Convenience method to log an update action.
     */
    AuditService.prototype.logUpdate = function (targetList, targetItemId, previousValue, newValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.log({
                            Title: "Updated item ".concat(targetItemId, " in ").concat(targetList),
                            Action: enums_1.AuditAction.Update,
                            TargetList: targetList,
                            TargetItemId: targetItemId,
                            PreviousValue: JSON.stringify(previousValue),
                            NewValue: JSON.stringify(newValue),
                            Year: new Date().getFullYear(),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Convenience method to log a status change (Submit, Approve, Reject).
     */
    AuditService.prototype.logStatusChange = function (action, targetList, targetItemId, previousStatus, newStatus) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.log({
                            Title: "".concat(action, " item ").concat(targetItemId, " in ").concat(targetList),
                            Action: action,
                            TargetList: targetList,
                            TargetItemId: targetItemId,
                            PreviousValue: JSON.stringify({ Status: previousStatus }),
                            NewValue: JSON.stringify({ Status: newStatus }),
                            Year: new Date().getFullYear(),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get audit log entries with filtering (for admin viewer).
     */
    AuditService.prototype.getEntries = function (filters_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (filters, top) {
            var filterParts, query;
            if (top === void 0) { top = 100; }
            return tslib_1.__generator(this, function (_a) {
                filterParts = [];
                if (filters.year)
                    filterParts.push("Year eq ".concat(filters.year));
                if (filters.action)
                    filterParts.push("Action eq '".concat(filters.action, "'"));
                if (filters.targetList)
                    filterParts.push("TargetList eq '".concat(filters.targetList, "'"));
                if (filters.performedById)
                    filterParts.push("PerformedById eq ".concat(filters.performedById));
                query = this.sp.web.lists
                    .getByTitle(constants_1.LIST_NAMES.AUDIT_LOG)
                    .items.select("Id", "Title", "Action", "TargetList", "TargetItemId", "PerformedById", "PerformedBy/Title", "ActionDate", "PreviousValue", "NewValue", "Year", "Created")
                    .expand("PerformedBy")
                    .orderBy("Created", false)
                    .top(top);
                if (filterParts.length > 0) {
                    query = query.filter(filterParts.join(" and "));
                }
                return [2 /*return*/, query()];
            });
        });
    };
    return AuditService;
}());
exports.AuditService = AuditService;
//# sourceMappingURL=AuditService.js.map