"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListProvisioningService = void 0;
var tslib_1 = require("tslib");
require("@pnp/sp/lists");
require("@pnp/sp/fields");
require("@pnp/sp/views");
var constants_1 = require("../utils/constants");
var IConfiguration_1 = require("../models/IConfiguration");
/**
 * Provisions all SharePoint lists required by Linx Timesheet.
 * Called on first load; safely skips lists that already exist.
 */
var ListProvisioningService = /** @class */ (function () {
    function ListProvisioningService(sp) {
        this.sp = sp;
    }
    /**
     * Quick check: if the Configuration list already has items, all lists
     * were provisioned in a prior session — skip the expensive field-by-field
     * checks entirely.
     */
    ListProvisioningService.prototype.isAlreadyProvisioned = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle(constants_1.LIST_NAMES.CONFIGURATION)
                                .items.top(1)()];
                    case 1:
                        items = _b.sent();
                        return [2 /*return*/, items.length > 0];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ListProvisioningService.prototype.ensureAllLists = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isAlreadyProvisioned()];
                    case 1:
                        // Skip provisioning if lists already exist and are seeded
                        if (_a.sent())
                            return [2 /*return*/];
                        return [4 /*yield*/, Promise.all([
                                this.ensureList(constants_1.LIST_NAMES.TIME_ENTRIES, this.timeEntriesFields()),
                                this.ensureList(constants_1.LIST_NAMES.PROJECTS, this.projectsFields()),
                                this.ensureList(constants_1.LIST_NAMES.TASKS, this.tasksFields()),
                                this.ensureList(constants_1.LIST_NAMES.LEAVE_REQUESTS, this.leaveRequestsFields()),
                                this.ensureList(constants_1.LIST_NAMES.SUBMISSIONS, this.submissionsFields()),
                                this.ensureList(constants_1.LIST_NAMES.AUDIT_LOG, this.auditLogFields()),
                                this.ensureList(constants_1.LIST_NAMES.CONFIGURATION, this.configurationFields()),
                                this.ensureList(constants_1.LIST_NAMES.HOLIDAYS, this.holidaysFields()),
                            ])];
                    case 2:
                        _a.sent();
                        // Create lookup fields after all lists exist
                        return [4 /*yield*/, this.ensureLookupFields()];
                    case 3:
                        // Create lookup fields after all lists exist
                        _a.sent();
                        return [4 /*yield*/, this.seedDefaultConfiguration()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ListProvisioningService.prototype.ensureList = function (title, fields) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, list, fields_1, fields_1_1, field, e_1_1;
            var e_1, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 4]);
                        // Check if the list exists
                        return [4 /*yield*/, this.sp.web.lists.getByTitle(title)()];
                    case 1:
                        // Check if the list exists
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        _a = _c.sent();
                        // List doesn't exist, create it (100 = GenericList template)
                        return [4 /*yield*/, this.sp.web.lists.add(title, "Linx Timesheet - ".concat(title), 100, false)];
                    case 3:
                        // List doesn't exist, create it (100 = GenericList template)
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        list = this.sp.web.lists.getByTitle(title);
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 10, 11, 12]);
                        fields_1 = tslib_1.__values(fields), fields_1_1 = fields_1.next();
                        _c.label = 6;
                    case 6:
                        if (!!fields_1_1.done) return [3 /*break*/, 9];
                        field = fields_1_1.value;
                        return [4 /*yield*/, this.addField(list, field)];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8:
                        fields_1_1 = fields_1.next();
                        return [3 /*break*/, 6];
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        e_1_1 = _c.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 11:
                        try {
                            if (fields_1_1 && !fields_1_1.done && (_b = fields_1.return)) _b.call(fields_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    ListProvisioningService.prototype.addField = function (list, field) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, f, e_2;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 24, , 25]);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, list.fields.getByInternalNameOrTitle(field.name)()];
                    case 2:
                        _c.sent();
                        return [2 /*return*/]; // Field exists, nothing to do
                    case 3:
                        _a = _c.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        _b = field.type;
                        switch (_b) {
                            case "Text": return [3 /*break*/, 5];
                            case "Note": return [3 /*break*/, 7];
                            case "Number": return [3 /*break*/, 9];
                            case "Currency": return [3 /*break*/, 11];
                            case "DateTime": return [3 /*break*/, 13];
                            case "Boolean": return [3 /*break*/, 15];
                            case "Choice": return [3 /*break*/, 17];
                            case "User": return [3 /*break*/, 19];
                        }
                        return [3 /*break*/, 21];
                    case 5: return [4 /*yield*/, list.fields.addText(field.name, { MaxLength: 255 })];
                    case 6:
                        _c.sent();
                        return [3 /*break*/, 21];
                    case 7: return [4 /*yield*/, list.fields.addMultilineText(field.name, {
                            NumberOfLines: 6,
                            RichText: false,
                        })];
                    case 8:
                        _c.sent();
                        return [3 /*break*/, 21];
                    case 9: return [4 /*yield*/, list.fields.addNumber(field.name, { MinimumValue: undefined, MaximumValue: undefined })];
                    case 10:
                        _c.sent();
                        return [3 /*break*/, 21];
                    case 11: return [4 /*yield*/, list.fields.addCurrency(field.name, {
                            MinimumValue: 0,
                            MaximumValue: undefined,
                            CurrencyLocaleId: 1033,
                        })];
                    case 12:
                        _c.sent();
                        return [3 /*break*/, 21];
                    case 13: return [4 /*yield*/, list.fields.addDateTime(field.name, {
                            DisplayFormat: field.dateOnly ? 1 : 0, // 1 = DateOnly, 0 = DateTime
                        })];
                    case 14:
                        _c.sent();
                        return [3 /*break*/, 21];
                    case 15: return [4 /*yield*/, list.fields.addBoolean(field.name)];
                    case 16:
                        _c.sent();
                        return [3 /*break*/, 21];
                    case 17: return [4 /*yield*/, list.fields.addChoice(field.name, {
                            Choices: field.choices || [],
                        })];
                    case 18:
                        _c.sent();
                        return [3 /*break*/, 21];
                    case 19: return [4 /*yield*/, list.fields.addUser(field.name, { SelectionMode: 0 })];
                    case 20:
                        _c.sent(); // 0 = PeopleOnly
                        return [3 /*break*/, 21];
                    case 21:
                        if (!field.indexed) return [3 /*break*/, 23];
                        f = list.fields.getByInternalNameOrTitle(field.name);
                        return [4 /*yield*/, f.update({ Indexed: true })];
                    case 22:
                        _c.sent();
                        _c.label = 23;
                    case 23: return [3 /*break*/, 25];
                    case 24:
                        e_2 = _c.sent();
                        console.warn("Failed to add field ".concat(field.name, ": ").concat(e_2));
                        return [3 /*break*/, 25];
                    case 25: return [2 /*return*/];
                }
            });
        });
    };
    ListProvisioningService.prototype.lookupFieldDefs = function () {
        return [
            { sourceList: constants_1.LIST_NAMES.TIME_ENTRIES, fieldName: "Project", lookupList: constants_1.LIST_NAMES.PROJECTS, lookupField: "Title", indexed: true },
            { sourceList: constants_1.LIST_NAMES.TIME_ENTRIES, fieldName: "Task", lookupList: constants_1.LIST_NAMES.TASKS, lookupField: "Title" },
            { sourceList: constants_1.LIST_NAMES.TIME_ENTRIES, fieldName: "Submission", lookupList: constants_1.LIST_NAMES.SUBMISSIONS, lookupField: "Title" },
            { sourceList: constants_1.LIST_NAMES.TASKS, fieldName: "Project", lookupList: constants_1.LIST_NAMES.PROJECTS, lookupField: "Title" },
        ];
    };
    ListProvisioningService.prototype.ensureLookupFields = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, def, e_3_1;
            var e_3, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _a = tslib_1.__values(this.lookupFieldDefs()), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        def = _b.value;
                        return [4 /*yield*/, this.addLookupField(def)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_3_1 = _d.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ListProvisioningService.prototype.addLookupField = function (def) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sourceList, _a, lookupListInfo, lookupListId, f, e_4;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        sourceList = this.sp.web.lists.getByTitle(def.sourceList);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, sourceList.fields.getByInternalNameOrTitle(def.fieldName)()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/]; // Already exists
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, this.sp.web.lists.getByTitle(def.lookupList).select("Id")()];
                    case 5:
                        lookupListInfo = _b.sent();
                        lookupListId = lookupListInfo.Id;
                        return [4 /*yield*/, sourceList.fields.addLookup(def.fieldName, {
                                LookupListId: lookupListId,
                                LookupFieldName: def.lookupField,
                            })];
                    case 6:
                        _b.sent();
                        if (!def.indexed) return [3 /*break*/, 8];
                        f = sourceList.fields.getByInternalNameOrTitle(def.fieldName);
                        return [4 /*yield*/, f.update({ Indexed: true })];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        e_4 = _b.sent();
                        console.warn("Failed to add lookup field ".concat(def.fieldName, " on ").concat(def.sourceList, ": ").concat(e_4));
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ListProvisioningService.prototype.seedDefaultConfiguration = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items, list, defaults, defaults_1, defaults_1_1, item, e_5_1, e_6;
            var e_5, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle(constants_1.LIST_NAMES.CONFIGURATION)
                                .items.top(1)()];
                    case 1:
                        items = _b.sent();
                        if (items.length > 0)
                            return [2 /*return*/]; // Already seeded
                        list = this.sp.web.lists.getByTitle(constants_1.LIST_NAMES.CONFIGURATION);
                        defaults = [
                            { Title: "OvertimeDailyThreshold", SettingValue: String(IConfiguration_1.DEFAULT_CONFIG.overtimeDailyThreshold), SettingCategory: "Overtime" },
                            { Title: "OvertimeWeeklyThreshold", SettingValue: String(IConfiguration_1.DEFAULT_CONFIG.overtimeWeeklyThreshold), SettingCategory: "Overtime" },
                            { Title: "SubmissionPeriod", SettingValue: IConfiguration_1.DEFAULT_CONFIG.submissionPeriod, SettingCategory: "Workflow" },
                            { Title: "WorkingDaysPerWeek", SettingValue: String(IConfiguration_1.DEFAULT_CONFIG.workingDaysPerWeek), SettingCategory: "General" },
                            { Title: "DefaultBreakMinutes", SettingValue: String(IConfiguration_1.DEFAULT_CONFIG.defaultBreakMinutes), SettingCategory: "General" },
                            { Title: "LeaveBalances", SettingValue: JSON.stringify(IConfiguration_1.DEFAULT_CONFIG.leaveBalances), SettingCategory: "Leave" },
                        ];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 9]);
                        defaults_1 = tslib_1.__values(defaults), defaults_1_1 = defaults_1.next();
                        _b.label = 3;
                    case 3:
                        if (!!defaults_1_1.done) return [3 /*break*/, 6];
                        item = defaults_1_1.value;
                        return [4 /*yield*/, list.items.add(item)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        defaults_1_1 = defaults_1.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_5_1 = _b.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (defaults_1_1 && !defaults_1_1.done && (_a = defaults_1.return)) _a.call(defaults_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        e_6 = _b.sent();
                        console.warn("Failed to seed default configuration:", e_6);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    // ── Field definitions ────────────────────────────────────────────────
    ListProvisioningService.prototype.timeEntriesFields = function () {
        return [
            { name: "Employee", type: "User", indexed: true },
            { name: "EntryDate", type: "DateTime", dateOnly: true, indexed: true },
            { name: "ClockIn", type: "DateTime" },
            { name: "ClockOut", type: "DateTime" },
            { name: "BreakMinutes", type: "Number" },
            { name: "TotalHours", type: "Number" },
            { name: "EntryType", type: "Choice", indexed: true, choices: ["Clock", "Manual", "Timer"] },
            { name: "Notes", type: "Note" },
            { name: "Status", type: "Choice", indexed: true, choices: ["Active", "Completed", "Voided"] },
            { name: "IsOvertime", type: "Boolean" },
            { name: "OvertimeHours", type: "Number" },
            { name: "WeekNumber", type: "Number", indexed: true },
            { name: "Year", type: "Number", indexed: true },
        ];
    };
    ListProvisioningService.prototype.projectsFields = function () {
        return [
            { name: "ProjectCode", type: "Text", indexed: true },
            { name: "Client", type: "Text", indexed: true },
            { name: "Description", type: "Note" },
            { name: "ProjectManager", type: "User" },
            { name: "PlannedHours", type: "Number" },
            { name: "ActualHours", type: "Number" },
            { name: "StartDate", type: "DateTime", dateOnly: true },
            { name: "EndDate", type: "DateTime", dateOnly: true },
            { name: "IsActive", type: "Boolean", indexed: true },
            { name: "HourlyRate", type: "Currency" },
        ];
    };
    ListProvisioningService.prototype.tasksFields = function () {
        return [
            { name: "TaskCode", type: "Text" },
            { name: "PlannedHours", type: "Number" },
            { name: "IsActive", type: "Boolean" },
        ];
    };
    ListProvisioningService.prototype.leaveRequestsFields = function () {
        return [
            { name: "Employee", type: "User", indexed: true },
            { name: "LeaveType", type: "Choice", indexed: true, choices: ["Vacation", "Sick", "Personal", "Bereavement", "Other"] },
            { name: "StartDate", type: "DateTime", dateOnly: true, indexed: true },
            { name: "EndDate", type: "DateTime", dateOnly: true },
            { name: "TotalDays", type: "Number" },
            { name: "Status", type: "Choice", indexed: true, choices: ["Draft", "Submitted", "Approved", "Rejected", "Cancelled"] },
            { name: "Approver", type: "User", indexed: true },
            { name: "ApproverComments", type: "Note" },
            { name: "RequestDate", type: "DateTime" },
            { name: "Year", type: "Number", indexed: true },
        ];
    };
    ListProvisioningService.prototype.submissionsFields = function () {
        return [
            { name: "Employee", type: "User", indexed: true },
            { name: "PeriodStart", type: "DateTime", dateOnly: true, indexed: true },
            { name: "PeriodEnd", type: "DateTime", dateOnly: true },
            { name: "TotalHours", type: "Number" },
            { name: "OvertimeHours", type: "Number" },
            { name: "RegularHours", type: "Number" },
            { name: "Status", type: "Choice", indexed: true, choices: ["Draft", "Submitted", "Approved", "Rejected", "Processed", "Cancelled"] },
            { name: "Approver", type: "User", indexed: true },
            { name: "SubmittedDate", type: "DateTime" },
            { name: "ApprovedDate", type: "DateTime" },
            { name: "ApproverComments", type: "Note" },
            { name: "WeekNumber", type: "Number", indexed: true },
            { name: "Year", type: "Number", indexed: true },
        ];
    };
    ListProvisioningService.prototype.auditLogFields = function () {
        return [
            { name: "Action", type: "Choice", indexed: true, choices: ["Create", "Update", "Delete", "Submit", "Approve", "Reject", "ClockIn", "ClockOut"] },
            { name: "TargetList", type: "Text", indexed: true },
            { name: "TargetItemId", type: "Number", indexed: true },
            { name: "PerformedBy", type: "User", indexed: true },
            { name: "ActionDate", type: "DateTime", indexed: true },
            { name: "PreviousValue", type: "Note" },
            { name: "NewValue", type: "Note" },
            { name: "Year", type: "Number", indexed: true },
        ];
    };
    ListProvisioningService.prototype.configurationFields = function () {
        return [
            { name: "SettingValue", type: "Note" },
            { name: "SettingCategory", type: "Choice", choices: ["Overtime", "Leave", "General", "Workflow"] },
            { name: "Description", type: "Note" },
        ];
    };
    ListProvisioningService.prototype.holidaysFields = function () {
        return [
            { name: "HolidayDate", type: "DateTime", dateOnly: true, indexed: true },
            { name: "Year", type: "Number", indexed: true },
            { name: "IsRecurring", type: "Boolean" },
        ];
    };
    return ListProvisioningService;
}());
exports.ListProvisioningService = ListProvisioningService;
//# sourceMappingURL=ListProvisioningService.js.map