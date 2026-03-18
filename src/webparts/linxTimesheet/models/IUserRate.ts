export interface IUserRate {
  Id: number;
  Title: string;
  EmployeeId: number;
  EmployeeTitle?: string;
  HourlyRate: number;
}

export interface IUserRateCreate {
  Title: string;
  EmployeeId: number;
  HourlyRate: number;
}
