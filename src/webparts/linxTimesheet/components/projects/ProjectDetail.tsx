import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { IconButton } from "@fluentui/react/lib/Button";
import { ProgressIndicator } from "@fluentui/react/lib/ProgressIndicator";
import { IProject, IProjectCreate } from "../../models/IProject";
import { formatHours } from "../../utils/hoursFormatter";
import { TaskList } from "./TaskList";
import { PlannedVsActual } from "./PlannedVsActual";
import { ProjectForm } from "./ProjectForm";
import { useAppContext } from "../../context/AppContext";
import { useAppTheme } from "../../hooks/useAppTheme";

interface IProjectDetailProps {
  project: IProject;
  onBack: () => void;
  onUpdate?: (id: number, data: Partial<IProjectCreate>) => Promise<void>;
}

export const ProjectDetail: React.FC<IProjectDetailProps> = ({ project, onBack, onUpdate }) => {
  const { isAdmin, isManager } = useAppContext();
  const canEdit = isAdmin || isManager;
  const { colors } = useAppTheme();
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [currentProject, setCurrentProject] = React.useState(project);
  const progress = currentProject.PlannedHours > 0 ? currentProject.ActualHours / currentProject.PlannedHours : 0;
  const isOver = progress > 1;

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16 } }}>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <IconButton iconProps={{ iconName: "Back" }} onClick={onBack} title="Back to list" />
        <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
          {currentProject.ProjectCode} - {currentProject.Title}
        </Text>
        {canEdit && (
          <IconButton
            iconProps={{ iconName: "Edit" }}
            title="Edit Project"
            onClick={() => setShowEditForm(true)}
          />
        )}
      </Stack>

      <Stack horizontal tokens={{ childrenGap: 24 }} wrap>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Division</Text>
          <Text>{currentProject.Division || "--"}</Text>
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Area</Text>
          <Text>{currentProject.Area || "--"}</Text>
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Project Manager</Text>
          <Text>{currentProject.ProjectManagerTitle || "--"}</Text>
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Client</Text>
          <Text>{currentProject.Client || "--"}</Text>
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Planned Hours</Text>
          <Text>{formatHours(currentProject.PlannedHours)}</Text>
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Actual Hours</Text>
          <Text styles={{ root: { color: isOver ? colors.textError : undefined } }}>
            {formatHours(currentProject.ActualHours)}
          </Text>
        </Stack>
      </Stack>

      {currentProject.PlannedHours > 0 && (
        <ProgressIndicator
          label="Hours Utilization"
          description={`${formatHours(currentProject.ActualHours)} of ${formatHours(currentProject.PlannedHours)}`}
          percentComplete={Math.min(progress, 1)}
          barHeight={8}
          styles={{
            progressBar: { backgroundColor: isOver ? colors.textError : colors.textLink },
          }}
        />
      )}

      {currentProject.Description && (
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Description</Text>
          <Text>{currentProject.Description}</Text>
        </Stack>
      )}

      <PlannedVsActual project={currentProject} />

      <TaskList projectId={currentProject.Id} />

      {showEditForm && (
        <ProjectForm
          isOpen={showEditForm}
          project={currentProject}
          onSave={async (data) => {
            if (onUpdate) {
              await onUpdate(currentProject.Id, data);
              setCurrentProject({
                ...currentProject,
                ...data,
              } as IProject);
            }
            setShowEditForm(false);
          }}
          onDismiss={() => setShowEditForm(false)}
        />
      )}
    </Stack>
  );
};
