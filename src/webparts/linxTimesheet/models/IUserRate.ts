export interface IUserRate {
  Id: number;
  Title: string;
  EmployeeId: number;
  EmployeeTitle?: string;
  HourlyRate: number;
  MaxHoursPerDay: number;
  ContractType: string;
}

export interface IUserRateCreate {
  Title: string;
  EmployeeId: number;
  HourlyRate: number;
  MaxHoursPerDay: number;
  ContractType: string;
}
