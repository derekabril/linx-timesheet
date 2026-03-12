"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
var tslib_1 = require("tslib");
var UserService = /** @class */ (function () {
    function UserService(sp) {
        this.sp = sp;
    }
    /**
     * Get the current logged-in user's details.
     */
    UserService.prototype.getCurrentUser = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var user, profile, managerLogin, managerId, managerTitle, managerUser, _a;
            var _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.sp.web.currentUser()];
                    case 1:
                        user = _d.sent();
                        return [4 /*yield*/, this.sp.profiles.myProperties()];
                    case 2:
                        profile = _d.sent();
                        managerLogin = (_c = (_b = profile.UserProfileProperties) === null || _b === void 0 ? void 0 : _b.find(function (p) { return p.Key === "Manager"; })) === null || _c === void 0 ? void 0 : _c.Value;
                        managerId = null;
                        managerTitle = null;
                        if (!managerLogin) return [3 /*break*/, 6];
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.sp.web.ensureUser(managerLogin)];
                    case 4:
                        managerUser = _d.sent();
                        managerId = managerUser.Id;
                        managerTitle = managerUser.Title;
                        return [3 /*break*/, 6];
                    case 5:
                        _a = _d.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, {
                            id: user.Id,
                            loginName: user.LoginName,
                            displayName: user.Title,
                            email: user.Email,
                            jobTitle: profile.Title || "",
                            managerId: managerId,
                            managerTitle: managerTitle,
                            isSiteAdmin: user.IsSiteAdmin,
                        }];
                }
            });
        });
    };
    /**
     * Check if the current user is a manager (has direct reports).
     */
    UserService.prototype.isManager = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var reports, _a;
            var _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.profiles.myProperties.select("DirectReports")()];
                    case 1:
                        reports = _d.sent();
                        return [2 /*return*/, ((_c = (_b = reports.DirectReports) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0];
                    case 2:
                        _a = _d.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map