import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { Pivot, PivotItem } from "@fluentui/react/lib/Pivot";
import { useAppContext } from "../../context/AppContext";
import { useSubmissions } from "../../hooks/useSubmissions";
import { useProjects } from "../../hooks/useProjects";
import { ITimesheetSubmission } from "../../models/ITimesheetSubmission";
import { ITimeEntry } from "../../models/ITimeEntry";
import { formatHours } from "../../utils/hoursFormatter";
import { formatDisplayDate } from "../../utils/dateUtils";
import { StatusBadge } from "../common/StatusBadge";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { TimesheetReview } from "./TimesheetReview";
import { LeaveService } from "../../services/LeaveService";
import { TimeEntryService } from "../../services/TimeEntryService";
import { getSP } from "../../services/PnPConfig";
import { ILeaveRequest } from "../../models/ILeaveRequest";
import { useAppTheme } from "../../hooks/useAppTheme";

export const ApprovalDashboard: React.FC = () => {
  const { currentUser, isAdmin, isSiteOwner } = useAppContext();
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

  const loadPending = React.useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const sp = getSP();
      const leaveService = new LeaveService(sp);
      const timeEntryService = new TimeEntryService(sp);

      // Site owners see all submissions; others see only their direct reports'
      const fetchPending = canSeeAll
        ? getAllPendingApprovals()
        : getPendingApprovals(currentUser.id);
      const fetchApproved = canSeeAll
        ? getAllApprovedSubmissions()
        : getApprovedSubmissions(currentUser.id);

      // Site owners/admins see all leave requests; others see only their direct reports'
      const fetchLeave = canSeeAll
        ? leaveService.getAllPending()
        : leaveService.getPendingForApprover(currentUser.id);

      const [allPending, allApproved, leave] = await Promise.all([
        fetchPending,
        fetchApproved,
        fetchLeave,
      ]);

      // If not site owner but user is PM on some projects, fetch all pending
      // and check if any entries belong to PM's projects
      if (!canSeeAll && pmProjectIds.size > 0) {
        const allSubmitted = await getAllPendingApprovals();
        // Filter out ones we already have (from direct manager query)
        const existingIds = new Set(allPending.map((s) => s.Id));
        const additionalSubmissions = allSubmitted.filter((s) => !existingIds.has(s.Id));

        if (additionalSubmissions.length > 0) {
          // Load entries for these submissions to check project membership
          const entries = await timeEntryService.getBySubmissionIds(
            additionalSubmissions.map((s) => s.Id)
          );
          // Build a map of submissionId -> projectIds
          const submissionProjectMap = new Map<number, Set<number>>();
          entries.forEach((e: ITimeEntry) => {
            if (e.SubmissionId && e.ProjectId) {
              if (!submissionProjectMap.has(e.SubmissionId)) {
                submissionProjectMap.set(e.SubmissionId, new Set());
              }
              submissionProjectMap.get(e.SubmissionId)!.add(e.ProjectId);
            }
          });
          // Include submissions that have entries on PM's projects
          const pmSubmissions = additionalSubmissions.filter((s) => {
            const projectIds = submissionProjectMap.get(s.Id);
            if (!projectIds) return false;
            return Array.from(projectIds).some((pid) => pmProjectIds.has(pid));
          });
          allPending.push(...pmSubmissions);
        }

        // Same for approved
        const allApprovedSubmitted = await getAllApprovedSubmissions();
        const existingApprovedIds = new Set(allApproved.map((s) => s.Id));
        const additionalApproved = allApprovedSubmitted.filter((s) => !existingApprovedIds.has(s.Id));

        if (additionalApproved.length > 0) {
          const approvedEntries = await timeEntryService.getBySubmissionIds(
            additionalApproved.map((s) => s.Id)
          );
          const approvedSubProjectMap = new Map<number, Set<number>>();
          approvedEntries.forEach((e: ITimeEntry) => {
            if (e.SubmissionId && e.ProjectId) {
              if (!approvedSubProjectMap.has(e.SubmissionId)) {
                approvedSubProjectMap.set(e.SubmissionId, new Set());
              }
              approvedSubProjectMap.get(e.SubmissionId)!.add(e.ProjectId);
            }
          });
          const pmApproved = additionalApproved.filter((s) => {
            const projectIds = approvedSubProjectMap.get(s.Id);
            if (!projectIds) return false;
            return Array.from(projectIds).some((pid) => pmProjectIds.has(pid));
          });
          allApproved.push(...pmApproved);
        }
      }

      setPendingTimesheets(allPending);
      setApprovedTimesheets(allApproved);
      setPendingLeave(leave);
    } finally {
      setLoading(false);
    }
  }, [currentUser, canSeeAll, pmProjectIds, getPendingApprovals, getApprovedSubmissions, getAllPendingApprovals, getAllApprovedSubmissions]);

  React.useEffect(() => {
    loadPending();
  }, [loadPending]);

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
