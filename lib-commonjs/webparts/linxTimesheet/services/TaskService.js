"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
var tslib_1 = require("tslib");
var constants_1 = require("../utils/constants");
var TaskService = /** @class */ (function () {
    function TaskService(sp) {
        this.sp = sp;
    }
    TaskService.prototype.getByProject = function (projectId_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (projectId, activeOnly) {
            var filter;
            if (activeOnly === void 0) { activeOnly = true; }
            return tslib_1.__generator(this, function (_a) {
                filter = "ProjectId eq ".concat(projectId);
                if (activeOnly)
                    filter += " and IsActive eq 1";
                return [2 /*return*/, this.sp.web.lists
                        .getByTitle(constants_1.LIST_NAMES.TASKS)
                        .items.filter(filter)
                        .select("Id", "Title", "ProjectId", "Project/Title", "TaskCode", "PlannedHours", "IsActive", "Created", "Modified")
                        .expand("Project")
                        .orderBy("Title", true)
                        .top(constants_1.MAX_ITEMS_PER_QUERY)()];
            });
        });
    };
    TaskService.prototype.getById = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.sp.web.lists
                        .getByTitle(constants_1.LIST_NAMES.TASKS)
                        .items.getById(id)
                        .select("Id", "Title", "ProjectId", "Project/Title", "TaskCode", "PlannedHours", "IsActive", "Created", "Modified")
                        .expand("Project")()];
            });
        });
    };
    TaskService.prototype.create = function (task) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.TASKS)
                            .items.add(task)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    TaskService.prototype.update = function (id, updates) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.TASKS)
                            .items.getById(id)
                            .update(updates)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskService.prototype.archive = function (id) {
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
    return TaskService;
}());
exports.TaskService = TaskService;
//# sourceMappingURL=TaskService.js.map