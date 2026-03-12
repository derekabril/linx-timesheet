"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationService = void 0;
var tslib_1 = require("tslib");
var IConfiguration_1 = require("../models/IConfiguration");
var constants_1 = require("../utils/constants");
var ConfigurationService = /** @class */ (function () {
    function ConfigurationService(sp) {
        this.sp = sp;
    }
    /**
     * Load all configuration items and parse them into IAppConfiguration.
     */
    ConfigurationService.prototype.load = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items, config, configMap, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle(constants_1.LIST_NAMES.CONFIGURATION)
                                .items.select("Id", "Title", "SettingValue", "SettingCategory", "Description")
                                .top(50)()];
                    case 1:
                        items = _b.sent();
                        config = tslib_1.__assign({}, IConfiguration_1.DEFAULT_CONFIG);
                        configMap = new Map(items.map(function (i) { return [i.Title, i.SettingValue]; }));
                        if (configMap.has("OvertimeDailyThreshold")) {
                            config.overtimeDailyThreshold = Number(configMap.get("OvertimeDailyThreshold"));
                        }
                        if (configMap.has("OvertimeWeeklyThreshold")) {
                            config.overtimeWeeklyThreshold = Number(configMap.get("OvertimeWeeklyThreshold"));
                        }
                        if (configMap.has("SubmissionPeriod")) {
                            config.submissionPeriod = configMap.get("SubmissionPeriod");
                        }
                        if (configMap.has("WorkingDaysPerWeek")) {
                            config.workingDaysPerWeek = Number(configMap.get("WorkingDaysPerWeek"));
                        }
                        if (configMap.has("DefaultBreakMinutes")) {
                            config.defaultBreakMinutes = Number(configMap.get("DefaultBreakMinutes"));
                        }
                        if (configMap.has("LeaveBalances")) {
                            try {
                                config.leaveBalances = JSON.parse(configMap.get("LeaveBalances"));
                            }
                            catch (_c) {
                                // Keep defaults
                            }
                        }
                        return [2 /*return*/, config];
                    case 2:
                        _a = _b.sent();
                        // List may not exist yet, return defaults
                        return [2 /*return*/, tslib_1.__assign({}, IConfiguration_1.DEFAULT_CONFIG)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save a single configuration setting.
     */
    ConfigurationService.prototype.saveSetting = function (key, value, category) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.CONFIGURATION)
                            .items.filter("Title eq '".concat(key, "'"))
                            .select("Id")
                            .top(1)()];
                    case 1:
                        items = _a.sent();
                        if (!(items.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle(constants_1.LIST_NAMES.CONFIGURATION)
                                .items.getById(items[0].Id)
                                .update({ SettingValue: value })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.CONFIGURATION)
                            .items.add({
                            Title: key,
                            SettingValue: value,
                            SettingCategory: category,
                        })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save multiple configuration settings at once.
     */
    ConfigurationService.prototype.saveAll = function (config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveSetting("OvertimeDailyThreshold", String(config.overtimeDailyThreshold), "Overtime")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.saveSetting("OvertimeWeeklyThreshold", String(config.overtimeWeeklyThreshold), "Overtime")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.saveSetting("SubmissionPeriod", config.submissionPeriod, "Workflow")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.saveSetting("WorkingDaysPerWeek", String(config.workingDaysPerWeek), "General")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.saveSetting("DefaultBreakMinutes", String(config.defaultBreakMinutes), "General")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.saveSetting("LeaveBalances", JSON.stringify(config.leaveBalances), "Leave")];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ConfigurationService;
}());
exports.ConfigurationService = ConfigurationService;
//# sourceMappingURL=ConfigurationService.js.map