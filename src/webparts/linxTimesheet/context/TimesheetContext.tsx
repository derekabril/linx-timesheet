import * as React from "react";
import { ITimesheetContext } from "./types";
import { ITimeEntry } from "../models/ITimeEntry";
import { ITimesheetSubmission } from "../models/ITimesheetSubmission";
import { getSP } from "../services/PnPConfig";
import { TimeEntryService } from "../services/TimeEntryService";
import { SubmissionService } from "../services/SubmissionService";
import { useAppContext } from "./AppContext";
import { getISOWeekNumber, toDateString } from "../utils/dateUtils";

const defaultTimesheetContext: ITimesheetContext = {
  selectedDate: new Date(),
  selectedWeek: { year: new Date().getFullYear(), weekNumber: getISOWeekNumber(new Date()) },
  todayEntries: [],
  weekEntries: [],
  activeClockEntry: null,
  currentSubmission: null,
  isLoading: false,
  error: null,
  setSelectedDate: () => {},
  refreshTodayEntries: async () => {},
  refreshWeekEntries: async () => {},
  refreshActiveEntry: async () => {},
  refreshSubmission: async () => {},
};

export const TimesheetContext = React.createContext<ITimesheetContext>(defaultTimesheetContext);

export const useTimesheetContext = (): ITimesheetContext => React.useContext(TimesheetContext);

interface ITimesheetProviderProps {
  children: React.ReactNode;
}

export const TimesheetProvider: React.FC<ITimesheetProviderProps> = ({ children }) => {
  const { currentUser } = useAppContext();
  const [selectedDate, setSelectedDateState] = React.useState(new Date());
  const [selectedWeek, setSelectedWeek] = React.useState({
    year: new Date().getFullYear(),
    weekNumber: getISOWeekNumber(new Date()),
  });
  const [todayEntries, setTodayEntries] = React.useState<ITimeEntry[]>([]);
  const [weekEntries, setWeekEntries] = React.useState<ITimeEntry[]>([]);
  const [activeClockEntry, setActiveClockEntry] = React.useState<ITimeEntry | null>(null);
  const [currentSubmission, setCurrentSubmission] = React.useState<ITimesheetSubmission | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const sp = getSP();
  const timeEntryService = React.useMemo(() => new TimeEntryService(sp), [sp]);
  const submissionService = React.useMemo(() => new SubmissionService(sp), [sp]);

  const setSelectedDate = React.useCallback((date: Date) => {
    setSelectedDateState(date);
    setSelectedWeek({
      year: date.getFullYear(),
      weekNumber: getISOWeekNumber(date),
    });
  }, []);

  const refreshTodayEntries = React.useCallback(async () => {
    if (!currentUser) return;
    try {
      const entries = await timeEntryService.getToday(currentUser.id, toDateString(new Date()));
      setTodayEntries(entries);
    } catch (err) {
      console.error("Failed to load today entries:", err);
    }
  }, [currentUser, timeEntryService]);

  const refreshWeekEntries = React.useCallback(async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      const entries = await timeEntryService.getByEmployeeAndWeek(
        currentUser.id,
        selectedWeek.year,
        selectedWeek.weekNumber
      );
      setWeekEntries(entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load entries");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, selectedWeek, timeEntryService]);

  const refreshActiveEntry = React.useCallback(async () => {
    if (!currentUser) return;
    try {
      const entry = await timeEntryService.getActiveEntry(currentUser.id);
      setActiveClockEntry(entry);
    } catch (err) {
      console.error("Failed to load active entry:", err);
    }
  }, [currentUser, timeEntryService]);

  const refreshSubmission = React.useCallback(async () => {
    if (!currentUser) return;
    try {
      const sub = await submissionService.getByEmployeeAndWeek(
        currentUser.id,
        selectedWeek.year,
        selectedWeek.weekNumber
      );
      setCurrentSubmission(sub);
    } catch (err) {
      console.error("Failed to load submission:", err);
    }
  }, [currentUser, selectedWeek, submissionService]);

  // Load data when user or week changes
  React.useEffect(() => {
    if (currentUser) {
      refreshTodayEntries();
      refreshWeekEntries();
      refreshActiveEntry();
      refreshSubmission();
    }
  }, [currentUser, selectedWeek]);

  const value: ITimesheetContext = {
    selectedDate,
    selectedWeek,
    todayEntries,
    weekEntries,
    activeClockEntry,
    currentSubmission,
    isLoading,
    error,
    setSelectedDate,
    refreshTodayEntries,
    refreshWeekEntries,
    refreshActiveEntry,
    refreshSubmission,
  };

  return <TimesheetContext.Provider value={value}>{children}</TimesheetContext.Provider>;
};
