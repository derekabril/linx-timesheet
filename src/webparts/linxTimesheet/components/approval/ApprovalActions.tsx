import * as React from "react";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { TextField } from "@fluentui/react/lib/TextField";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useSubmissions } from "../../hooks/useSubmissions";
import { ITimesheetSubmission } from "../../models/ITimesheetSubmission";
import { useAppTheme } from "../../hooks/useAppTheme";

interface IApprovalActionsProps {
  submissionId: number;
  submission?: ITimesheetSubmission;
  onComplete: () => void;
}

export const ApprovalActions: React.FC<IApprovalActionsProps> = ({ submissionId, submission, onComplete }) => {
  const { approve, reject, loading } = useSubmissions();
  const { colors } = useAppTheme();
  const [comments, setComments] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleApprove = async (): Promise<void> => {
    setError(null);
    try {
      await approve(submissionId, comments, submission);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve");
    }
  };

  const handleReject = async (): Promise<void> => {
    if (!comments.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }
    setError(null);
    try {
      await reject(submissionId, comments, submission);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject");
    }
  };

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { padding: "16px 0" } }}>
      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}

      <TextField
        label="Comments"
        placeholder="Add comments (required for rejection)"
        multiline
        rows={3}
        value={comments}
        onChange={(_, v) => setComments(v || "")}
        styles={{ root: { maxWidth: 520 } }}
      />

      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <PrimaryButton
          text="Approve"
          iconProps={{ iconName: "CheckMark" }}
          onClick={handleApprove}
          disabled={loading}
        />
        <DefaultButton
          text="Reject"
          iconProps={{ iconName: "Cancel" }}
          onClick={handleReject}
          disabled={loading}
          styles={{
            root: { borderColor: colors.borderError, color: colors.borderError },
            rootHovered: { borderColor: colors.borderErrorHover, color: colors.borderErrorHover },
          }}
        />
      </Stack>
    </Stack>
  );
};
