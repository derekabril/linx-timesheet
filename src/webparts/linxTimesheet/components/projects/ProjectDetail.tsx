import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { IconButton } from "@fluentui/react/lib/Button";
import { ProgressIndicator } from "@fluentui/react/lib/ProgressIndicator";
import { IProject } from "../../models/IProject";
import { formatHours } from "../../utils/hoursFormatter";
import { TaskList } from "./TaskList";
import { PlannedVsActual } from "./PlannedVsActual";
import { useAppTheme } from "../../hooks/useAppTheme";

interface IProjectDetailProps {
  project: IProject;
  onBack: () => void;
}

export const ProjectDetail: React.FC<IProjectDetailProps> = ({ project, onBack }) => {
  const { colors } = useAppTheme();
  const progress = project.PlannedHours > 0 ? project.ActualHours / project.PlannedHours : 0;
  const isOver = progress > 1;

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16 } }}>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <IconButton iconProps={{ iconName: "Back" }} onClick={onBack} title="Back to list" />
        <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
          {project.ProjectCode} - {project.Title}
        </Text>
      </Stack>

      <Stack horizontal tokens={{ childrenGap: 24 }} wrap>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Client</Text>
          <Text>{project.Client || "--"}</Text>
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Planned Hours</Text>
          <Text>{formatHours(project.PlannedHours)}</Text>
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Actual Hours</Text>
          <Text styles={{ root: { color: isOver ? colors.textError : undefined } }}>
            {formatHours(project.ActualHours)}
          </Text>
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Hourly Rate</Text>
          <Text>{project.HourlyRate > 0 ? `$${project.HourlyRate}` : "--"}</Text>
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Total Cost</Text>
          <Text>
            {project.HourlyRate > 0
              ? `$${(project.ActualHours * project.HourlyRate).toLocaleString()}`
              : "--"}
          </Text>
        </Stack>
      </Stack>

      {project.PlannedHours > 0 && (
        <ProgressIndicator
          label="Hours Utilization"
          description={`${formatHours(project.ActualHours)} of ${formatHours(project.PlannedHours)}`}
          percentComplete={Math.min(progress, 1)}
          barHeight={8}
          styles={{
            progressBar: { backgroundColor: isOver ? colors.textError : colors.textLink },
          }}
        />
      )}

      {project.Description && (
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Description</Text>
          <Text>{project.Description}</Text>
        </Stack>
      )}

      <PlannedVsActual project={project} />

      <TaskList projectId={project.Id} />
    </Stack>
  );
};
