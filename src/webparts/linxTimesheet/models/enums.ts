export enum EntryType {
  Clock = "Clock",
  Manual = "Manual",
  Timer = "Timer",
}

export enum EntryStatus {
  Active = "Active",
  Completed = "Completed",
  Voided = "Voided",
}

export enum SubmissionStatus {
  Draft = "Draft",
  Submitted = "Submitted",
  Approved = "Approved",
  Rejected = "Rejected",
  Processed = "Processed",
  Cancelled = "Cancelled",
}

export enum LeaveType {
  Vacation = "Vacation",
  Sick = "Sick",
  Personal = "Personal",
  Bereavement = "Bereavement",
  Other = "Other",
}

export enum LeaveStatus {
  Draft = "Draft",
  Submitted = "Submitted",
  Approved = "Approved",
  Rejected = "Rejected",
  Cancelled = "Cancelled",
}

export enum AuditAction {
  Create = "Create",
  Update = "Update",
  Delete = "Delete",
  Submit = "Submit",
  Approve = "Approve",
  Reject = "Reject",
  ClockIn = "ClockIn",
  ClockOut = "ClockOut",
}

export enum SettingCategory {
  Overtime = "Overtime",
  Leave = "Leave",
  General = "General",
  Workflow = "Workflow",
}

export enum ContractType {
  Regular = "Regular",
  Contractual = "Contractual",
}

export enum HolidayCategory {
  Regular = "Regular",
  Special = "Special",
}

export enum IncentiveFrequency {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
}

export enum IncentiveType {
  Individual = "Individual",
  Team = "Team",
  Company = "Company",
}

export enum AppTab {
  Timesheet = "timesheet",
  Projects = "projects",
  Leave = "leave",
  Approvals = "approvals",
  Reports = "reports",
  Payroll = "payroll",
  Admin = "admin",
}
