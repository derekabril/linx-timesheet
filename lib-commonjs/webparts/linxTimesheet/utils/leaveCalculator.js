"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateLeaveBalances = calculateLeaveBalances;
exports.validateLeaveBalance = validateLeaveBalance;
var enums_1 = require("../models/enums");
/**
 * Calculate leave balances for an employee for a given year.
 */
function calculateLeaveBalances(requests, config) {
    var leaveTypes = [
        enums_1.LeaveType.Vacation,
        enums_1.LeaveType.Sick,
        enums_1.LeaveType.Personal,
        enums_1.LeaveType.Bereavement,
        enums_1.LeaveType.Other,
    ];
    return leaveTypes.map(function (type) {
        var allocated = config.leaveBalances[type] || 0;
        var used = requests
            .filter(function (r) { return r.LeaveType === type && r.Status === enums_1.LeaveStatus.Approved; })
            .reduce(function (sum, r) { return sum + r.TotalDays; }, 0);
        var pending = requests
            .filter(function (r) { return r.LeaveType === type && r.Status === enums_1.LeaveStatus.Submitted; })
            .reduce(function (sum, r) { return sum + r.TotalDays; }, 0);
        return {
            leaveType: type,
            allocated: allocated,
            used: used,
            pending: pending,
            remaining: allocated - used,
        };
    });
}
/**
 * Validate that a leave request doesn't exceed remaining balance.
 */
function validateLeaveBalance(balance, requestedDays) {
    if (requestedDays <= 0) {
        return { valid: false, message: "Requested days must be greater than 0." };
    }
    if (requestedDays > balance.remaining) {
        return {
            valid: false,
            message: "Insufficient ".concat(balance.leaveType, " leave balance. Remaining: ").concat(balance.remaining, " days, Requested: ").concat(requestedDays, " days."),
        };
    }
    return { valid: true };
}
//# sourceMappingURL=leaveCalculator.js.map