"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppTab = exports.SettingCategory = exports.AuditAction = exports.LeaveStatus = exports.LeaveType = exports.SubmissionStatus = exports.EntryStatus = exports.EntryType = void 0;
var EntryType;
(function (EntryType) {
    EntryType["Clock"] = "Clock";
    EntryType["Manual"] = "Manual";
    EntryType["Timer"] = "Timer";
})(EntryType || (exports.EntryType = EntryType = {}));
var EntryStatus;
(function (EntryStatus) {
    EntryStatus["Active"] = "Active";
    EntryStatus["Completed"] = "Completed";
    EntryStatus["Voided"] = "Voided";
})(EntryStatus || (exports.EntryStatus = EntryStatus = {}));
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["Draft"] = "Draft";
    SubmissionStatus["Submitted"] = "Submitted";
    SubmissionStatus["Approved"] = "Approved";
    SubmissionStatus["Rejected"] = "Rejected";
    SubmissionStatus["Processed"] = "Processed";
    SubmissionStatus["Cancelled"] = "Cancelled";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
var LeaveType;
(function (LeaveType) {
    LeaveType["Vacation"] = "Vacation";
    LeaveType["Sick"] = "Sick";
    LeaveType["Personal"] = "Personal";
    LeaveType["Bereavement"] = "Bereavement";
    LeaveType["Other"] = "Other";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
var LeaveStatus;
(function (LeaveStatus) {
    LeaveStatus["Draft"] = "Draft";
    LeaveStatus["Submitted"] = "Submitted";
    LeaveStatus["Approved"] = "Approved";
    LeaveStatus["Rejected"] = "Rejected";
    LeaveStatus["Cancelled"] = "Cancelled";
})(LeaveStatus || (exports.LeaveStatus = LeaveStatus = {}));
var AuditAction;
(function (AuditAction) {
    AuditAction["Create"] = "Create";
    AuditAction["Update"] = "Update";
    AuditAction["Delete"] = "Delete";
    AuditAction["Submit"] = "Submit";
    AuditAction["Approve"] = "Approve";
    AuditAction["Reject"] = "Reject";
    AuditAction["ClockIn"] = "ClockIn";
    AuditAction["ClockOut"] = "ClockOut";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
var SettingCategory;
(function (SettingCategory) {
    SettingCategory["Overtime"] = "Overtime";
    SettingCategory["Leave"] = "Leave";
    SettingCategory["General"] = "General";
    SettingCategory["Workflow"] = "Workflow";
})(SettingCategory || (exports.SettingCategory = SettingCategory = {}));
var AppTab;
(function (AppTab) {
    AppTab["Timesheet"] = "timesheet";
    AppTab["Projects"] = "projects";
    AppTab["Leave"] = "leave";
    AppTab["Approvals"] = "approvals";
    AppTab["Reports"] = "reports";
    AppTab["Admin"] = "admin";
})(AppTab || (exports.AppTab = AppTab = {}));
//# sourceMappingURL=enums.js.map