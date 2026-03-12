"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppProvider = exports.useAppContext = exports.AppContext = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var IConfiguration_1 = require("../models/IConfiguration");
var PnPConfig_1 = require("../services/PnPConfig");
var UserService_1 = require("../services/UserService");
var ConfigurationService_1 = require("../services/ConfigurationService");
var HolidayService_1 = require("../services/HolidayService");
var ListProvisioningService_1 = require("../services/ListProvisioningService");
var defaultAppContext = {
    currentUser: null,
    isManager: false,
    isAdmin: false,
    configuration: IConfiguration_1.DEFAULT_CONFIG,
    holidays: [],
    isLoading: true,
    error: null,
    refreshConfig: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    refreshHolidays: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
};
exports.AppContext = React.createContext(defaultAppContext);
var useAppContext = function () { return React.useContext(exports.AppContext); };
exports.useAppContext = useAppContext;
var AppProvider = function (_a) {
    var context = _a.context, children = _a.children;
    var _b = tslib_1.__read(React.useState(null), 2), currentUser = _b[0], setCurrentUser = _b[1];
    var _c = tslib_1.__read(React.useState(false), 2), isManager = _c[0], setIsManager = _c[1];
    var _d = tslib_1.__read(React.useState(false), 2), isAdmin = _d[0], setIsAdmin = _d[1];
    var _e = tslib_1.__read(React.useState(IConfiguration_1.DEFAULT_CONFIG), 2), configuration = _e[0], setConfiguration = _e[1];
    var _f = tslib_1.__read(React.useState([]), 2), holidays = _f[0], setHolidays = _f[1];
    var _g = tslib_1.__read(React.useState(true), 2), isLoading = _g[0], setIsLoading = _g[1];
    var _h = tslib_1.__read(React.useState(null), 2), error = _h[0], setError = _h[1];
    var sp = (0, PnPConfig_1.getSP)();
    var userService = React.useMemo(function () { return new UserService_1.UserService(sp); }, [sp]);
    var configService = React.useMemo(function () { return new ConfigurationService_1.ConfigurationService(sp); }, [sp]);
    var holidayService = React.useMemo(function () { return new HolidayService_1.HolidayService(sp); }, [sp]);
    var refreshConfig = React.useCallback(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var config;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, configService.load()];
                case 1:
                    config = _a.sent();
                    setConfiguration(config);
                    return [2 /*return*/];
            }
        });
    }); }, [configService]);
    var refreshHolidays = React.useCallback(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var year, h;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    year = new Date().getFullYear();
                    return [4 /*yield*/, holidayService.getByYear(year)];
                case 1:
                    h = _a.sent();
                    setHolidays(h);
                    return [2 /*return*/];
            }
        });
    }); }, [holidayService]);
    React.useEffect(function () {
        var init = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var provisioner, _a, user, manager, config, yearHolidays, err_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, 4, 5]);
                        setIsLoading(true);
                        provisioner = new ListProvisioningService_1.ListProvisioningService(sp);
                        return [4 /*yield*/, provisioner.ensureAllLists()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, Promise.all([
                                userService.getCurrentUser(),
                                userService.isManager(),
                                configService.load(),
                                holidayService.getByYear(new Date().getFullYear()),
                            ])];
                    case 2:
                        _a = tslib_1.__read.apply(void 0, [_b.sent(), 4]), user = _a[0], manager = _a[1], config = _a[2], yearHolidays = _a[3];
                        setCurrentUser(user);
                        setIsManager(manager);
                        setIsAdmin(user.isSiteAdmin);
                        setConfiguration(config);
                        setHolidays(yearHolidays);
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _b.sent();
                        setError(err_1 instanceof Error ? err_1.message : "Failed to initialize app.");
                        console.error("AppContext init error:", err_1);
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        init();
    }, []);
    var value = {
        currentUser: currentUser,
        isManager: isManager,
        isAdmin: isAdmin,
        configuration: configuration,
        holidays: holidays,
        isLoading: isLoading,
        error: error,
        refreshConfig: refreshConfig,
        refreshHolidays: refreshHolidays,
    };
    return React.createElement(exports.AppContext.Provider, { value: value }, children);
};
exports.AppProvider = AppProvider;
//# sourceMappingURL=AppContext.js.map