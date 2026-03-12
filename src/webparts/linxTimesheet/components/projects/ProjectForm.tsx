import * as React from "react";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { SpinButton } from "@fluentui/react/lib/SpinButton";
import { Stack } from "@fluentui/react/lib/Stack";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { IProject, IProjectCreate } from "../../models/IProject";
import { validateProject } from "../../utils/validationUtils";

interface IProjectFormProps {
  isOpen: boolean;
  project?: IProject;
  onSave: (data: Partial<IProjectCreate>) => Promise<void>;
  onDismiss: () => void;
}

export const ProjectForm: React.FC<IProjectFormProps> = ({
  isOpen,
  project,
  onSave,
  onDismiss,
}) => {
  const [title, setTitle] = React.useState(project?.Title || "");
  const [projectCode, setProjectCode] = React.useState(project?.ProjectCode || "");
  const [client, setClient] = React.useState(project?.Client || "");
  const [description, setDescription] = React.useState(project?.Description || "");
  const [plannedHours, setPlannedHours] = React.useState(project?.PlannedHours || 0);
  const [hourlyRate, setHourlyRate] = React.useState(project?.HourlyRate || 0);
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    project?.StartDate ? new Date(project.StartDate) : undefined
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    project?.EndDate ? new Date(project.EndDate) : undefined
  );
  const [errors, setErrors] = React.useState<string[]>([]);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (): Promise<void> => {
    const validation = validateProject({ title, projectCode });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors([]);
    setSaving(true);
    try {
      await onSave({
        Title: title,
        ProjectCode: projectCode,
        Client: client,
        Description: description,
        PlannedHours: plannedHours,
        HourlyRate: hourlyRate,
        StartDate: startDate?.toISOString(),
        EndDate: endDate?.toISOString(),
        IsActive: true,
        ActualHours: project?.ActualHours || 0,
        ProjectManagerId: project?.ProjectManagerId || 0,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      headerText={project ? "Edit Project" : "New Project"}
      type={PanelType.medium}
      onRenderFooterContent={() => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <PrimaryButton text="Save" onClick={handleSave} disabled={saving} />
          <DefaultButton text="Cancel" onClick={onDismiss} />
        </Stack>
      )}
      isFooterAtBottom
    >
      <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 16 } }}>
        {errors.length > 0 && (
          <MessageBar messageBarType={MessageBarType.error}>
            {errors.map((e, i) => <div key={i}>{e}</div>)}
          </MessageBar>
        )}
        <TextField label="Project Name" required value={title} onChange={(_, v) => setTitle(v || "")} />
        <TextField label="Project Code" required value={projectCode} onChange={(_, v) => setProjectCode(v || "")} />
        <TextField label="Client" value={client} onChange={(_, v) => setClient(v || "")} />
        <TextField label="Description" multiline rows={3} value={description} onChange={(_, v) => setDescription(v || "")} />
        <SpinButton
          label="Planned Hours"
          min={0}
          max={100000}
          step={1}
          value={String(plannedHours)}
          onChange={(_, v) => setPlannedHours(Number(v) || 0)}
        />
        <SpinButton
          label="Hourly Rate ($)"
          min={0}
          max={10000}
          step={5}
          value={String(hourlyRate)}
          onChange={(_, v) => setHourlyRate(Number(v) || 0)}
        />
        <DatePicker label="Start Date" value={startDate} onSelectDate={(d) => setStartDate(d || undefined)} />
        <DatePicker label="End Date" value={endDate} onSelectDate={(d) => setEndDate(d || undefined)} />
      </Stack>
    </Panel>
  );
};
