import { useState, useCallback, useMemo } from "react";
import { getSP } from "../services/PnPConfig";
import { SubmissionService } from "../services/SubmissionService";
import { TimeEntryService } from "../services/TimeEntryService";
import { AuditService } from "../services/AuditService";
import { NotificationService } from "../services/NotificationService";
import { UserService } from "../services/UserService";
import { ITimesheetSubmission, ITimesheetSubmissionCreate } from "../models/ITimesheetSubmission";
import { ITimeEntry } from "../models/ITimeEntry";
import { SubmissionStatus, AuditAction } from "../models/enums";
import { LIST_NAMES } from "../utils/constants";
import { calculateOvertime } from "../utils/overtimeCalculator";
import { getWeekStart, getWeekEnd, toDateString } from "../utils/dateUtils";
import { IAppConfiguration } from "../models/IConfiguration";

export const useSubmissions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sp = getSP();
  const submissionService = useMemo(() => new SubmissionService(sp), [sp]);
  const timeEntryService = useMemo(() => new TimeEntryService(sp), [sp]);
  const auditService = useMemo(() => new AuditService(sp), [sp]);
  const notificationService = useMemo(() => new NotificationService(), []);
  const userService = useMemo(() => new UserService(sp), [sp]);

  /**
   * Create and submit a weekly timesheet.
   */
  const submitWeek = useCallback(
    async (
      employeeId: number,
      approverId: number,
      year: number,
      weekNumber: number,
      entries: ITimeEntry[],
      config: IAppConfiguration
    ): Promise<ITimesheetSubmission> => {
      setLoading(true);
      setError(null);
      try {
        const overtime = calculateOvertime(entries, config);
        const weekStart = getWeekStart(new Date(entries[0]?.EntryDate || new Date()));
        const weekEnd = getWeekEnd(weekStart);

        const submission: ITimesheetSubmissionCreate = {
          Title: `Week ${weekNumber}, ${year}`,
          EmployeeId: employeeId,
          PeriodStart: toDateString(weekStart),
          PeriodEnd: toDateString(weekEnd),
          TotalHours: overtime.totalHours,
          OvertimeHours: overtime.overtimeHours,
          RegularHours: overtime.regularHours,
          Status: SubmissionStatus.Submitted,
          ApproverId: approverId,
          WeekNumber: weekNumber,
          Year: year,
        };

        const result = await submissionService.create(submission);

        // Link all entries to this submission
        const entryIds = entries.map((e) => e.Id);
        await timeEntryService.linkToSubmission(entryIds, result.Id);

        await auditService.logCreate(
          LIST_NAMES.SUBMISSIONS,
          result.Id,
          submission as unknown as Record<string, unknown>
        );

        // Send notification email (non-blocking)
        if (config.notificationEmail) {
          const currentUser = await userService.getCurrentUser();
          const entryDetails = entries.map((e) => ({
            date: e.EntryDate,
            clockIn: e.ClockIn,
            clockOut: e.ClockOut,
            totalHours: e.TotalHours,
          }));
          notificationService.notifySubmission(
            config.notificationEmail,
            currentUser.displayName,
            weekNumber,
            year,
            overtime.totalHours,
            entryDetails
          ).catch((e) => console.warn("Submission notification failed:", e));
        } else {
          console.log("Skipping submission notification: no notificationEmail configured");
        }

        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit timesheet");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [submissionService, timeEntryService, auditService, notificationService, userService]
  );

  const approve = useCallback(
    async (submissionId: number, comments: string, submission?: ITimesheetSubmission): Promise<void> => {
      setLoading(true);
      try {
        await submissionService.approve(submissionId, comments);
        await auditService.logStatusChange(
          AuditAction.Approve,
          LIST_NAMES.SUBMISSIONS,
          submissionId,
          SubmissionStatus.Submitted,
          SubmissionStatus.Approved
        );

        // Notify the employee (non-blocking)
        if (submission?.EmployeeId) {
          const users = await userService.getUsersByIds([submission.EmployeeId]);
          if (users.length > 0 && users[0].Email) {
            notificationService.notifyApproval(
              users[0].Email,
              users[0].Title,
              submission.WeekNumber,
              submission.Year,
              comments
            ).catch((e) => console.warn("Approval notification failed:", e));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to approve");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [submissionService, auditService, notificationService, userService]
  );

  const reject = useCallback(
    async (submissionId: number, comments: string, submission?: ITimesheetSubmission): Promise<void> => {
      setLoading(true);
      try {
        await submissionService.reject(submissionId, comments);
        await auditService.logStatusChange(
          AuditAction.Reject,
          LIST_NAMES.SUBMISSIONS,
          submissionId,
          SubmissionStatus.Submitted,
          SubmissionStatus.Rejected
        );

        // Notify the employee (non-blocking)
        if (submission?.EmployeeId) {
          const users = await userService.getUsersByIds([submission.EmployeeId]);
          if (users.length > 0 && users[0].Email) {
            notificationService.notifyRejection(
              users[0].Email,
              users[0].Title,
              submission.WeekNumber,
              submission.Year,
              comments
            ).catch((e) => console.warn("Rejection notification failed:", e));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to reject");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [submissionService, auditService, notificationService, userService]
  );

  const revokeApproval = useCallback(
    async (submissionId: number, comments: string): Promise<void> => {
      setLoading(true);
      try {
        await submissionService.revokeApproval(submissionId, comments);
        await auditService.logStatusChange(
          AuditAction.Update,
          LIST_NAMES.SUBMISSIONS,
          submissionId,
          SubmissionStatus.Approved,
          SubmissionStatus.Submitted
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to revoke approval");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [submissionService, auditService]
  );

  const getApprovedSubmissions = useCallback(
    async (approverId: number): Promise<ITimesheetSubmission[]> => {
      return submissionService.getApprovedForApprover(approverId);
    },
    [submissionService]
  );

  const cancelSubmission = useCallback(
    async (submissionId: number, entryIds: number[]): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await submissionService.cancel(submissionId);
        await timeEntryService.unlinkFromSubmission(entryIds);
        await auditService.logStatusChange(
          AuditAction.Delete,
          LIST_NAMES.SUBMISSIONS,
          submissionId,
          SubmissionStatus.Submitted,
          SubmissionStatus.Cancelled
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to cancel submission");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [submissionService, timeEntryService, auditService]
  );

  const getPendingApprovals = useCallback(
    async (approverId: number): Promise<ITimesheetSubmission[]> => {
      return submissionService.getPendingForApprover(approverId);
    },
    [submissionService]
  );

  const getAllPendingApprovals = useCallback(
    async (): Promise<ITimesheetSubmission[]> => {
      return submissionService.getAllPending();
    },
    [submissionService]
  );

  const getAllApprovedSubmissions = useCallback(
    async (): Promise<ITimesheetSubmission[]> => {
      return submissionService.getAllApproved();
    },
    [submissionService]
  );

  return { loading, error, submitWeek, approve, reject, revokeApproval, cancelSubmission, getPendingApprovals, getApprovedSubmissions, getAllPendingApprovals, getAllApprovedSubmissions };
};
