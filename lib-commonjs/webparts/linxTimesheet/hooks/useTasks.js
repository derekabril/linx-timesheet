"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTasks = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var PnPConfig_1 = require("../services/PnPConfig");
var TaskService_1 = require("../services/TaskService");
var useTasks = function (projectId, activeOnly) {
    if (activeOnly === void 0) { activeOnly = true; }
    var _a = tslib_1.__read((0, react_1.useState)([]), 2), tasks = _a[0], setTasks = _a[1];
    var _b = tslib_1.__read((0, react_1.useState)(false), 2), loading = _b[0], setLoading = _b[1];
    var _c = tslib_1.__read((0, react_1.useState)(null), 2), error = _c[0], setError = _c[1];
    var sp = (0, PnPConfig_1.getSP)();
    var service = (0, react_1.useMemo)(function () { return new TaskService_1.TaskService(sp); }, [sp]);
    var refresh = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!projectId) {
                        setTasks([]);
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, service.getByProject(projectId, activeOnly)];
                case 2:
                    data = _a.sent();
                    setTasks(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : "Failed to load tasks");
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [projectId, activeOnly]);
    (0, react_1.useEffect)(function () {
        refresh();
    }, [refresh]);
    var create = (0, react_1.useCallback)(function (task) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.create(task)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, refresh()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, result];
            }
        });
    }); }, [service, refresh]);
    var update = (0, react_1.useCallback)(function (id, updates) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.update(id, updates)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, refresh()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [service, refresh]);
    var archive = (0, react_1.useCallback)(function (id) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.archive(id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, refresh()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [service, refresh]);
    return { tasks: tasks, loading: loading, error: error, refresh: refresh, create: create, update: update, archive: archive };
};
exports.useTasks = useTasks;
//# sourceMappingURL=useTasks.js.map