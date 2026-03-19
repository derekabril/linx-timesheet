import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { PrimaryButton, IconButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useTasks } from "../../hooks/useTasks";
import { ITask } from "../../models/ITask";
import { formatHours } from "../../utils/hoursFormatter";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { TaskForm } from "./TaskForm";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { useAppTheme } from "../../hooks/useAppTheme";

interface ITaskListProps {
  projectId: number;
}

export const TaskList: React.FC<ITaskListProps> = ({ projectId }) => {
  const { colors } = useAppTheme();
  const { tasks, loading, create, update, archive } = useTasks(projectId);
  const [showForm, setShowForm] = React.useState(false);
  const [editTask, setEditTask] = React.useState<ITask | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ITask | null>(null);

  const handleEdit = (task: ITask): void => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleDismissForm = (): void => {
    setShowForm(false);
    setEditTask(null);
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return;
    await archive(deleteTarget.Id);
    setDeleteTarget(null);
  };

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
    {
      key: "actions",
      name: "",
      minWidth: 70,
      maxWidth: 70,
      onRender: (item: ITask) => (
        <Stack horizontal tokens={{ childrenGap: 4 }}>
          <IconButton
            iconProps={{ iconName: "Edit" }}
            title="Edit task"
            onClick={() => handleEdit(item)}
          />
          <IconButton
            iconProps={{ iconName: "Delete" }}
            title="Delete task"
            onClick={() => setDeleteTarget(item)}
            styles={{
              root: { color: colors.borderError },
              rootHovered: { color: colors.borderErrorHover },
            }}
          />
        </Stack>
      ),
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
          onClick={() => { setEditTask(null); setShowForm(true); }}
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
          editTask={editTask || undefined}
          onSave={async (data) => {
            if (editTask) {
              await update(editTask.Id, data);
            } else {
              await create(data);
            }
            handleDismissForm();
          }}
          onDismiss={handleDismissForm}
        />
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Task"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.Title}"?` : ""}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Stack>
  );
};
