import * as React from "react";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";
import { SpinButton } from "@fluentui/react/lib/SpinButton";
import { Stack } from "@fluentui/react/lib/Stack";
import { ITaskCreate } from "../../models/ITask";

interface ITaskFormProps {
  isOpen: boolean;
  projectId: number;
  onSave: (data: ITaskCreate) => Promise<void>;
  onDismiss: () => void;
}

export const TaskForm: React.FC<ITaskFormProps> = ({ isOpen, projectId, onSave, onDismiss }) => {
  const [title, setTitle] = React.useState("");
  const [taskCode, setTaskCode] = React.useState("");
  const [plannedHours, setPlannedHours] = React.useState(0);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (): Promise<void> => {
    if (!title.trim() || !taskCode.trim()) return;
    setSaving(true);
    try {
      await onSave({
        Title: title,
        ProjectId: projectId,
        TaskCode: taskCode,
        PlannedHours: plannedHours,
        IsActive: true,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      headerText="New Task"
      type={PanelType.smallFixedFar}
      onRenderFooterContent={() => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <PrimaryButton text="Save" onClick={handleSave} disabled={saving || !title.trim()} />
          <DefaultButton text="Cancel" onClick={onDismiss} />
        </Stack>
      )}
      isFooterAtBottom
    >
      <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 16 } }}>
        <TextField label="Task Name" required value={title} onChange={(_, v) => setTitle(v || "")} />
        <TextField label="Task Code" required value={taskCode} onChange={(_, v) => setTaskCode(v || "")} />
        <SpinButton
          label="Planned Hours"
          min={0}
          max={10000}
          step={1}
          value={String(plannedHours)}
          onChange={(_, v) => setPlannedHours(Number(v) || 0)}
        />
      </Stack>
    </Panel>
  );
};
