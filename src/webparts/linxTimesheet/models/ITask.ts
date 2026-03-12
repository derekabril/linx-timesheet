export interface ITask {
  Id: number;
  Title: string;
  ProjectId: number;
  ProjectTitle?: string;
  TaskCode: string;
  PlannedHours: number;
  IsActive: boolean;
  Created: string;
  Modified: string;
}

export interface ITaskCreate {
  Title: string;
  ProjectId: number;
  TaskCode: string;
  PlannedHours: number;
  IsActive: boolean;
}
