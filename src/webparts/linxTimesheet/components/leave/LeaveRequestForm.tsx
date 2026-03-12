import * as React from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { TextField } from "@fluentui/react/lib/TextField";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useAppContext } from "../../context/AppContext";
import { useLeaveRequests } from "../../hooks/useLeaveRequests";
import { LeaveType, LeaveStatus } from "../../models/enums";
import { ILeaveRequestCreate } from "../../models/ILeaveRequest";
import { getBusinessDays, toDateString } from "../../utils/dateUtils";
import { validateLeaveRequest } from "../../utils/validationUtils";
import { useAppTheme } from "../../hooks/useAppTheme";

const leaveTypeOptions: IDropdownOption[] = [
  { key: LeaveType.Vacation, text: "Vacation" },
  { key: LeaveType.Sick, text: "Sick Leave" },
  { key: LeaveType.Personal, text: "Personal" },
  { key: LeaveType.Bereavement, text: "Bereavement" },
  { key: LeaveType.Other, text: "Other" },
];

export const LeaveRequestForm: React.FC = () => {
  const { currentUser } = useAppContext();
  const year = new Date().getFullYear();
  const { create, submit } = useLeaveRequests(currentUser?.id || null, year);

  const { colors } = useAppTheme();
  const [leaveType, setLeaveType] = React.useState<LeaveType>(LeaveType.Vacation);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [notes, setNotes] = React.useState("");
  const [errors, setErrors] = React.useState<string[]>([]);
  const [success, setSuccess] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const totalDays = startDate && endDate ? getBusinessDays(startDate, endDate) : 0;

  const handleSubmit = async (): Promise<void> => {
    setSuccess(false);
    const validation = validateLeaveRequest({ startDate, endDate, leaveType });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    if (!currentUser || !startDate || !endDate) return;

    setErrors([]);
    setSaving(true);
    try {
      const request: ILeaveRequestCreate = {
        Title: `${leaveType} - ${toDateString(startDate)}`,
        EmployeeId: currentUser.id,
        LeaveType: leaveType,
        StartDate: toDateString(startDate),
        EndDate: toDateString(endDate),
        TotalDays: totalDays,
        Status: LeaveStatus.Submitted,
        ApproverId: currentUser.managerId || currentUser.id,
        ApproverComments: "",
        RequestDate: new Date().toISOString(),
        Year: startDate.getFullYear(),
      };

      const result = await create(request);
      await submit(result.Id);
      setStartDate(null);
      setEndDate(null);
      setNotes("");
      setSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Request Leave
      </Text>

      {errors.length > 0 && (
        <MessageBar messageBarType={MessageBarType.error}>
          {errors.map((e, i) => <div key={i}>{e}</div>)}
        </MessageBar>
      )}
      {success && (
        <MessageBar messageBarType={MessageBarType.success} onDismiss={() => setSuccess(false)}>
          Leave request submitted successfully.
        </MessageBar>
      )}

      <Stack horizontal tokens={{ childrenGap: 12 }} wrap>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small">Leave Type</Text>
          <Dropdown
            options={leaveTypeOptions}
            selectedKey={leaveType}
            onChange={(_, opt) => opt && setLeaveType(opt.key as LeaveType)}
            styles={{ root: { width: 180 } }}
          />
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small">Start Date</Text>
          <DatePicker
            value={startDate || undefined}
            onSelectDate={(d) => setStartDate(d || null)}
            styles={{ root: { width: 160 } }}
          />
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small">End Date</Text>
          <DatePicker
            value={endDate || undefined}
            onSelectDate={(d) => setEndDate(d || null)}
            minDate={startDate || undefined}
            styles={{ root: { width: 160 } }}
          />
        </Stack>
        <Stack verticalAlign="end">
          <Text variant="small" styles={{ root: { color: colors.textSecondary, lineHeight: "32px" } }}>
            {totalDays > 0 ? `${totalDays} business day(s)` : ""}
          </Text>
        </Stack>
      </Stack>

      <TextField
        label="Notes (optional)"
        multiline
        rows={2}
        value={notes}
        onChange={(_, v) => setNotes(v || "")}
        styles={{ root: { maxWidth: 520 } }}
      />

      <PrimaryButton
        text="Submit Request"
        iconProps={{ iconName: "Send" }}
        onClick={handleSubmit}
        disabled={saving || !startDate || !endDate}
        styles={{ root: { width: 160 } }}
      />
    </Stack>
  );
};
