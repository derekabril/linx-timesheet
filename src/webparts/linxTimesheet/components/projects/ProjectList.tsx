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
import { IconButton } from "@fluentui/react/lib/Button";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { useProjects } from "../../hooks/useProjects";
import { useAppContext } from "../../context/AppContext";
import { IProject } from "../../models/IProject";
import { formatHours } from "../../utils/hoursFormatter";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorMessage } from "../common/ErrorMessage";
import { ProjectForm } from "./ProjectForm";
import { ProjectDetail } from "./ProjectDetail";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { useAppTheme } from "../../hooks/useAppTheme";
import { getDivisionOptions, getAreaOptions } from "../../utils/divisions";

interface IProjectListProps {
  pageSize?: number;
}

export const ProjectList: React.FC<IProjectListProps> = ({ pageSize = 10 }) => {
  const { isAdmin, isManager, currentUser } = useAppContext();
  const { colors } = useAppTheme();
  const canCreateProjects = isAdmin || isManager;
  const isRegularUser = !isAdmin && !isManager;

  // Regular users only see assigned projects; managers/admins see all
  const { projects, loading, error, refresh, create, update, archive } = useProjects(
    isRegularUser && currentUser
      ? { activeOnly: true, teamMemberUserId: currentUser.id }
      : true
  );

  const [searchText, setSearchText] = React.useState("");
  const [filterDivision, setFilterDivision] = React.useState<string>("");
  const [filterArea, setFilterArea] = React.useState<string>("");
  const [showForm, setShowForm] = React.useState(false);
  const [editProject, setEditProject] = React.useState<IProject | undefined>();
  const [selectedProject, setSelectedProject] = React.useState<IProject | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<IProject | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(pageSize);

  const divisionOptions: IDropdownOption[] = [
    { key: "", text: "All Divisions" },
    ...getDivisionOptions(),
  ];
  const areaOptions: IDropdownOption[] = [
    { key: "", text: "All Areas" },
    ...(filterDivision ? getAreaOptions(filterDivision) : []),
  ];

  const filteredProjects = projects.filter((p) => {
    if (filterDivision && p.Division !== filterDivision) return false;
    if (filterArea && p.Area !== filterArea) return false;
    const search = searchText.toLowerCase();
    return (
      (p.Title || "").toLowerCase().includes(search) ||
      (p.ProjectCode || "").toLowerCase().includes(search) ||
      (p.Division || "").toLowerCase().includes(search) ||
      (p.Area || "").toLowerCase().includes(search) ||
      (p.Client || "").toLowerCase().includes(search)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pagedProjects = filteredProjects.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterDivision, filterArea]);

  const pageSizeOptions: IDropdownOption[] = [
    { key: 10, text: "10" },
    { key: 25, text: "25" },
    { key: 50, text: "50" },
  ];

  const commandItems: ICommandBarItemProps[] = canCreateProjects
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
      key: "division",
      name: "Division",
      fieldName: "Division",
      minWidth: 120,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: IProject) => item.Division || "--",
    },
    {
      key: "area",
      name: "Area",
      fieldName: "Area",
      minWidth: 120,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: IProject) => item.Area || "--",
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
      key: "pm",
      name: "Project Manager",
      minWidth: 120,
      maxWidth: 180,
      isResizable: true,
      onRender: (item: IProject) => item.ProjectManagerTitle || "--",
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
    ...(canCreateProjects
      ? [
          {
            key: "actions",
            name: "Actions",
            minWidth: 80,
            maxWidth: 100,
            onRender: (item: IProject) => (
              <Stack horizontal tokens={{ childrenGap: 4 }}>
                <IconButton
                  iconProps={{ iconName: "Edit" }}
                  title="Edit Project"
                  onClick={() => {
                    setEditProject(item);
                    setShowForm(true);
                  }}
                />
                <IconButton
                  iconProps={{ iconName: "Archive" }}
                  title="Archive Project"
                  onClick={() => setArchiveTarget(item)}
                />
              </Stack>
            ),
          } as IColumn,
        ]
      : []),
  ];

  if (loading) return <LoadingSpinner label="Loading projects..." />;

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        onUpdate={async (id, data) => {
          await update(id, data);
        }}
      />
    );
  }

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 16 } }}>
      {error && <ErrorMessage message={error} />}

      <CommandBar items={commandItems} styles={{ root: { paddingLeft: 0 } }} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <SearchBox
          placeholder="Search projects..."
          value={searchText}
          onChange={(_, val) => setSearchText(val || "")}
          styles={{ root: { width: 250, height: 32 } }}
        />
        <Dropdown
          placeholder="All Divisions"
          options={divisionOptions}
          selectedKey={filterDivision}
          onChange={(_, opt) => {
            setFilterDivision((opt?.key as string) || "");
            setFilterArea("");
          }}
          styles={{ root: { width: 220 }, dropdown: { height: 32 } }}
          ariaLabel="Filter by Division"
        />
        <Dropdown
          placeholder="All Areas"
          options={areaOptions}
          selectedKey={filterArea}
          onChange={(_, opt) => setFilterArea((opt?.key as string) || "")}
          disabled={!filterDivision}
          styles={{ root: { width: 220 }, dropdown: { height: 32 } }}
          ariaLabel="Filter by Area"
        />
      </div>

      <DetailsList
        items={pagedProjects}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        isHeaderVisible={true}
      />

      <Stack horizontal verticalAlign="center" horizontalAlign="space-between" tokens={{ childrenGap: 12 }}>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
            Showing {filteredProjects.length === 0 ? 0 : (safePage - 1) * itemsPerPage + 1}–{Math.min(safePage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length}
          </Text>
          <Dropdown
            options={pageSizeOptions}
            selectedKey={itemsPerPage}
            onChange={(_, opt) => {
              if (opt) {
                setItemsPerPage(opt.key as number);
                setCurrentPage(1);
              }
            }}
            styles={{ root: { width: 70 }, title: { fontSize: 12 } }}
            ariaLabel="Items per page"
          />
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>per page</Text>
        </Stack>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
          <IconButton
            iconProps={{ iconName: "ChevronLeft" }}
            title="Previous page"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage(safePage - 1)}
          />
          <Text variant="small">
            Page {safePage} of {totalPages}
          </Text>
          <IconButton
            iconProps={{ iconName: "ChevronRight" }}
            title="Next page"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage(safePage + 1)}
          />
        </Stack>
      </Stack>

      <Dialog
        hidden={!archiveTarget}
        onDismiss={() => setArchiveTarget(null)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Archive Project",
          subText: archiveTarget
            ? `Are you sure you want to archive "${archiveTarget.Title}"? This project will no longer appear in active lists.`
            : "",
        }}
      >
        <DialogFooter>
          <PrimaryButton
            text="Archive"
            onClick={async () => {
              if (archiveTarget) {
                await archive(archiveTarget.Id);
                setArchiveTarget(null);
              }
            }}
          />
          <DefaultButton text="Cancel" onClick={() => setArchiveTarget(null)} />
        </DialogFooter>
      </Dialog>

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
