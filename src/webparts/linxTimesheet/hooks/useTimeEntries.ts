import { useState, useCallback, useMemo } from "react";
import { getSP } from "../services/PnPConfig";
import { TimeEntryService } from "../services/TimeEntryService";
import { AuditService } from "../services/AuditService";
import { ITimeEntry, ITimeEntryCreate } from "../models/ITimeEntry";
import { EntryType, EntryStatus, AuditAction } from "../models/enums";
import { LIST_NAMES } from "../utils/constants";
import { getISOWeekNumber, toDateString, calculateHours, toLocalISOString, combineDateAndTime, toChicagoDate, toChicagoISOString } from "../utils/dateUtils";

export const useTimeEntries = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sp = getSP();
  const service = useMemo(() => new TimeEntryService(sp), [sp]);
  const auditService = useMemo(() => new AuditService(sp), [sp]);

  const clockIn = useCallback(
    async (employeeId: number, projectId?: number, taskId?: number): Promise<ITimeEntry> => {
      setLoading(true);
      setError(null);
      try {
        const chicagoNow = toChicagoDate(new Date());
        const entry: ITimeEntryCreate = {
          Title: `Clock-${toDateString(chicagoNow)}`,
          EmployeeId: employeeId,
          EntryDate: toDateString(chicagoNow),
          ClockIn: toLocalISOString(chicagoNow),
          BreakMinutes: 0,
          TotalHours: 0,
          EntryType: EntryType.Clock,
          ProjectId: projectId,
          TaskId: taskId,
          Notes: "",
          Status: EntryStatus.Active,
          IsOvertime: false,
          OvertimeHours: 0,
          WeekNumber: getISOWeekNumber(chicagoNow),
          Year: chicagoNow.getFullYear(),
        };
        const result = await service.create(entry);
        await auditService.logCreate(LIST_NAMES.TIME_ENTRIES, result.Id, entry as unknown as Record<string, unknown>);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to clock in");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, auditService]
  );

  const clockOut = useCallback(
    async (entryId: number, breakMinutes: number = 0): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const now = new Date();
        const chicagoNowStr = toChicagoISOString(now);
        // Get current entry to calculate hours
        const chicagoNow = toChicagoDate(now);
        const entries = await service.getToday(0, toDateString(chicagoNow)); // We'll get by ID
        const current = entries.find((e) => e.Id === entryId);
        const clockIn = current?.ClockIn || chicagoNowStr;
        const totalHours = calculateHours(clockIn, chicagoNowStr, breakMinutes);

        const updates = {
          ClockOut: chicagoNowStr,
          BreakMinutes: breakMinutes,
          TotalHours: totalHours,
          Status: EntryStatus.Completed,
        };

        await service.update(entryId, updates);
        await auditService.logStatusChange(
          AuditAction.ClockOut,
          LIST_NAMES.TIME_ENTRIES,
          entryId,
          EntryStatus.Active,
          EntryStatus.Completed
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to clock out");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, auditService]
  );

  const createManualEntry = useCallback(
    async (
      employeeId: number,
      date: Date,
      startTime: string,
      endTime: string,
      breakMinutes: number,
      projectId: number | null,
      taskId: number | null,
      notes: string
    ): Promise<ITimeEntry> => {
      setLoading(true);
      setError(null);
      try {
        const dateStr = toDateString(date);
        const clockIn = combineDateAndTime(dateStr, startTime);
        const clockOut = combineDateAndTime(dateStr, endTime);
        const totalHours = calculateHours(clockIn, clockOut, breakMinutes);

        const entry: ITimeEntryCreate = {
          Title: `Manual-${dateStr}`,
          EmployeeId: employeeId,
          EntryDate: dateStr,
          ClockIn: clockIn,
          ClockOut: clockOut,
          BreakMinutes: breakMinutes,
          TotalHours: totalHours,
          EntryType: EntryType.Manual,
          ProjectId: projectId || undefined,
          TaskId: taskId || undefined,
          Notes: notes,
          Status: EntryStatus.Completed,
          IsOvertime: false,
          OvertimeHours: 0,
          WeekNumber: getISOWeekNumber(date),
          Year: date.getFullYear(),
        };

        const result = await service.create(entry);
        await auditService.logCreate(LIST_NAMES.TIME_ENTRIES, result.Id, entry as unknown as Record<string, unknown>);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create entry");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, auditService]
  );

  const createTimerEntry = useCallback(
    async (
      employeeId: number,
      startTime: Date,
      totalSeconds: number,
      projectId: number | null,
      taskId: number | null,
      notes: string
    ): Promise<ITimeEntry> => {
      setLoading(true);
      setError(null);
      try {
        const now = new Date();
        const totalHours = Math.round((totalSeconds / 3600) * 100) / 100;
        const chicagoStart = toChicagoDate(startTime);

        const entry: ITimeEntryCreate = {
          Title: `Timer-${toDateString(chicagoStart)}`,
          EmployeeId: employeeId,
          EntryDate: toDateString(chicagoStart),
          ClockIn: toLocalISOString(chicagoStart),
          ClockOut: toChicagoISOString(now),
          BreakMinutes: 0,
          TotalHours: totalHours,
          EntryType: EntryType.Timer,
          ProjectId: projectId || undefined,
          TaskId: taskId || undefined,
          Notes: notes,
          Status: EntryStatus.Completed,
          IsOvertime: false,
          OvertimeHours: 0,
          WeekNumber: getISOWeekNumber(chicagoStart),
          Year: chicagoStart.getFullYear(),
        };

        const result = await service.create(entry);
        await auditService.logCreate(LIST_NAMES.TIME_ENTRIES, result.Id, entry as unknown as Record<string, unknown>);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save timer entry");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, auditService]
  );

  const voidEntry = useCallback(
    async (entryId: number): Promise<void> => {
      setLoading(true);
      try {
        await service.void(entryId);
        await auditService.logStatusChange(
          AuditAction.Delete,
          LIST_NAMES.TIME_ENTRIES,
          entryId,
          "Completed",
          "Voided"
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to void entry");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, auditService]
  );

  return {
    loading,
    error,
    clockIn,
    clockOut,
    createManualEntry,
    createTimerEntry,
    voidEntry,
  };
};
