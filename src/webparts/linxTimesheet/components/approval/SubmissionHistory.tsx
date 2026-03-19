import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { IconButton } from "@fluentui/react/lib/Button";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useAppContext } from "../../context/AppContext";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useSubmissions } from "../../hooks/useSubmissions";
import { SubmissionService } from "../../services/SubmissionService";
import { TimeEntryService } from "../../services/TimeEntryService";
import { getSP } from "../../services/PnPConfig";
import { ITimesheetSubmission } from "../../models/ITimesheetSubmission";
import { SubmissionStatus } from "../../models/enums";
import { formatDisplayDate } from "../../utils/dateUtils";
import { formatHours } from "../../utils/hoursFormatter";
import { StatusBadge } from "../common/StatusBadge";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { useAppTheme } from "../../hooks/useAppTheme";

export const SubmissionHistory: React.FC = () => {
  const { currentUser } = useAppContext();
  const { currentSubmission, refreshSubmission, refreshWeekEntries } = useTimesheetContext();
  const { cancelSubmission, loading: cancelLoading } = useSubmissions();
  const { colors } = useAppTheme();
  const [submissions, setSubmissions] = React.useState<ITimesheetSubmission[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [cancelTarget, setCancelTarget] = React.useState<ITimesheetSubmission | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const sp = getSP();
  const submissionService = React.useMemo(() => new SubmissionService(sp), [sp]);
  const timeEntryService = React.useMemo(() => new TimeEntryService(sp), [sp]);

  const loadSubmissions = React.useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await submissionService.getByEmployee(currentUser.id, new Date().getFullYear());
      setSubmissions(data);
    } finally {
      setLoading(false);
    }
  }, [currentUser, submissionService]);

  React.useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions, currentSubmission]);

  const handleCancel = async (): Promise<void> => {
    if (!cancelTarget) return;
    setError(null);
    try {
      const entries = await timeEntryService.getBySubmission(cancelTarget.Id);
      const entryIds = entries.map((e) => e.Id);
      await cancelSubmission(cancelTarget.Id, entryIds);
      setSuccess(`Week ${cancelTarget.WeekNumber} submission cancelled. You can now edit and resubmit.`);
      setCancelTarget(null);
      await loadSubmissions();
      await refreshSubmission();
      await refreshWeekEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel submission");
    }
  };

  const columns: IColumn[] = [
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
      key: "actions",
      name: "",
      minWidth: 50,
      maxWidth: 50,
      onRender: (item: ITimesheetSubmission) =>
        item.Status === SubmissionStatus.Submitted ? (
          <IconButton
            iconProps={{ iconName: "Cancel" }}
            title="Cancel submission"
            ariaLabel="Cancel submission"
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

  if (loading) return <LoadingSpinner label="Loading history..." />;

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Submission History
      </Text>

      {error && <MessageBar messageBarType={MessageBarType.error} onDismiss={() => setError(null)}>{error}</MessageBar>}
      {success && <MessageBar messageBarType={MessageBarType.success} onDismiss={() => setSuccess(null)}>{success}</MessageBar>}

      {submissions.length === 0 ? (
        <Text styles={{ root: { color: colors.textSecondary, fontStyle: "italic" } }}>
          No submissions yet.
        </Text>
      ) : (
        <>
          <DetailsList
            items={submissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
            columns={columns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            compact
          />
          {submissions.length > itemsPerPage && (
            <Stack horizontal verticalAlign="center" horizontalAlign="end" tokens={{ childrenGap: 4 }}>
              <IconButton
                iconProps={{ iconName: "ChevronLeft" }}
                title="Previous page"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              />
              <Text variant="small">
                Page {currentPage} of {Math.ceil(submissions.length / itemsPerPage)}
              </Text>
              <IconButton
                iconProps={{ iconName: "ChevronRight" }}
                title="Next page"
                disabled={currentPage >= Math.ceil(submissions.length / itemsPerPage)}
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            </Stack>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={cancelTarget !== null}
        title="Cancel Submission"
        message={cancelTarget ? `Cancel Week ${cancelTarget.WeekNumber} submission? This will withdraw it from your approver and allow you to edit entries and resubmit.` : ""}
        confirmText="Cancel Submission"
        cancelText="Keep"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </Stack>
  );
};
