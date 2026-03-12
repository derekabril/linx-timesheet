import { SubmissionStatus } from "./enums";

export interface ITimesheetSubmission {
  Id: number;
  Title: string;
  EmployeeId: number;
  EmployeeTitle?: string;
  PeriodStart: string;
  PeriodEnd: string;
  TotalHours: number;
  OvertimeHours: number;
  RegularHours: number;
  Status: SubmissionStatus;
  ApproverId: number;
  ApproverTitle?: string;
  SubmittedDate: string | null;
  ApprovedDate: string | null;
  ApproverComments: string;
  WeekNumber: number;
  Year: number;
  Created: string;
  Modified: string;
}

export interface ITimesheetSubmissionCreate {
  Title: string;
  EmployeeId: number;
  PeriodStart: string;
  PeriodEnd: string;
  TotalHours: number;
  OvertimeHours: number;
  RegularHours: number;
  Status: SubmissionStatus;
  ApproverId: number;
  WeekNumber: number;
  Year: number;
}
