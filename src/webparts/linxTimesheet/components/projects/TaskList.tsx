import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useTasks } from "../../hooks/useTasks";
import { ITask } from "../../models/ITask";
import { formatHours } from "../../utils/hoursFormatter";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { TaskForm } from "./TaskForm";
import { useAppTheme } from "../../hooks/useAppTheme";

interface ITaskListProps {
  projectId: number;
}

export const TaskList: React.FC<ITaskListProps> = ({ projectId }) => {
  const { colors } = useAppTheme();
  const { tasks, loading, create } = useTasks(projectId);
  const [showForm, setShowForm] = React.useState(false);

  const columns: IColumn[] = [
    { key: "code", name: "Code", fieldName: "TaskCode", minWidth: 80, maxWidth: 100 },
    { key: "title", name: "Task Name", fieldName: "Title", minWidth: 150, maxWidth: 250 },
    {
      key: "planned",
      name: "Planned Hours",
      minWidth: 90,
      maxWidth: 110,
      onRender: (item: ITask) => formatHours(item.PlannedHours),
    },
    {
      key: "status",
      name: "Active",
      minWidth: 60,
      maxWidth: 80,
      onRender: (item: ITask) => (item.IsActive ? "Yes" : "No"),
    },
  ];

  if (loading) return <LoadingSpinner label="Loading tasks..." />;

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>Tasks</Text>
        <PrimaryButton
          text="Add Task"
          iconProps={{ iconName: "Add" }}
          onClick={() => setShowForm(true)}
        />
      </Stack>

      {tasks.length === 0 ? (
        <Text styles={{ root: { color: colors.textSecondary, fontStyle: "italic" } }}>
          No tasks defined for this project.
        </Text>
      ) : (
        <DetailsList
          items={tasks}
          columns={columns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          compact
        />
      )}

      {showForm && (
        <TaskForm
          isOpen={showForm}
          projectId={projectId}
          onSave={async (data) => {
            await create(data);
            setShowForm(false);
          }}
          onDismiss={() => setShowForm(false)}
        />
      )}
    </Stack>
  );
};
