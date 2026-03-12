import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { CommandBar, ICommandBarItemProps } from "@fluentui/react/lib/CommandBar";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { useProjects } from "../../hooks/useProjects";
import { useAppContext } from "../../context/AppContext";
import { IProject } from "../../models/IProject";
import { formatHours } from "../../utils/hoursFormatter";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorMessage } from "../common/ErrorMessage";
import { ProjectForm } from "./ProjectForm";
import { ProjectDetail } from "./ProjectDetail";
import { useAppTheme } from "../../hooks/useAppTheme";

export const ProjectList: React.FC = () => {
  const { isAdmin } = useAppContext();
  const { colors } = useAppTheme();
  const { projects, loading, error, refresh, create, update, archive } = useProjects(true);
  const [searchText, setSearchText] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [editProject, setEditProject] = React.useState<IProject | undefined>();
  const [selectedProject, setSelectedProject] = React.useState<IProject | null>(null);

  const filteredProjects = projects.filter(
    (p) =>
      p.Title.toLowerCase().includes(searchText.toLowerCase()) ||
      p.ProjectCode.toLowerCase().includes(searchText.toLowerCase()) ||
      p.Client.toLowerCase().includes(searchText.toLowerCase())
  );

  const commandItems: ICommandBarItemProps[] = isAdmin
    ? [
        {
          key: "add",
          text: "New Project",
          iconProps: { iconName: "Add" },
          onClick: () => {
            setEditProject(undefined);
            setShowForm(true);
          },
        },
        {
          key: "refresh",
          text: "Refresh",
          iconProps: { iconName: "Refresh" },
          onClick: () => refresh(),
        },
      ]
    : [
        {
          key: "refresh",
          text: "Refresh",
          iconProps: { iconName: "Refresh" },
          onClick: () => refresh(),
        },
      ];

  const columns: IColumn[] = [
    {
      key: "code",
      name: "Code",
      fieldName: "ProjectCode",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
    },
    {
      key: "title",
      name: "Project Name",
      fieldName: "Title",
      minWidth: 150,
      maxWidth: 250,
      isResizable: true,
      onRender: (item: IProject) => (
        <Text
          styles={{ root: { cursor: "pointer", color: colors.textLink, ":hover": { textDecoration: "underline" } } }}
          onClick={() => setSelectedProject(item)}
        >
          {item.Title}
        </Text>
      ),
    },
    {
      key: "client",
      name: "Client",
      fieldName: "Client",
      minWidth: 120,
      maxWidth: 180,
      isResizable: true,
    },
    {
      key: "planned",
      name: "Planned",
      minWidth: 70,
      maxWidth: 90,
      onRender: (item: IProject) => formatHours(item.PlannedHours),
    },
    {
      key: "actual",
      name: "Actual",
      minWidth: 70,
      maxWidth: 90,
      onRender: (item: IProject) => formatHours(item.ActualHours),
    },
    {
      key: "variance",
      name: "Variance",
      minWidth: 70,
      maxWidth: 90,
      onRender: (item: IProject) => {
        const diff = item.PlannedHours - item.ActualHours;
        const color = diff < 0 ? colors.textError : colors.textSuccess;
        return (
          <Text styles={{ root: { color } }}>
            {diff >= 0 ? "+" : ""}{formatHours(diff)}
          </Text>
        );
      },
    },
    {
      key: "rate",
      name: "Rate",
      minWidth: 60,
      maxWidth: 80,
      onRender: (item: IProject) => item.HourlyRate > 0 ? `$${item.HourlyRate}` : "--",
    },
  ];

  if (loading) return <LoadingSpinner label="Loading projects..." />;

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 16 } }}>
      {error && <ErrorMessage message={error} />}

      <CommandBar items={commandItems} />

      <SearchBox
        placeholder="Search projects..."
        value={searchText}
        onChange={(_, val) => setSearchText(val || "")}
        styles={{ root: { maxWidth: 300 } }}
      />

      <DetailsList
        items={filteredProjects}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        isHeaderVisible={true}
      />

      {showForm && (
        <ProjectForm
          isOpen={showForm}
          project={editProject}
          onSave={async (data) => {
            if (editProject) {
              await update(editProject.Id, data);
            } else {
              await create(data as never);
            }
            setShowForm(false);
          }}
          onDismiss={() => setShowForm(false)}
        />
      )}
    </Stack>
  );
};
