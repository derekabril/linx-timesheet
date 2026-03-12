import * as React from "react";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { SpinButton } from "@fluentui/react/lib/SpinButton";
import { Stack } from "@fluentui/react/lib/Stack";
import { ITimeEntry } from "../../models/ITimeEntry";

interface ITimeEntryFormProps {
  isOpen: boolean;
  entry?: ITimeEntry;
  onSave: (data: ITimeEntryFormState) => Promise<void>;
  onDismiss: () => void;
  projectOptions: IDropdownOption[];
  taskOptions: IDropdownOption[];
}

export interface ITimeEntryFormState {
  entryDate: Date;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  projectId: number | null;
  taskId: number | null;
  notes: string;
}

export const TimeEntryForm: React.FC<ITimeEntryFormProps> = ({
  isOpen,
  entry,
  onSave,
  onDismiss,
  projectOptions,
  taskOptions,
}) => {
  const [state, setState] = React.useState<ITimeEntryFormState>({
    entryDate: entry ? new Date(entry.EntryDate) : new Date(),
    startTime: entry?.ClockIn ? new Date(entry.ClockIn).toTimeString().slice(0, 5) : "09:00",
    endTime: entry?.ClockOut ? new Date(entry.ClockOut).toTimeString().slice(0, 5) : "17:00",
    breakMinutes: entry?.BreakMinutes || 0,
    projectId: entry?.ProjectId || null,
    taskId: entry?.TaskId || null,
    notes: entry?.Notes || "",
  });
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    try {
      await onSave(state);
      onDismiss();
    } finally {
      setSaving(false);
    }
  };

  const onRenderFooterContent = (): JSX.Element => (
    <Stack horizontal tokens={{ childrenGap: 8 }}>
      <PrimaryButton text="Save" onClick={handleSave} disabled={saving} />
      <DefaultButton text="Cancel" onClick={onDismiss} />
    </Stack>
  );

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      headerText={entry ? "Edit Time Entry" : "New Time Entry"}
      type={PanelType.medium}
      onRenderFooterContent={onRenderFooterContent}
      isFooterAtBottom
    >
      <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 16 } }}>
        <DatePicker
          label="Date"
          value={state.entryDate}
          onSelectDate={(date) => date && setState({ ...state, entryDate: date })}
        />
        <TextField
          label="Start Time"
          type="time"
          value={state.startTime}
          onChange={(_, v) => setState({ ...state, startTime: v || "" })}
        />
        <TextField
          label="End Time"
          type="time"
          value={state.endTime}
          onChange={(_, v) => setState({ ...state, endTime: v || "" })}
        />
        <SpinButton
          label="Break (minutes)"
          min={0}
          max={480}
          step={5}
          value={String(state.breakMinutes)}
          onChange={(_, v) => setState({ ...state, breakMinutes: Number(v) || 0 })}
        />
        <Dropdown
          label="Project"
          options={projectOptions}
          selectedKey={state.projectId ?? ""}
          onChange={(_, opt) =>
            setState({ ...state, projectId: opt && opt.key !== "" ? (opt.key as number) : null, taskId: null })
          }
        />
        {state.projectId && (
          <Dropdown
            label="Task"
            options={taskOptions}
            selectedKey={state.taskId ?? ""}
            onChange={(_, opt) =>
              setState({ ...state, taskId: opt && opt.key !== "" ? (opt.key as number) : null })
            }
          />
        )}
        <TextField
          label="Notes"
          multiline
          rows={3}
          value={state.notes}
          onChange={(_, v) => setState({ ...state, notes: v || "" })}
        />
      </Stack>
    </Panel>
  );
};
