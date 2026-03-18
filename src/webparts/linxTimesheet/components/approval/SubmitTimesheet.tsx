import * as React from "react";
import { PrimaryButton, IconButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useAppContext } from "../../context/AppContext";
import { useSubmissions } from "../../hooks/useSubmissions";
import { calculateOvertime } from "../../utils/overtimeCalculator";
import { formatHours } from "../../utils/hoursFormatter";
import { StatusBadge } from "../common/StatusBadge";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { EntryStatus } from "../../models/enums";
import { useAppTheme } from "../../hooks/useAppTheme";

export const SubmitTimesheet: React.FC = () => {
  const { currentUser, configuration } = useAppContext();
  const { weekEntries, currentSubmission, selectedWeek, refreshSubmission, refreshWeekEntries } =
    useTimesheetContext();
  const { submitWeek, loading } = useSubmissions();
  const { colors } = useAppTheme();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

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
    </Stack>
  );
};
