"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidayService = void 0;
var tslib_1 = require("tslib");
var constants_1 = require("../utils/constants");
var HolidayService = /** @class */ (function () {
    function HolidayService(sp) {
        this.sp = sp;
    }
    HolidayService.prototype.getByYear = function (year) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.sp.web.lists
                        .getByTitle(constants_1.LIST_NAMES.HOLIDAYS)
                        .items.filter("Year eq ".concat(year, " or IsRecurring eq 1"))
                        .select("Id", "Title", "HolidayDate", "Year", "IsRecurring")
                        .orderBy("HolidayDate", true)
                        .top(100)()];
            });
        });
    };
    HolidayService.prototype.create = function (holiday) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.HOLIDAYS)
                            .items.add(holiday)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    HolidayService.prototype.update = function (id, updates) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.HOLIDAYS)
                            .items.getById(id)
                            .update(updates)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HolidayService.prototype.delete = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists
                            .getByTitle(constants_1.LIST_NAMES.HOLIDAYS)
                            .items.getById(id)
                            .delete()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if a specific date is a holiday.
     */
    HolidayService.prototype.isHoliday = function (date, holidays) {
        var dateStr = date.toISOString().split("T")[0];
        return holidays.some(function (h) {
            var holidayDate = h.HolidayDate.split("T")[0];
            return holidayDate === dateStr;
        });
    };
    return HolidayService;
}());
exports.HolidayService = HolidayService;
//# sourceMappingURL=HolidayService.js.map