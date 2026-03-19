import { SettingCategory } from "./enums";

export interface IConfigurationItem {
  Id: number;
  Title: string;
  SettingValue: string;
  SettingCategory: SettingCategory;
  Description: string;
}

export interface IAppConfiguration {
  overtimeDailyThreshold: number;
  overtimeWeeklyThreshold: number;
  submissionPeriod: "Weekly" | "BiWeekly";
  workingDaysPerWeek: number;
  defaultBreakMinutes: number;
  leaveBalances: ILeaveAllocation;
  regularHolidayRate: number;
  specialHolidayRate: number;
  notificationEmail: string;
  ceoEmail: string;
  bookkeeperEmails: string;
}

export interface ILeaveAllocation {
  Vacation: number;
  Sick: number;
  Personal: number;
  Bereavement: number;
  Other: number;
}

export const DEFAULT_CONFIG: IAppConfiguration = {
  overtimeDailyThreshold: 8,
  overtimeWeeklyThreshold: 40,
  submissionPeriod: "Weekly",
  workingDaysPerWeek: 5,
  defaultBreakMinutes: 60,
  leaveBalances: {
    Vacation: 15,
    Sick: 10,
    Personal: 3,
    Bereavement: 5,
    Other: 0,
  },
  regularHolidayRate: 1.0,
  specialHolidayRate: 0.3,
  notificationEmail: "",
  ceoEmail: "",
  bookkeeperEmails: "",
};
