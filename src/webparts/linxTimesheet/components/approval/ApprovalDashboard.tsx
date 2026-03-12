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
import { ITimesheetSubmission } from "../../models/ITimesheetSubmission";
import { formatHours } from "../../utils/hoursFormatter";
import { formatDisplayDate } from "../../utils/dateUtils";
import { StatusBadge } from "../common/StatusBadge";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { TimesheetReview } from "./TimesheetReview";
import { LeaveService } from "../../services/LeaveService";
import { getSP } from "../../services/PnPConfig";
import { ILeaveRequest } from "../../models/ILeaveRequest";
import { useAppTheme } from "../../hooks/useAppTheme";

export const ApprovalDashboard: React.FC = () => {
  const { currentUser } = useAppContext();
  const { getPendingApprovals, getApprovedSubmissions } = useSubmissions();
  const [pendingTimesheets, setPendingTimesheets] = React.useState<ITimesheetSubmission[]>([]);
  const [approvedTimesheets, setApprovedTimesheets] = React.useState<ITimesheetSubmission[]>([]);
  const [pendingLeave, setPendingLeave] = React.useState<ILeaveRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { colors } = useAppTheme();
  const [selectedSubmission, setSelectedSubmission] = React.useState<ITimesheetSubmission | null>(null);

  const loadPending = React.useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [timesheets, approved, leave] = await Promise.all([
        getPendingApprovals(currentUser.id),
        getApprovedSubmissions(currentUser.id),
        new LeaveService(getSP()).getPendingForApprover(currentUser.id),
      ]);
      setPendingTimesheets(timesheets);
      setApprovedTimesheets(approved);
      setPendingLeave(leave);
    } finally {
      setLoading(false);
    }
  }, [currentUser, getPendingApprovals]);

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
