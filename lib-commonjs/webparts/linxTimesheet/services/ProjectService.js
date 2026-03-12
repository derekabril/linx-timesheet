"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
var tslib_1 = require("tslib");
var constants_1 = require("../utils/constants");
var ProjectService = /** @class */ (function () {
    function ProjectService(sp) {
        this.sp = sp;
    }
    ProjectService.prototype.getAll = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (activeOnly) {
            var query;
            var _a, _b;
            if (activeOnly === void 0) { activeOnly = true; }
            return tslib_1.__generator(this, function (_c) {
                query = (_a = (_b = this.sp.web.lists
                    .getByTitle(constants_1.LIST_NAMES.PROJECTS)
                    .items).select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(constants_1.PROJECT_FIELDS.SELECT), false)))
                    .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(constants_1.PROJECT_FIELDS.EXPAND), false)).orderBy("Title", true)
                    .top(constants_1.MAX_ITEMS_PER_QUERY);
                if (activeOnly) {
                    query = query.filter("IsActive eq 1");
                }
                return [2 /*return*/, query()];
            });
        });
    };
    ProjectService.prototype.getById = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                return [2 /*return*/, (_a = (_b = this.sp.web.lists
                        .getByTitle(constants_1.LIST_NAMES.PROJECTS)
                        .items.getById(id))
                        .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(constants_1.PROJECT_FIELDS.SELECT), false)))
                        .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(constants_1.PROJECT_FIELDS.EXPAND), false))()];
            });
        });
    };
    ProjectService.prototype.getByClient = function (client) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                return [2 /*return*/, (_a = (_b = this.sp.web.lists
                        .getByTitle(constants_1.LIST_NAMES.PROJECTS)
                        .items.filter("Client eq '".concat(client, "' and IsActive eq 1")))
                        .select.apply(_b, tslib_1.__spreadArray([], tslib_1.__read(constants_1.PROJECT_FIELDS.SELECT), false)))
                        .expand.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(constants_1.PROJECT_FIELDS.EXPAND), false)).orderBy("Title", true)
                        .top(constants_1.MAX_ITEMS_PER_QUERY)()];
            });
        });
    };
    ProjectService.prototype.create = function (project) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.PROJECTS)
                            .items.add(project)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    ProjectService.prototype.update = function (id, updates) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.PROJECTS)
                            .items.getById(id)
                            .update(updates)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProjectService.prototype.archive = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.update(id, { IsActive: false })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update the ActualHours rollup for a project.
     */
    ProjectService.prototype.updateActualHours = function (id, totalHours) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.update(id, { ActualHours: totalHours })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ProjectService;
}());
exports.ProjectService = ProjectService;
//# sourceMappingURL=ProjectService.js.map