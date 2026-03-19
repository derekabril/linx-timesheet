import * as React from "react";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";
import { SpinButton } from "@fluentui/react/lib/SpinButton";
import { Toggle } from "@fluentui/react/lib/Toggle";
import { Stack } from "@fluentui/react/lib/Stack";
import { ITask, ITaskCreate } from "../../models/ITask";

interface ITaskFormProps {
  isOpen: boolean;
  projectId: number;
  editTask?: ITask;
  onSave: (data: ITaskCreate) => Promise<void>;
  onDismiss: () => void;
}

export const TaskForm: React.FC<ITaskFormProps> = ({ isOpen, projectId, editTask, onSave, onDismiss }) => {
  const [title, setTitle] = React.useState(editTask?.Title || "");
  const [taskCode, setTaskCode] = React.useState(editTask?.TaskCode || "");
  const [plannedHours, setPlannedHours] = React.useState(editTask?.PlannedHours || 0);
  const [isActive, setIsActive] = React.useState(editTask?.IsActive ?? true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (editTask) {
      setTitle(editTask.Title);
      setTaskCode(editTask.TaskCode || "");
      setPlannedHours(editTask.PlannedHours);
      setIsActive(editTask.IsActive);
    } else {
      setTitle("");
      setTaskCode("");
      setPlannedHours(0);
      setIsActive(true);
    }
  }, [editTask]);

  const handleSave = async (): Promise<void> => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        Title: title,
        ProjectId: projectId,
        TaskCode: taskCode,
        PlannedHours: plannedHours,
        IsActive: isActive,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      headerText={editTask ? "Edit Task" : "New Task"}
      type={PanelType.smallFixedFar}
      onRenderFooterContent={() => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <PrimaryButton text={editTask ? "Update" : "Save"} onClick={handleSave} disabled={saving || !title.trim()} />
          <DefaultButton text="Cancel" onClick={onDismiss} />
        </Stack>
      )}
      isFooterAtBottom
    >
      <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 16 } }}>
        <TextField label="Task Name" required value={title} onChange={(_, v) => setTitle(v || "")} />
        <TextField label="Task Code" value={taskCode} onChange={(_, v) => setTaskCode(v || "")} />
        <SpinButton
          label="Planned Hours"
          min={0}
          max={10000}
          step={1}
          value={String(plannedHours)}
          onChange={(_, v) => setPlannedHours(Number(v) || 0)}
        />
        {editTask && (
          <Toggle
            label="Active"
            checked={isActive}
            onChange={(_, val) => setIsActive(val || false)}
          />
        )}
      </Stack>
    </Panel>
  );
};
