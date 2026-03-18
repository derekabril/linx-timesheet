export interface IProject {
  Id: number;
  Title: string;
  ProjectCode: string;
  Division: string;
  Area: string;
  Client: string;
  Description: string;
  ProjectManagerId: number;
  ProjectManagerTitle?: string;
  TeamMembersId: number[];
  PlannedHours: number;
  ActualHours: number;
  StartDate: string | null;
  EndDate: string | null;
  IsActive: boolean;
  Created: string;
  Modified: string;
}

export interface IProjectCreate {
  Title: string;
  ProjectCode: string;
  Division: string;
  Area: string;
  Client: string;
  Description: string;
  ProjectManagerId: number;
  TeamMembersId?: number[];
  PlannedHours: number;
  ActualHours: number;
  StartDate?: string;
  EndDate?: string;
  IsActive: boolean;
}
