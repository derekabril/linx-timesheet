export interface IIncentive {
  Id: number;
  Title: string;
  Frequency: string;
  Value: number;
  IncentiveType: string;
  IsActive: boolean;
}

export interface IIncentiveCreate {
  Title: string;
  Frequency: string;
  Value: number;
  IncentiveType: string;
  IsActive: boolean;
}

export interface IIncentiveAssignment {
  Id: number;
  Title: string;
  IncentiveId: number;
  IncentiveTitle?: string;
  EmployeeId: number;
  EmployeeTitle?: string;
}

export interface IIncentiveAssignmentCreate {
  Title: string;
  IncentiveId: number;
  EmployeeId: number;
}
