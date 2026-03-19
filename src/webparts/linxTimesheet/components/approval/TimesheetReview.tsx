import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { IconButton, DefaultButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useSubmissions } from "../../hooks/useSubmissions";
import { ITimesheetSubmission } from "../../models/ITimesheetSubmission";
import { ITimeEntry } from "../../models/ITimeEntry";
import { TimeEntryService } from "../../services/TimeEntryService";
import { getSP } from "../../services/PnPConfig";
import { formatDisplayDate, formatTime } from "../../utils/dateUtils";
import { formatHours } from "../../utils/hoursFormatter";
import { StatusBadge } from "../common/StatusBadge";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ApprovalActions } from "./ApprovalActions";
import { useAppTheme } from "../../hooks/useAppTheme";

interface ITimesheetReviewProps {
  submission: ITimesheetSubmission;
  onBack: () => void;
  readOnly?: boolean;
}

export const TimesheetReview: React.FC<ITimesheetReviewProps> = ({ submission, onBack, readOnly }) => {
  const [entries, setEntries] = React.useState<ITimeEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { colors } = useAppTheme();
  const [revokeComments, setRevokeComments] = React.useState("");
  const [revokeError, setRevokeError] = React.useState<string | null>(null);
  const { revokeApproval, loading: revokeLoading } = useSubmissions();

  React.useEffect(() => {
    const load = async (): Promise<void> => {
      const service = new TimeEntryService(getSP());
      const data = await service.getBySubmission(submission.Id);
      setEntries(data);
      setLoading(false);
    };
    load();
  }, [submission.Id]);

  const columns: IColumn[] = [
    {
      key: "date",
      name: "Date",
      minWidth: 120,
      maxWidth: 150,
      onRender: (item: ITimeEntry) => formatDisplayDate(item.EntryDate),
    },
    { key: "type", name: "Type", fieldName: "EntryType", minWidth: 60, maxWidth: 80 },
    {
      key: "start",
      name: "Start",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: ITimeEntry) => formatTime(item.ClockIn),
    },
    {
      key: "end",
      name: "End",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: ITimeEntry) => formatTime(item.ClockOut),
    },
    {
      key: "break",
      name: "Break",
      minWidth: 50,
      maxWidth: 60,
      onRender: (item: ITimeEntry) => `${item.BreakMinutes}m`,
    },
    {
      key: "hours",
      name: "Hours",
      minWidth: 60,
      maxWidth: 80,
      onRender: (item: ITimeEntry) => (
        <Text styles={{ root: { fontWeight: 600 } }}>{formatHours(item.TotalHours)}</Text>
      ),
    },
    {
      key: "project",
      name: "Project",
      minWidth: 120,
      maxWidth: 180,
      onRender: (item: ITimeEntry) => item.ProjectTitle || "--",
    },
    {
      key: "notes",
      name: "Notes",
      fieldName: "Notes",
      minWidth: 150,
      maxWidth: 250,
      onRender: (item: ITimeEntry) => item.Notes || "--",
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16 } }}>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <IconButton iconProps={{ iconName: "Back" }} onClick={onBack} title="Back" />
        <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
          Timesheet Review
        </Text>
      </Stack>

      <Stack horizontal tokens={{ childrenGap: 24 }} wrap>
        <Stack tokens={{ childrenGap: 2 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Employee</Text>
          <Text>{submission.EmployeeTitle || `User ${submission.EmployeeId}`}</Text>
        </Stack>
        <Stack tokens={{ childrenGap: 2 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Period</Text>
          <Text>{formatDisplayDate(submission.PeriodStart)} - {formatDisplayDate(submission.PeriodEnd)}</Text>
        </Stack>
        <Stack tokens={{ childrenGap: 2 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Total Hours</Text>
          <Text styles={{ root: { fontWeight: 600 } }}>{formatHours(submission.TotalHours)}</Text>
        </Stack>
        <Stack tokens={{ childrenGap: 2 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Overtime</Text>
          <Text styles={{ root: { color: submission.OvertimeHours > 0 ? colors.textWarning : undefined } }}>
            {formatHours(submission.OvertimeHours)}
          </Text>
        </Stack>
        <Stack tokens={{ childrenGap: 2 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Status</Text>
          <StatusBadge status={submission.Status} />
        </Stack>
      </Stack>

      {loading ? (
        <LoadingSpinner label="Loading entries..." />
      ) : (
        <DetailsList
          items={entries}
          columns={columns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          compact
        />
      )}

      {!readOnly && submission.Status === "Submitted" && (
        <ApprovalActions submissionId={submission.Id} submission={submission} onComplete={onBack} />
      )}

      {!readOnly && submission.Status === "Approved" && (
        <Stack tokens={{ childrenGap: 12 }} styles={{ root: { padding: "16px 0" } }}>
          {revokeError && <MessageBar messageBarType={MessageBarType.error}>{revokeError}</MessageBar>}

          <TextField
            label="Reason for revoking approval"
            placeholder="Explain why this approval is being revoked (required)"
            multiline
            rows={3}
            value={revokeComments}
            onChange={(_, v) => setRevokeComments(v || "")}
            styles={{ root: { maxWidth: 520 } }}
          />

          <DefaultButton
            text="Revoke Approval"
            iconProps={{ iconName: "Undo" }}
            disabled={revokeLoading}
            onClick={async () => {
              if (!revokeComments.trim()) {
                setRevokeError("Please provide a reason for revoking the approval.");
                return;
              }
              setRevokeError(null);
              try {
                await revokeApproval(submission.Id, revokeComments);
                onBack();
              } catch (err) {
                setRevokeError(err instanceof Error ? err.message : "Failed to revoke approval");
              }
            }}
            styles={{
              root: { borderColor: colors.textWarning, color: colors.textWarning },
              rootHovered: { borderColor: colors.borderErrorHover, color: colors.borderErrorHover },
            }}
          />
        </Stack>
      )}
    </Stack>
  );
};
