import * as React from "react";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { SpinButton } from "@fluentui/react/lib/SpinButton";
import { Stack } from "@fluentui/react/lib/Stack";
import { Label } from "@fluentui/react/lib/Label";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { NormalPeoplePicker } from "@fluentui/react/lib/Pickers";
import { IPersonaProps } from "@fluentui/react/lib/Persona";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { IProject, IProjectCreate } from "../../models/IProject";
import { validateProject } from "../../utils/validationUtils";
import { getSP } from "../../services/PnPConfig";
import { UserService, ISiteUser } from "../../services/UserService";
import { getDivisionOptions, getAreaOptions } from "../../utils/divisions";

interface IProjectFormProps {
  isOpen: boolean;
  project?: IProject;
  onSave: (data: Partial<IProjectCreate>) => Promise<void>;
  onDismiss: () => void;
}

const userToPersona = (user: ISiteUser): IPersonaProps => ({
  key: String(user.Id),
  text: user.Title,
  secondaryText: user.Email,
});

export const ProjectForm: React.FC<IProjectFormProps> = ({
  isOpen,
  project,
  onSave,
  onDismiss,
}) => {
  const [title, setTitle] = React.useState(project?.Title || "");
  const [projectCode, setProjectCode] = React.useState(project?.ProjectCode || "");
  const [division, setDivision] = React.useState(project?.Division || "");
  const [area, setArea] = React.useState(project?.Area || "");
  const [client, setClient] = React.useState(project?.Client || "");

  const divisionOptions: IDropdownOption[] = getDivisionOptions();
  const areaOptions: IDropdownOption[] = getAreaOptions(division);
  const [description, setDescription] = React.useState(project?.Description || "");
  const [plannedHours, setPlannedHours] = React.useState(project?.PlannedHours || 0);
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    project?.StartDate ? new Date(project.StartDate) : undefined
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    project?.EndDate ? new Date(project.EndDate) : undefined
  );
  const [projectManager, setProjectManager] = React.useState<IPersonaProps[]>([]);
  const [teamMembers, setTeamMembers] = React.useState<IPersonaProps[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [saving, setSaving] = React.useState(false);

  const userService = React.useMemo(() => new UserService(getSP()), []);

  // Load existing project manager and team members when editing
  React.useEffect(() => {
    const loadUsers = async (): Promise<void> => {
      try {
        const idsToLoad: number[] = [];
        if (project?.ProjectManagerId) idsToLoad.push(project.ProjectManagerId);
        if (project?.TeamMembersId?.length) idsToLoad.push(...project.TeamMembersId);

        if (idsToLoad.length > 0) {
          const users = await userService.getUsersByIds(idsToLoad);
          if (project?.ProjectManagerId) {
            const pm = users.find((u) => u.Id === project.ProjectManagerId);
            if (pm) setProjectManager([userToPersona(pm)]);
          }
          if (project?.TeamMembersId?.length) {
            const members = users.filter((u) => project.TeamMembersId.includes(u.Id));
            setTeamMembers(members.map(userToPersona));
          }
        }
      } catch {
        // Silently handle — fields will show as empty
      }
    };
    loadUsers();
  }, [project]);

  const onResolveSuggestions = async (
    filter: string,
    selectedItems?: IPersonaProps[]
  ): Promise<IPersonaProps[]> => {
    if (!filter || filter.length < 2) return [];
    try {
      const users = await userService.searchUsers(filter);
      const selectedIds = (selectedItems || []).map((p) => p.key);
      return users
        .filter((u) => !selectedIds.includes(String(u.Id)))
        .map(userToPersona);
    } catch {
      return [];
    }
  };

  const handleSave = async (): Promise<void> => {
    const validation = validateProject({ title, projectCode, division, area });
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
        Division: division,
        Area: area,
        Client: client,
        Description: description,
        PlannedHours: plannedHours,
        StartDate: startDate?.toISOString(),
        EndDate: endDate?.toISOString(),
        IsActive: true,
        ActualHours: project?.ActualHours || 0,
        ProjectManagerId: projectManager.length > 0 ? Number(projectManager[0].key) : 0,
        TeamMembersId: teamMembers.map((p) => Number(p.key)),
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
        <Dropdown
          label="Division"
          required
          options={divisionOptions}
          selectedKey={division || undefined}
          onChange={(_, opt) => {
            const val = (opt?.key as string) || "";
            setDivision(val);
            setArea("");
          }}
          placeholder="Select a division"
        />
        <Dropdown
          label="Area"
          required
          options={areaOptions}
          selectedKey={area || undefined}
          onChange={(_, opt) => setArea((opt?.key as string) || "")}
          placeholder={division ? "Select an area" : "Select a division first"}
          disabled={!division}
        />
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
        <DatePicker label="Start Date" value={startDate} onSelectDate={(d) => setStartDate(d || undefined)} />
        <DatePicker label="End Date" value={endDate} onSelectDate={(d) => setEndDate(d || undefined)} />
        <Stack tokens={{ childrenGap: 4 }}>
          <Label>Project Manager</Label>
          <NormalPeoplePicker
            onResolveSuggestions={onResolveSuggestions}
            selectedItems={projectManager}
            onChange={(items) => setProjectManager((items || []).slice(0, 1))}
            itemLimit={1}
            pickerSuggestionsProps={{
              suggestionsHeaderText: "Suggested people",
              noResultsFoundText: "No results found",
              loadingText: "Searching...",
            }}
            resolveDelay={300}
          />
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Label>Team Members</Label>
          <NormalPeoplePicker
            onResolveSuggestions={onResolveSuggestions}
            selectedItems={teamMembers}
            onChange={(items) => setTeamMembers(items || [])}
            pickerSuggestionsProps={{
              suggestionsHeaderText: "Suggested people",
              noResultsFoundText: "No results found",
              loadingText: "Searching...",
            }}
            resolveDelay={300}
          />
        </Stack>
      </Stack>
    </Panel>
  );
};
