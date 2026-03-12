import { LeaveType, LeaveStatus } from "./enums";

export interface ILeaveRequest {
  Id: number;
  Title: string;
  EmployeeId: number;
  EmployeeTitle?: string;
  LeaveType: LeaveType;
  StartDate: string;
  EndDate: string;
  TotalDays: number;
  Status: LeaveStatus;
  ApproverId: number;
  ApproverTitle?: string;
  ApproverComments: string;
  RequestDate: string;
  Year: number;
  Created: string;
  Modified: string;
}

export interface ILeaveRequestCreate {
  Title: string;
  EmployeeId: number;
  LeaveType: LeaveType;
  StartDate: string;
  EndDate: string;
  TotalDays: number;
  Status: LeaveStatus;
  ApproverId: number;
  ApproverComments: string;
  RequestDate: string;
  Year: number;
}

export interface ILeaveBalance {
  leaveType: LeaveType;
  allocated: number;
  used: number;
  pending: number;
  remaining: number;
}
