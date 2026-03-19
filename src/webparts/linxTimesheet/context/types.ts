import { IUser } from "../models/IUser";
import { IAppConfiguration } from "../models/IConfiguration";
import { IHoliday } from "../models/IHoliday";
import { ITimeEntry } from "../models/ITimeEntry";
import { ITimesheetSubmission } from "../models/ITimesheetSubmission";

export interface IAppContextState {
  currentUser: IUser | null;
  isManager: boolean;
  isAdmin: boolean;
  isSiteOwner: boolean;
  isBookkeeper: boolean;
  configuration: IAppConfiguration;
  holidays: IHoliday[];
  isLoading: boolean;
  error: string | null;
}

export interface IAppContextActions {
  refreshConfig: () => Promise<void>;
  refreshHolidays: () => Promise<void>;
}

export type IAppContext = IAppContextState & IAppContextActions;

export interface ITimesheetContextState {
  selectedDate: Date;
  selectedWeek: { year: number; weekNumber: number };
  todayEntries: ITimeEntry[];
  weekEntries: ITimeEntry[];
  activeClockEntry: ITimeEntry | null;
  currentSubmission: ITimesheetSubmission | null;
  isLoading: boolean;
  error: string | null;
}

export interface ITimesheetContextActions {
  setSelectedDate: (date: Date) => void;
  refreshTodayEntries: () => Promise<void>;
  refreshWeekEntries: () => Promise<void>;
  refreshActiveEntry: () => Promise<void>;
  refreshSubmission: () => Promise<void>;
}

export type ITimesheetContext = ITimesheetContextState & ITimesheetContextActions;
