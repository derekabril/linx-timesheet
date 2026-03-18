import * as React from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { TextField } from "@fluentui/react/lib/TextField";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useAppContext } from "../../context/AppContext";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useTimeEntries } from "../../hooks/useTimeEntries";
import { useProjects } from "../../hooks/useProjects";
import { useTasks } from "../../hooks/useTasks";
import { validateTimeEntry } from "../../utils/validationUtils";
import { EntryType } from "../../models/enums";
import { ErrorMessage } from "../common/ErrorMessage";

export const ManualEntry: React.FC = React.memo(() => {
  const { currentUser, configuration } = useAppContext();
  const { refreshTodayEntries, refreshWeekEntries } = useTimesheetContext();
  const { createManualEntry, loading, error } = useTimeEntries();
  const { projects } = useProjects(
    currentUser ? { activeOnly: true, teamMemberUserId: currentUser.id } : true
  );

  const [entryDate, setEntryDate] = React.useState<Date>(new Date());
  const [startTime, setStartTime] = React.useState("09:00");
  const [endTime, setEndTime] = React.useState("17:00");
  const [breakMinutes, setBreakMinutes] = React.useState(configuration.defaultBreakMinutes);
  const [projectId, setProjectId] = React.useState<number | null>(null);
  const { tasks } = useTasks(projectId);
  const [taskId, setTaskId] = React.useState<number | null>(null);
  const [notes, setNotes] = React.useState("");
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [success, setSuccess] = React.useState(false);


  const projectOptions: IDropdownOption[] = [
    { key: "", text: "(No project)" },
    ...projects.map((p) => ({ key: p.Id, text: `${p.ProjectCode} - ${p.Title}` })),
  ];

  const taskOptions: IDropdownOption[] = [
    { key: "", text: "(No task)" },
    ...tasks.map((t) => ({ key: t.Id, text: `${t.TaskCode} - ${t.Title}` })),
  ];

  const handleSubmit = async (): Promise<void> => {
    setSuccess(false);
    const validation = validateTimeEntry({
      entryDate,
      startTime,
      endTime,
      breakMinutes,
      projectId,
      taskId,
      notes,
      entryType: EntryType.Manual,
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors([]);
    if (!currentUser) return;

    await createManualEntry(
      currentUser.id,
      entryDate,
      startTime,
      endTime,
      breakMinutes,
      projectId,
      taskId,
      notes
    );

    // Reset form
    setNotes("");
    setSuccess(true);
    await refreshTodayEntries();
    await refreshWeekEntries();
  };

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Manual Time Entry
      </Text>

      {error && <ErrorMessage message={error} />}
      {validationErrors.length > 0 && (
        <MessageBar messageBarType={MessageBarType.warning} isMultiline>
          {validationErrors.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </MessageBar>
      )}
      {success && (
        <MessageBar
          messageBarType={MessageBarType.success}
          onDismiss={() => setSuccess(false)}
        >
          Time entry saved successfully.
        </MessageBar>
      )}

      <Stack horizontal tokens={{ childrenGap: 12 }} wrap>
        <DatePicker
          label="Date"
          value={entryDate}
          onSelectDate={(date) => date && setEntryDate(date)}
          allowTextInput
          calloutProps={{ setInitialFocus: false, shouldRestoreFocus: false }}
          styles={{ root: { width: 160 } }}
        />
        <TextField
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(_, val) => setStartTime(val || "")}
          styles={{ root: { width: 120 } }}
        />
        <TextField
          label="End Time"
          type="time"
          value={endTime}
          onChange={(_, val) => setEndTime(val || "")}
          styles={{ root: { width: 120 } }}
        />
        <TextField
          label="Break (min)"
          type="number"
          min={0}
          max={480}
          step={5}
          value={String(breakMinutes)}
          onChange={(_, val) => setBreakMinutes(Number(val) || 0)}
          styles={{ root: { width: 120 } }}
        />
      </Stack>

      <Stack horizontal tokens={{ childrenGap: 12 }} wrap>
        <Dropdown
          label="Project"
          placeholder="Select project"
          options={projectOptions}
          selectedKey={projectId ?? ""}
          onChange={(_, opt) => {
            setProjectId(opt && opt.key !== "" ? (opt.key as number) : null);
            setTaskId(null);
          }}
          styles={{ root: { width: 250 } }}
        />
        {projectId && (
          <Dropdown
            label="Task"
            placeholder="Select task"
            options={taskOptions}
            selectedKey={taskId ?? ""}
            onChange={(_, opt) => setTaskId(opt && opt.key !== "" ? (opt.key as number) : null)}
            styles={{ root: { width: 250 } }}
          />
        )}
      </Stack>

      <TextField
        label="Notes"
        multiline
        rows={2}
        value={notes}
        onChange={(_, val) => setNotes(val || "")}
        styles={{ root: { maxWidth: 520 } }}
      />

      <PrimaryButton
        text="Add Entry"
        iconProps={{ iconName: "Add" }}
        onClick={handleSubmit}
        disabled={loading}
        styles={{ root: { width: 140 } }}
      />
    </Stack>
  );
});

ManualEntry.displayName = "ManualEntry";
