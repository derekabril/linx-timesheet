export const LIST_NAMES = {
  TIME_ENTRIES: "LinxTimeEntries",
  PROJECTS: "LinxProjects",
  TASKS: "LinxTasks",
  LEAVE_REQUESTS: "LinxLeaveRequests",
  SUBMISSIONS: "LinxTimesheetSubmissions",
  AUDIT_LOG: "LinxAuditLog",
  CONFIGURATION: "LinxConfiguration",
  HOLIDAYS: "LinxHolidays",
} as const;

export const TIME_ENTRY_FIELDS = {
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
} as const;

export const PROJECT_FIELDS = {
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
} as const;

export const SUBMISSION_FIELDS = {
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
} as const;

export const PAGE_SIZE = 50;
export const MAX_ITEMS_PER_QUERY = 500;
