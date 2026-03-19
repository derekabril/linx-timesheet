import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { IconButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { Pivot, PivotItem } from "@fluentui/react/lib/Pivot";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useAppContext } from "../../context/AppContext";
import { useSubmissions } from "../../hooks/useSubmissions";
import { useProjects } from "../../hooks/useProjects";
import { ITimesheetSubmission } from "../../models/ITimesheetSubmission";
import { ITimeEntry } from "../../models/ITimeEntry";
import { SubmissionStatus } from "../../models/enums";
import { formatHours } from "../../utils/hoursFormatter";
import { formatDisplayDate } from "../../utils/dateUtils";
import { StatusBadge } from "../common/StatusBadge";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { TimesheetReview } from "./TimesheetReview";
import { SubmissionService } from "../../services/SubmissionService";
import { LeaveService } from "../../services/LeaveService";
import { TimeEntryService } from "../../services/TimeEntryService";
import { getSP } from "../../services/PnPConfig";
import { ILeaveRequest } from "../../models/ILeaveRequest";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useLeaveRequests } from "../../hooks/useLeaveRequests";

export const ApprovalDashboard: React.FC = () => {
  const { currentUser, isAdmin, isSiteOwner, isManager, isBookkeeper } = useAppContext();
  const isApprover = isManager || isAdmin || isSiteOwner || isBookkeeper;
  const canSeeAll = isAdmin || isSiteOwner;
  const { getPendingApprovals, getApprovedSubmissions, getAllPendingApprovals, getAllApprovedSubmissions } = useSubmissions();
  const { projects } = useProjects(false);
  const [pendingTimesheets, setPendingTimesheets] = React.useState<ITimesheetSubmission[]>([]);
  const [approvedTimesheets, setApprovedTimesheets] = React.useState<ITimesheetSubmission[]>([]);
  const [pendingLeave, setPendingLeave] = React.useState<ILeaveRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { colors } = useAppTheme();
  const [selectedSubmission, setSelectedSubmission] = React.useState<ITimesheetSubmission | null>(null);

  // Get project IDs where current user is the Project Manager
  const pmProjectIds = React.useMemo(() => {
    if (!currentUser) return new Set<number>();
    return new Set(
      projects
        .filter((p) => p.ProjectManagerId === currentUser.id)
        .map((p) => p.Id)
    );
  }, [projects, currentUser]);

  /**
   * Helper: given a list of submissions and a set of IDs already shown,
   * returns only those submissions whose time entries touch one of the PM's projects.
   */
  const filterByPmProjects = React.useCallback(
    async (
      submissions: ITimesheetSubmission[],
      existingIds: Set<number>,
      timeEntryService: TimeEntryService
    ): Promise<ITimesheetSubmission[]> => {
      const additional = submissions.filter((s) => !existingIds.has(s.Id));
      if (additional.length === 0) return [];

      const entries = await timeEntryService.getBySubmissionIds(
        additional.map((s) => s.Id)
      );
      const submissionProjectMap = new Map<number, Set<number>>();
      entries.forEach((e: ITimeEntry) => {
        if (e.SubmissionId && e.ProjectId) {
          if (!submissionProjectMap.has(e.SubmissionId)) {
            submissionProjectMap.set(e.SubmissionId, new Set());
          }
          submissionProjectMap.get(e.SubmissionId)!.add(e.ProjectId);
        }
      });
      return additional.filter((s) => {
        const pids = submissionProjectMap.get(s.Id);
        return pids ? Array.from(pids).some((pid) => pmProjectIds.has(pid)) : false;
      });
    },
    [pmProjectIds]
  );

  const loadPending = React.useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const sp = getSP();
      const leaveService = new LeaveService(sp);
      const timeEntryService = new TimeEntryService(sp);

      const isPM = !canSeeAll && pmProjectIds.size > 0;

      // If user is a PM, fetch all pending/approved in one call (shared with PM filter).
      // This avoids the previous pattern of fetching manager-scoped first, then
      // fetching ALL again for PM filtering — two redundant round-trips.
      const fetchPending = (canSeeAll || isPM)
        ? getAllPendingApprovals()
        : getPendingApprovals(currentUser.id);
      const fetchApproved = (canSeeAll || isPM)
        ? getAllApprovedSubmissions()
        : getApprovedSubmissions(currentUser.id);
      const fetchLeave = canSeeAll
        ? leaveService.getAllPending()
        : leaveService.getPendingForApprover(currentUser.id);

      const [allPending, allApproved, leave] = await Promise.all([
        fetchPending,
        fetchApproved,
        fetchLeave,
      ]);

      if (isPM) {
        // From the single fetch, keep submissions where:
        // 1. User is the designated approver (direct reports), OR
        // 2. Submission has entries on a project the user manages
        const directPending = allPending.filter((s) => s.ApproverId === currentUser.id);
        const directPendingIds = new Set(directPending.map((s) => s.Id));
        const pmPending = await filterByPmProjects(allPending, directPendingIds, timeEntryService);
        directPending.push(...pmPending);

        const directApproved = allApproved.filter((s) => s.ApproverId === currentUser.id);
        const directApprovedIds = new Set(directApproved.map((s) => s.Id));
        const pmApproved = await filterByPmProjects(allApproved, directApprovedIds, timeEntryService);
        directApproved.push(...pmApproved);

        setPendingTimesheets(directPending);
        setApprovedTimesheets(directApproved);
      } else {
        setPendingTimesheets(allPending);
        setApprovedTimesheets(allApproved);
      }

      setPendingLeave(leave);
    } finally {
      setLoading(false);
    }
  }, [currentUser, canSeeAll, pmProjectIds, getPendingApprovals, getApprovedSubmissions, getAllPendingApprovals, getAllApprovedSubmissions, filterByPmProjects]);

  React.useEffect(() => {
    loadPending();
  }, [loadPending]);

  if (!isApprover) {
    return <MySubmissionsView />;
  }

  if (loading) return <LoadingSpinner label="Loading approvals..." />;

  if (selectedSubmission) {
    return (
      <TimesheetReview
        submission={selectedSubmission}
        onBack={() => {
          setSelectedSubmission(null);
          loadPending();
        }}
      />
    );
  }

  const timesheetColumns: IColumn[] = [
    {
      key: "employee",
      name: "Employee",
      minWidth: 140,
      maxWidth: 200,
      onRender: (item: ITimesheetSubmission) => item.EmployeeTitle || `User ${item.EmployeeId}`,
    },
    {
      key: "period",
      name: "Period",
      minWidth: 180,
      maxWidth: 250,
      onRender: (item: ITimesheetSubmission) =>
        `${formatDisplayDate(item.PeriodStart)} - ${formatDisplayDate(item.PeriodEnd)}`,
    },
    {
      key: "hours",
      name: "Total",
      minWidth: 70,
      maxWidth: 90,
      onRender: (item: ITimesheetSubmission) => formatHours(item.TotalHours),
    },
    {
      key: "overtime",
      name: "Overtime",
      minWidth: 70,
      maxWidth: 90,
      onRender: (item: ITimesheetSubmission) => formatHours(item.OvertimeHours),
    },
    {
      key: "status",
      name: "Status",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: ITimesheetSubmission) => <StatusBadge status={item.Status} />,
    },
    {
      key: "review",
      name: "",
      minWidth: 60,
      maxWidth: 80,
      onRender: (item: ITimesheetSubmission) => (
        <Text
          styles={{ root: { color: colors.textLink, cursor: "pointer" } }}
          onClick={() => setSelectedSubmission(item)}
        >
          Review
        </Text>
      ),
    },
  ];

  const leaveColumns: IColumn[] = [
    {
      key: "employee",
      name: "Employee",
      minWidth: 140,
      maxWidth: 200,
      onRender: (item: ILeaveRequest) => item.EmployeeTitle || `User ${item.EmployeeId}`,
    },
    { key: "type", name: "Type", fieldName: "LeaveType", minWidth: 80, maxWidth: 110 },
    {
      key: "dates",
      name: "Dates",
      minWidth: 180,
      maxWidth: 250,
      onRender: (item: ILeaveRequest) =>
        `${formatDisplayDate(item.StartDate)} - ${formatDisplayDate(item.EndDate)}`,
    },
    { key: "days", name: "Days", fieldName: "TotalDays", minWidth: 50, maxWidth: 60 },
    {
      key: "status",
      name: "Status",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: ILeaveRequest) => <StatusBadge status={item.Status} />,
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16 } }}>
      <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
        Pending Approvals
      </Text>

      <Pivot>
        <PivotItem
          headerText={`Timesheets (${pendingTimesheets.length})`}
          itemIcon="Clock"
        >
          {pendingTimesheets.length === 0 ? (
            <Text styles={{ root: { padding: 16, color: colors.textSecondary, fontStyle: "italic" } }}>
              No pending timesheet approvals.
            </Text>
          ) : (
            <DetailsList
              items={pendingTimesheets}
              columns={timesheetColumns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
            />
          )}
        </PivotItem>

        <PivotItem
          headerText={`Approved (${approvedTimesheets.length})`}
          itemIcon="Completed"
        >
          {approvedTimesheets.length === 0 ? (
            <Text styles={{ root: { padding: 16, color: colors.textSecondary, fontStyle: "italic" } }}>
              No approved timesheets.
            </Text>
          ) : (
            <DetailsList
              items={approvedTimesheets}
              columns={timesheetColumns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
            />
          )}
        </PivotItem>

        <PivotItem
          headerText={`Leave Requests (${pendingLeave.length})`}
          itemIcon="Calendar"
        >
          {pendingLeave.length === 0 ? (
            <Text styles={{ root: { padding: 16, color: colors.textSecondary, fontStyle: "italic" } }}>
              No pending leave approvals.
            </Text>
          ) : (
            <DetailsList
              items={pendingLeave}
              columns={leaveColumns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
            />
          )}
        </PivotItem>
      </Pivot>
    </Stack>
  );
};

/**
 * Regular user view: shows their own timesheet submissions and leave requests
 * with status tracking and cancel ability for pending items.
 */
const MySubmissionsView: React.FC = () => {
  const { currentUser } = useAppContext();
  const { cancelSubmission, loading: cancelLoading } = useSubmissions();
  const { colors } = useAppTheme();
  const year = new Date().getFullYear();
  const { requests: leaveRequests, cancel: cancelLeave } = useLeaveRequests(currentUser?.id || null, year);

  const [submissions, setSubmissions] = React.useState<ITimesheetSubmission[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [cancelTarget, setCancelTarget] = React.useState<ITimesheetSubmission | null>(null);
  const [cancelLeaveId, setCancelLeaveId] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = React.useState<ITimesheetSubmission | null>(null);

  const sp = getSP();
  const submissionService = React.useMemo(() => new SubmissionService(sp), [sp]);
  const timeEntryService = React.useMemo(() => new TimeEntryService(sp), [sp]);

  const loadSubmissions = React.useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await submissionService.getByEmployee(currentUser.id, year);
      setSubmissions(data);
    } finally {
      setLoading(false);
    }
  }, [currentUser, submissionService, year]);

  React.useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleCancelSubmission = async (): Promise<void> => {
    if (!cancelTarget) return;
    setError(null);
    try {
      const entries = await timeEntryService.getBySubmission(cancelTarget.Id);
      const entryIds = entries.map((e) => e.Id);
      await cancelSubmission(cancelTarget.Id, entryIds);
      setSuccess(`Week ${cancelTarget.WeekNumber} submission cancelled.`);
      setCancelTarget(null);
      await loadSubmissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel submission");
    }
  };

  const handleCancelLeave = async (): Promise<void> => {
    if (cancelLeaveId === null) return;
    setError(null);
    try {
      await cancelLeave(cancelLeaveId);
      setSuccess("Leave request cancelled.");
      setCancelLeaveId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel leave request");
    }
  };

  if (loading) return <LoadingSpinner label="Loading your submissions..." />;

  if (selectedSubmission) {
    return (
      <TimesheetReview
        submission={selectedSubmission}
        onBack={() => {
          setSelectedSubmission(null);
          loadSubmissions();
        }}
        readOnly
      />
    );
  }

  const timesheetColumns: IColumn[] = [
    {
      key: "week",
      name: "Week",
      minWidth: 60,
      maxWidth: 80,
      onRender: (item: ITimesheetSubmission) => `W${item.WeekNumber}`,
    },
    {
      key: "period",
      name: "Period",
      minWidth: 180,
      maxWidth: 250,
      onRender: (item: ITimesheetSubmission) =>
        `${formatDisplayDate(item.PeriodStart)} - ${formatDisplayDate(item.PeriodEnd)}`,
    },
    {
      key: "hours",
      name: "Total",
      minWidth: 70,
      maxWidth: 90,
      onRender: (item: ITimesheetSubmission) => formatHours(item.TotalHours),
    },
    {
      key: "overtime",
      name: "OT",
      minWidth: 60,
      maxWidth: 80,
      onRender: (item: ITimesheetSubmission) => formatHours(item.OvertimeHours),
    },
    {
      key: "status",
      name: "Status",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: ITimesheetSubmission) => <StatusBadge status={item.Status} />,
    },
    {
      key: "comments",
      name: "Comments",
      minWidth: 150,
      maxWidth: 250,
      onRender: (item: ITimesheetSubmission) => item.ApproverComments || "--",
    },
    {
      key: "view",
      name: "",
      minWidth: 60,
      maxWidth: 80,
      onRender: (item: ITimesheetSubmission) => (
        <Text
          styles={{ root: { color: colors.textLink, cursor: "pointer" } }}
          onClick={() => setSelectedSubmission(item)}
        >
          View
        </Text>
      ),
    },
    {
      key: "actions",
      name: "",
      minWidth: 50,
      maxWidth: 50,
      onRender: (item: ITimesheetSubmission) =>
        item.Status === SubmissionStatus.Submitted ? (
          <IconButton
            iconProps={{ iconName: "Cancel" }}
            title="Cancel submission"
            disabled={cancelLoading}
            onClick={() => setCancelTarget(item)}
            styles={{
              root: { color: colors.borderError },
              rootHovered: { color: colors.borderErrorHover },
            }}
          />
        ) : null,
    },
  ];

  const leaveColumns: IColumn[] = [
    { key: "type", name: "Type", fieldName: "LeaveType", minWidth: 80, maxWidth: 110 },
    {
      key: "start",
      name: "Start",
      minWidth: 120,
      maxWidth: 150,
      onRender: (item: ILeaveRequest) => formatDisplayDate(item.StartDate),
    },
    {
      key: "end",
      name: "End",
      minWidth: 120,
      maxWidth: 150,
      onRender: (item: ILeaveRequest) => formatDisplayDate(item.EndDate),
    },
    { key: "days", name: "Days", fieldName: "TotalDays", minWidth: 50, maxWidth: 60 },
    {
      key: "status",
      name: "Status",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: ILeaveRequest) => <StatusBadge status={item.Status} />,
    },
    {
      key: "comments",
      name: "Comments",
      minWidth: 150,
      maxWidth: 250,
      onRender: (item: ILeaveRequest) => item.ApproverComments || "--",
    },
    {
      key: "actions",
      name: "",
      minWidth: 40,
      maxWidth: 40,
      onRender: (item: ILeaveRequest) =>
        item.Status === "Submitted" || item.Status === "Draft" ? (
          <IconButton
            iconProps={{ iconName: "Cancel" }}
            title="Cancel request"
            onClick={() => setCancelLeaveId(item.Id)}
            styles={{
              root: { color: colors.borderError },
              rootHovered: { color: colors.borderErrorHover },
            }}
          />
        ) : null,
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16 } }}>
      <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
        My Submissions
      </Text>

      {error && <MessageBar messageBarType={MessageBarType.error} onDismiss={() => setError(null)}>{error}</MessageBar>}
      {success && <MessageBar messageBarType={MessageBarType.success} onDismiss={() => setSuccess(null)}>{success}</MessageBar>}

      <Pivot>
        <PivotItem
          headerText={`Timesheets (${submissions.length})`}
          itemIcon="Clock"
        >
          {submissions.length === 0 ? (
            <Text styles={{ root: { padding: 16, color: colors.textSecondary, fontStyle: "italic" } }}>
              No timesheet submissions yet.
            </Text>
          ) : (
            <DetailsList
              items={submissions}
              columns={timesheetColumns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
              compact
            />
          )}
        </PivotItem>

        <PivotItem
          headerText={`Leave Requests (${leaveRequests.length})`}
          itemIcon="Calendar"
        >
          {leaveRequests.length === 0 ? (
            <Text styles={{ root: { padding: 16, color: colors.textSecondary, fontStyle: "italic" } }}>
              No leave requests for this year.
            </Text>
          ) : (
            <DetailsList
              items={leaveRequests}
              columns={leaveColumns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
              compact
            />
          )}
        </PivotItem>
      </Pivot>

      <ConfirmDialog
        isOpen={cancelTarget !== null}
        title="Cancel Submission"
        message={cancelTarget ? `Cancel Week ${cancelTarget.WeekNumber} submission? This will withdraw it from your approver and allow you to edit entries and resubmit.` : ""}
        confirmText="Cancel Submission"
        cancelText="Keep"
        onConfirm={handleCancelSubmission}
        onCancel={() => setCancelTarget(null)}
      />

      <ConfirmDialog
        isOpen={cancelLeaveId !== null}
        title="Cancel Leave Request"
        message="Are you sure you want to cancel this leave request?"
        confirmText="Cancel Request"
        onConfirm={handleCancelLeave}
        onCancel={() => setCancelLeaveId(null)}
      />
    </Stack>
  );
};
