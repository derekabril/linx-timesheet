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
import { useAppContext } from "../../context/AppContext";
import { useLeaveRequests } from "../../hooks/useLeaveRequests";
import { ILeaveRequest } from "../../models/ILeaveRequest";
import { formatDisplayDate } from "../../utils/dateUtils";
import { StatusBadge } from "../common/StatusBadge";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { useAppTheme } from "../../hooks/useAppTheme";

export const LeaveRequestList: React.FC = () => {
  const { currentUser } = useAppContext();
  const year = new Date().getFullYear();
  const { requests, cancel } = useLeaveRequests(currentUser?.id || null, year);
  const { colors } = useAppTheme();
  const [cancelId, setCancelId] = React.useState<number | null>(null);

  const handleCancel = async (): Promise<void> => {
    if (cancelId === null) return;
    await cancel(cancelId);
    setCancelId(null);
  };

  const columns: IColumn[] = [
    {
      key: "type",
      name: "Type",
      fieldName: "LeaveType",
      minWidth: 80,
      maxWidth: 110,
    },
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
    {
      key: "days",
      name: "Days",
      fieldName: "TotalDays",
      minWidth: 50,
      maxWidth: 60,
    },
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
      fieldName: "ApproverComments",
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
            onClick={() => setCancelId(item.Id)}
          />
        ) : null,
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        My Leave Requests ({year})
      </Text>

      {requests.length === 0 ? (
        <Text styles={{ root: { color: colors.textSecondary, fontStyle: "italic" } }}>
          No leave requests for this year.
        </Text>
      ) : (
        <DetailsList
          items={requests}
          columns={columns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          compact
        />
      )}

      <ConfirmDialog
        isOpen={cancelId !== null}
        title="Cancel Leave Request"
        message="Are you sure you want to cancel this leave request?"
        confirmText="Cancel Request"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />
    </Stack>
  );
};
