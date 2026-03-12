"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_ITEMS_PER_QUERY = exports.PAGE_SIZE = exports.SUBMISSION_FIELDS = exports.PROJECT_FIELDS = exports.TIME_ENTRY_FIELDS = exports.LIST_NAMES = void 0;
exports.LIST_NAMES = {
    TIME_ENTRIES: "LinxTimeEntries",
    PROJECTS: "LinxProjects",
    TASKS: "LinxTasks",
    LEAVE_REQUESTS: "LinxLeaveRequests",
    SUBMISSIONS: "LinxTimesheetSubmissions",
    AUDIT_LOG: "LinxAuditLog",
    CONFIGURATION: "LinxConfiguration",
    HOLIDAYS: "LinxHolidays",
};
exports.TIME_ENTRY_FIELDS = {
    SELECT: [
        "Id",
        "Title",
        "EmployeeId",
        "Employee/Title",
        "EntryDate",
        "ClockIn",
        "ClockOut",
        "BreakMinutes",
        "TotalHours",
        "EntryType",
        "ProjectId",
        "Project/Title",
        "TaskId",
        "Task/Title",
        "Notes",
        "Status",
        "SubmissionId",
        "IsOvertime",
        "OvertimeHours",
        "WeekNumber",
        "Year",
        "Created",
        "Modified",
    ],
    EXPAND: ["Employee", "Project", "Task"],
};
exports.PROJECT_FIELDS = {
    SELECT: [
        "Id",
        "Title",
        "ProjectCode",
        "Client",
        "Description",
        "ProjectManagerId",
        "ProjectManager/Title",
        "PlannedHours",
        "ActualHours",
        "StartDate",
        "EndDate",
        "IsActive",
        "HourlyRate",
        "Created",
        "Modified",
    ],
    EXPAND: ["ProjectManager"],
};
exports.SUBMISSION_FIELDS = {
    SELECT: [
        "Id",
        "Title",
        "EmployeeId",
        "Employee/Title",
        "PeriodStart",
        "PeriodEnd",
        "TotalHours",
        "OvertimeHours",
        "RegularHours",
        "Status",
        "ApproverId",
        "Approver/Title",
        "SubmittedDate",
        "ApprovedDate",
        "ApproverComments",
        "WeekNumber",
        "Year",
        "Created",
        "Modified",
    ],
    EXPAND: ["Employee", "Approver"],
};
exports.PAGE_SIZE = 50;
exports.MAX_ITEMS_PER_QUERY = 500;
//# sourceMappingURL=constants.js.map