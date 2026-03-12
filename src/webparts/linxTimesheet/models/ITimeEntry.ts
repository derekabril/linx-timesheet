import { EntryType, EntryStatus } from "./enums";

export interface ITimeEntry {
  Id: number;
  Title: string;
  EmployeeId: number;
  EmployeeTitle?: string;
  EntryDate: string;
  ClockIn: string | null;
  ClockOut: string | null;
  BreakMinutes: number;
  TotalHours: number;
  EntryType: EntryType;
  ProjectId: number | null;
  ProjectTitle?: string;
  TaskId: number | null;
  TaskTitle?: string;
  Notes: string;
  Status: EntryStatus;
  SubmissionId: number | null;
  IsOvertime: boolean;
  OvertimeHours: number;
  WeekNumber: number;
  Year: number;
  Created: string;
  Modified: string;
}

export interface ITimeEntryCreate {
  Title: string;
  EmployeeId: number;
  EntryDate: string;
  ClockIn?: string;
  ClockOut?: string;
  BreakMinutes: number;
  TotalHours: number;
  EntryType: EntryType;
  ProjectId?: number;
  TaskId?: number;
  Notes: string;
  Status: EntryStatus;
  IsOvertime: boolean;
  OvertimeHours: number;
  WeekNumber: number;
  Year: number;
}

export interface ITimeEntryFormData {
  entryDate: Date;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  projectId: number | null;
  taskId: number | null;
  notes: string;
  entryType: EntryType;
}
