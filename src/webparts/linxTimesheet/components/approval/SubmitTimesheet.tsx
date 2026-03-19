import * as React from "react";
import { PrimaryButton, DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useAppContext } from "../../context/AppContext";
import { useSubmissions } from "../../hooks/useSubmissions";
import { TimeEntryService } from "../../services/TimeEntryService";
import { getSP } from "../../services/PnPConfig";
import { calculateOvertime } from "../../utils/overtimeCalculator";
import { formatHours } from "../../utils/hoursFormatter";
import { StatusBadge } from "../common/StatusBadge";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { EntryStatus, SubmissionStatus } from "../../models/enums";
import { useAppTheme } from "../../hooks/useAppTheme";

export const SubmitTimesheet: React.FC = () => {
  const { currentUser, configuration } = useAppContext();
  const { weekEntries, currentSubmission, selectedWeek, refreshSubmission, refreshWeekEntries } =
    useTimesheetContext();
  const { submitWeek, cancelSubmission, loading } = useSubmissions();
  const { colors } = useAppTheme();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [cancelling, setCancelling] = React.useState(false);

  const sp = getSP();
  const timeEntryService = React.useMemo(() => new TimeEntryService(sp), [sp]);

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    setError(null);
    try {
      await refreshSubmission();
      await refreshWeekEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  };

  const completedEntries = weekEntries.filter(
    (e) => e.Status === EntryStatus.Completed || e.Status === EntryStatus.Active
  );
  const overtime = calculateOvertime(completedEntries, configuration);

  // Allow submission if user has a manager OR site owners exist (they always do)
  const canSubmit =
    !currentSubmission &&
    completedEntries.length > 0;

  const handleCancel = async (): Promise<void> => {
    if (!currentSubmission) return;
    setCancelling(true);
    setError(null);
    try {
      const entries = await timeEntryService.getBySubmission(currentSubmission.Id);
      const entryIds = entries.map((e) => e.Id);
      await cancelSubmission(currentSubmission.Id, entryIds);
      setShowCancelConfirm(false);
      setSuccess(false);
      await refreshSubmission();
      await refreshWeekEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel submission");
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!currentUser) return;
    setError(null);
    try {
      // Use manager as primary approver; if no manager, set to 0 (site owners will see it)
      const approverId = currentUser.managerId || 0;
      await submitWeek(
        currentUser.id,
        approverId,
        selectedWeek.year,
        selectedWeek.weekNumber,
        completedEntries,
        configuration
      );
      setSuccess(true);
      setShowConfirm(false);
      await refreshSubmission();
      await refreshWeekEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    }
  };

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Submit Timesheet
      </Text>

      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}
      {success && (
        <MessageBar messageBarType={MessageBarType.success} onDismiss={() => setSuccess(false)}>
          Timesheet submitted for approval.
        </MessageBar>
      )}

      {currentSubmission ? (
        <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
          <Text>
            Week {selectedWeek.weekNumber} status:
          </Text>
          <StatusBadge status={currentSubmission.Status} />
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
            ({formatHours(currentSubmission.TotalHours)} total,{" "}
            {formatHours(currentSubmission.OvertimeHours)} overtime)
          </Text>
          <IconButton
            iconProps={{ iconName: "Refresh" }}
            title="Refresh submission status"
            disabled={refreshing}
            onClick={handleRefresh}
          />
          {currentSubmission.Status === SubmissionStatus.Submitted && (
            <DefaultButton
              text="Cancel Submission"
              iconProps={{ iconName: "Cancel" }}
              disabled={cancelling}
              onClick={() => setShowCancelConfirm(true)}
              styles={{
                root: { borderColor: colors.borderError, color: colors.borderError },
                rootHovered: { borderColor: colors.borderErrorHover, color: colors.borderErrorHover },
              }}
            />
          )}
        </Stack>
      ) : (
        <Stack tokens={{ childrenGap: 8 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
            {completedEntries.length} entries | {formatHours(overtime.regularHours)} regular |{" "}
            {formatHours(overtime.overtimeHours)} overtime | {formatHours(overtime.totalHours)} total
          </Text>
          <PrimaryButton
            text="Submit for Approval"
            iconProps={{ iconName: "Send" }}
            onClick={() => setShowConfirm(true)}
            disabled={!canSubmit || loading}
            styles={{ root: { width: 200 } }}
          />
          {!currentUser?.managerId && (
            <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
              No direct manager set. Site owners will review your timesheet.
            </Text>
          )}
        </Stack>
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        title="Submit Timesheet"
        message={`Submit Week ${selectedWeek.weekNumber} (${formatHours(overtime.totalHours)} total hours) for approval? You won't be able to edit entries after submission.`}
        confirmText="Submit"
        onConfirm={handleSubmit}
        onCancel={() => setShowConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showCancelConfirm}
        title="Cancel Submission"
        message={`Cancel Week ${selectedWeek.weekNumber} submission? This will withdraw it from your approver and allow you to edit entries and resubmit.`}
        confirmText="Cancel Submission"
        cancelText="Keep"
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </Stack>
  );
};
