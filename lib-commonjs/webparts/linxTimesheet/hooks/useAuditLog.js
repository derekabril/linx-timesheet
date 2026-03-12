"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuditLog = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var PnPConfig_1 = require("../services/PnPConfig");
var AuditService_1 = require("../services/AuditService");
var useAuditLog = function () {
    var _a = tslib_1.__read((0, react_1.useState)([]), 2), entries = _a[0], setEntries = _a[1];
    var _b = tslib_1.__read((0, react_1.useState)(false), 2), loading = _b[0], setLoading = _b[1];
    var _c = tslib_1.__read((0, react_1.useState)(null), 2), error = _c[0], setError = _c[1];
    var sp = (0, PnPConfig_1.getSP)();
    var service = (0, react_1.useMemo)(function () { return new AuditService_1.AuditService(sp); }, [sp]);
    var search = (0, react_1.useCallback)(function (filters) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, service.getEntries(filters, 200)];
                case 2:
                    data = _a.sent();
                    setEntries(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : "Failed to load audit log");
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [service]);
    return { entries: entries, loading: loading, error: error, search: search };
};
exports.useAuditLog = useAuditLog;
//# sourceMappingURL=useAuditLog.js.map