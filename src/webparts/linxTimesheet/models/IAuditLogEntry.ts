import { AuditAction } from "./enums";

export interface IAuditLogEntry {
  Id: number;
  Title: string;
  Action: AuditAction;
  TargetList: string;
  TargetItemId: number;
  PerformedById: number;
  PerformedByTitle?: string;
  ActionDate: string;
  PreviousValue: string;
  NewValue: string;
  Year: number;
  Created: string;
}

export interface IAuditLogCreate {
  Title: string;
  Action: AuditAction;
  TargetList: string;
  TargetItemId: number;
  PerformedById?: number;
  PreviousValue?: string;
  NewValue?: string;
  Year: number;
}
