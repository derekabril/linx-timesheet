export interface IProject {
  Id: number;
  Title: string;
  ProjectCode: string;
  Client: string;
  Description: string;
  ProjectManagerId: number;
  ProjectManagerTitle?: string;
  PlannedHours: number;
  ActualHours: number;
  StartDate: string | null;
  EndDate: string | null;
  IsActive: boolean;
  HourlyRate: number;
  Created: string;
  Modified: string;
}

export interface IProjectCreate {
  Title: string;
  ProjectCode: string;
  Client: string;
  Description: string;
  ProjectManagerId: number;
  PlannedHours: number;
  ActualHours: number;
  StartDate?: string;
  EndDate?: string;
  IsActive: boolean;
  HourlyRate: number;
}
