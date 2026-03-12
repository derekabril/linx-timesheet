"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfiguration = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var PnPConfig_1 = require("../services/PnPConfig");
var ConfigurationService_1 = require("../services/ConfigurationService");
var AppContext_1 = require("../context/AppContext");
var useConfiguration = function () {
    var _a = (0, AppContext_1.useAppContext)(), configuration = _a.configuration, refreshConfig = _a.refreshConfig;
    var _b = tslib_1.__read((0, react_1.useState)(false), 2), saving = _b[0], setSaving = _b[1];
    var _c = tslib_1.__read((0, react_1.useState)(null), 2), error = _c[0], setError = _c[1];
    var sp = (0, PnPConfig_1.getSP)();
    var service = (0, react_1.useMemo)(function () { return new ConfigurationService_1.ConfigurationService(sp); }, [sp]);
    var saveConfiguration = (0, react_1.useCallback)(function (config) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSaving(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, service.saveAll(config)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, refreshConfig()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : "Failed to save configuration");
                    throw err_1;
                case 5:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [service, refreshConfig]);
    return { configuration: configuration, saving: saving, error: error, saveConfiguration: saveConfiguration };
};
exports.useConfiguration = useConfiguration;
//# sourceMappingURL=useConfiguration.js.map