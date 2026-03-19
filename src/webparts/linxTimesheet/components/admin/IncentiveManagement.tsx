import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { PrimaryButton, IconButton, DefaultButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { TextField } from "@fluentui/react/lib/TextField";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { SpinButton } from "@fluentui/react/lib/SpinButton";
import { Toggle } from "@fluentui/react/lib/Toggle";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { Pivot, PivotItem } from "@fluentui/react/lib/Pivot";
import { NormalPeoplePicker } from "@fluentui/react/lib/Pickers";
import { IPersonaProps } from "@fluentui/react/lib/Persona";
import { useIncentives } from "../../hooks/useIncentives";
import { IIncentive, IIncentiveAssignment } from "../../models/IIncentive";
import { IncentiveFrequency, IncentiveType } from "../../models/enums";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorMessage } from "../common/ErrorMessage";
import { UserService, ISiteUser } from "../../services/UserService";
import { getSP } from "../../services/PnPConfig";
import { useAppTheme } from "../../hooks/useAppTheme";

const userToPersona = (user: ISiteUser): IPersonaProps => ({
  key: String(user.Id),
  text: user.Title,
  secondaryText: user.Email,
});

const frequencyOptions: IDropdownOption[] = [
  { key: IncentiveFrequency.Daily, text: "Daily" },
  { key: IncentiveFrequency.Weekly, text: "Weekly" },
  { key: IncentiveFrequency.Monthly, text: "Monthly" },
];

const typeOptions: IDropdownOption[] = [
  { key: IncentiveType.Individual, text: "Individual" },
  { key: IncentiveType.Team, text: "Team" },
  { key: IncentiveType.Company, text: "Company" },
];

export const IncentiveManagement: React.FC = () => {
  const { incentives, assignments, loading, error, create, update, remove, assign, unassign } = useIncentives();
  const { colors } = useAppTheme();
  const userService = React.useMemo(() => new UserService(getSP()), []);

  // ── Incentive form state ──
  const [showForm, setShowForm] = React.useState(false);
  const [editIncentive, setEditIncentive] = React.useState<IIncentive | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<IIncentive | null>(null);
  const [title, setTitle] = React.useState("");
  const [frequency, setFrequency] = React.useState<string>(IncentiveFrequency.Daily);
  const [value, setValue] = React.useState(0);
  const [incentiveType, setIncentiveType] = React.useState<string>(IncentiveType.Individual);
  const [isActive, setIsActive] = React.useState(true);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  // ── Assignment state ──
  const [showAssignPanel, setShowAssignPanel] = React.useState(false);
  const [assignIncentive, setAssignIncentive] = React.useState<IIncentive | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<IPersonaProps[]>([]);
  const [assignError, setAssignError] = React.useState<string | null>(null);
  const [assigning, setAssigning] = React.useState(false);
  const [deleteAssignTarget, setDeleteAssignTarget] = React.useState<IIncentiveAssignment | null>(null);

  const openNew = (): void => {
    setEditIncentive(null);
    setTitle("");
    setFrequency(IncentiveFrequency.Daily);
    setValue(0);
    setIncentiveType(IncentiveType.Individual);
    setIsActive(true);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (item: IIncentive): void => {
    setEditIncentive(item);
    setTitle(item.Title);
    setFrequency(item.Frequency);
    setValue(item.Value);
    setIncentiveType(item.IncentiveType);
    setIsActive(item.IsActive);
    setFormError(null);
    setShowForm(true);
  };

  const handleSave = async (): Promise<void> => {
    if (!title.trim()) {
      setFormError("Please enter an incentive name.");
      return;
    }
    if (value <= 0) {
      setFormError("Value must be greater than 0.");
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      if (editIncentive) {
        await update(editIncentive.Id, {
          Title: title.trim(),
          Frequency: frequency,
          Value: value,
          IncentiveType: incentiveType,
          IsActive: isActive,
        });
      } else {
        await create({
          Title: title.trim(),
          Frequency: frequency,
          Value: value,
          IncentiveType: incentiveType,
          IsActive: isActive,
        });
      }
      setShowForm(false);
    } catch (e) {
      setFormError(`Failed to save: ${e}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Assignment handlers ──
  const openAssign = (item: IIncentive): void => {
    setAssignIncentive(item);
    setSelectedUser([]);
    setAssignError(null);
    setShowAssignPanel(true);
  };

  const onResolveSuggestions = async (
    filter: string,
    selectedItems?: IPersonaProps[]
  ): Promise<IPersonaProps[]> => {
    if (!filter || filter.length < 2) return [];
    try {
      const users = await userService.searchUsers(filter);
      const selectedIds = (selectedItems || []).map((p) => p.key);
      // Exclude users already assigned to this incentive
      const existingIds = assignments
        .filter((a) => a.IncentiveId === assignIncentive?.Id)
        .map((a) => String(a.EmployeeId));
      return users
        .filter((u) => !selectedIds.includes(String(u.Id)) && !existingIds.includes(String(u.Id)))
        .map(userToPersona);
    } catch {
      return [];
    }
  };

  const handleAssign = async (): Promise<void> => {
    if (selectedUser.length === 0 || !assignIncentive) {
      setAssignError("Please select a user.");
      return;
    }
    setAssignError(null);
    setAssigning(true);
    try {
      const userId = Number(selectedUser[0].key);
      await assign({
        Title: `${assignIncentive.Title} - ${selectedUser[0].text}`,
        IncentiveId: assignIncentive.Id,
        EmployeeId: userId,
      });
      setSelectedUser([]);
    } catch (e) {
      setAssignError(`Failed to assign: ${e}`);
    } finally {
      setAssigning(false);
    }
  };

  // ── Incentive columns ──
  const incentiveColumns: IColumn[] = [
    { key: "title", name: "Incentive", minWidth: 200, maxWidth: 320, onRender: (item: IIncentive) => item.Title },
    { key: "frequency", name: "Frequency", minWidth: 80, maxWidth: 100, onRender: (item: IIncentive) => item.Frequency },
    {
      key: "value", name: "Value", minWidth: 80, maxWidth: 100,
      onRender: (item: IIncentive) => `$${item.Value.toFixed(2)}`,
    },
    { key: "type", name: "Type", minWidth: 80, maxWidth: 100, onRender: (item: IIncentive) => item.IncentiveType },
    {
      key: "status", name: "Active", minWidth: 60, maxWidth: 80,
      onRender: (item: IIncentive) => (
        <Text styles={{ root: { color: item.IsActive ? colors.textSuccess : colors.textSecondary } }}>
          {item.IsActive ? "Yes" : "No"}
        </Text>
      ),
    },
    {
      key: "assigned", name: "Assigned", minWidth: 60, maxWidth: 80,
      onRender: (item: IIncentive) => {
        const count = assignments.filter((a) => a.IncentiveId === item.Id).length;
        return count > 0 ? `${count}` : "--";
      },
    },
    {
      key: "actions", name: "Actions", minWidth: 110, maxWidth: 130,
      onRender: (item: IIncentive) => (
        <Stack horizontal tokens={{ childrenGap: 4 }}>
          <IconButton iconProps={{ iconName: "People" }} title="Assign Users" onClick={() => openAssign(item)} />
          <IconButton iconProps={{ iconName: "Edit" }} title="Edit" onClick={() => openEdit(item)} />
          <IconButton iconProps={{ iconName: "Delete" }} title="Delete" onClick={() => setDeleteTarget(item)} />
        </Stack>
      ),
    },
  ];

  // ── Assignment columns ──
  const assignmentColumns: IColumn[] = [
    { key: "incentive", name: "Incentive", minWidth: 200, maxWidth: 300, onRender: (item: IIncentiveAssignment) => item.IncentiveTitle || item.Title },
    { key: "employee", name: "Employee", minWidth: 150, maxWidth: 250, onRender: (item: IIncentiveAssignment) => item.EmployeeTitle || "--" },
    {
      key: "details", name: "Frequency / Value", minWidth: 120, maxWidth: 160,
      onRender: (item: IIncentiveAssignment) => {
        const inc = incentives.find((i) => i.Id === item.IncentiveId);
        return inc ? `${inc.Frequency} / $${inc.Value.toFixed(2)}` : "--";
      },
    },
    {
      key: "actions", name: "", minWidth: 50, maxWidth: 60,
      onRender: (item: IIncentiveAssignment) => (
        <IconButton iconProps={{ iconName: "Delete" }} title="Remove" onClick={() => setDeleteAssignTarget(item)} />
      ),
    },
  ];

  if (loading) return <LoadingSpinner label="Loading incentives..." />;

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 12 } }}>
      {error && <ErrorMessage message={error} />}

      <Pivot>
        {/* ── Incentives Tab ── */}
        <PivotItem headerText="Incentives" itemIcon="Trophy">
          <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 12 } }}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
                Incentive List
              </Text>
              <PrimaryButton text="Add Incentive" iconProps={{ iconName: "Add" }} onClick={openNew} />
            </Stack>

            {incentives.length === 0 ? (
              <Text styles={{ root: { color: colors.textSecondary, fontStyle: "italic" } }}>
                No incentives configured yet. Click "Add Incentive" to get started.
              </Text>
            ) : (
              <DetailsList
                items={incentives}
                columns={incentiveColumns}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
                compact
              />
            )}
          </Stack>
        </PivotItem>

        {/* ── Assignments Tab ── */}
        <PivotItem headerText="Assignments" itemIcon="People">
          <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 12 } }}>
            <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
              Incentive Assignments
            </Text>

            {assignments.length === 0 ? (
              <Text styles={{ root: { color: colors.textSecondary, fontStyle: "italic" } }}>
                No incentives assigned yet. Use the "Assign Users" button on an incentive to assign it.
              </Text>
            ) : (
              <DetailsList
                items={assignments}
                columns={assignmentColumns}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
                compact
              />
            )}
          </Stack>
        </PivotItem>
      </Pivot>

      {/* ── Add/Edit Incentive Panel ── */}
      {showForm && (
        <Panel
          isOpen={showForm}
          onDismiss={() => setShowForm(false)}
          headerText={editIncentive ? "Edit Incentive" : "Add Incentive"}
          type={PanelType.smallFixedFar}
          onRenderFooterContent={() => (
            <Stack horizontal tokens={{ childrenGap: 8 }}>
              <PrimaryButton text="Save" onClick={handleSave} disabled={saving} />
              <DefaultButton text="Cancel" onClick={() => setShowForm(false)} />
            </Stack>
          )}
          isFooterAtBottom
        >
          <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 16 } }}>
            {formError && <MessageBar messageBarType={MessageBarType.error}>{formError}</MessageBar>}
            <TextField
              label="Incentive Name"
              value={title}
              onChange={(_, v) => setTitle(v || "")}
              required
            />
            <Dropdown
              label="Frequency"
              selectedKey={frequency}
              options={frequencyOptions}
              onChange={(_, opt) => setFrequency((opt?.key as string) || IncentiveFrequency.Daily)}
            />
            <SpinButton
              label="Value ($)"
              min={0}
              max={100000}
              step={1}
              value={String(value)}
              onChange={(_, v) => setValue(Number(v) || 0)}
            />
            <Dropdown
              label="Type"
              selectedKey={incentiveType}
              options={typeOptions}
              onChange={(_, opt) => setIncentiveType((opt?.key as string) || IncentiveType.Individual)}
            />
            <Toggle
              label="Active"
              checked={isActive}
              onChange={(_, checked) => setIsActive(checked ?? true)}
            />
          </Stack>
        </Panel>
      )}

      {/* ── Assign Users Panel ── */}
      {showAssignPanel && assignIncentive && (
        <Panel
          isOpen={showAssignPanel}
          onDismiss={() => setShowAssignPanel(false)}
          headerText={`Assign: ${assignIncentive.Title}`}
          type={PanelType.smallFixedFar}
          isFooterAtBottom
        >
          <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 16 } }}>
            {assignError && <MessageBar messageBarType={MessageBarType.error}>{assignError}</MessageBar>}

            <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
              {assignIncentive.Frequency} — ${assignIncentive.Value.toFixed(2)} — {assignIncentive.IncentiveType}
            </Text>

            <Stack tokens={{ childrenGap: 8 }}>
              <Text styles={{ root: { fontWeight: 600 } }}>Add User</Text>
              <NormalPeoplePicker
                onResolveSuggestions={onResolveSuggestions}
                selectedItems={selectedUser}
                onChange={(items) => setSelectedUser((items || []).slice(0, 1))}
                itemLimit={1}
                pickerSuggestionsProps={{
                  suggestionsHeaderText: "Suggested people",
                  noResultsFoundText: "No results found",
                  loadingText: "Searching...",
                }}
                resolveDelay={300}
              />
              <PrimaryButton
                text="Assign"
                iconProps={{ iconName: "Add" }}
                onClick={handleAssign}
                disabled={assigning || selectedUser.length === 0}
                styles={{ root: { width: 120 } }}
              />
            </Stack>

            {/* Show current assignments for this incentive */}
            {(() => {
              const current = assignments.filter((a) => a.IncentiveId === assignIncentive.Id);
              if (current.length === 0) return (
                <Text styles={{ root: { color: colors.textSecondary, fontStyle: "italic", paddingTop: 12 } }}>
                  No users assigned yet.
                </Text>
              );
              return (
                <Stack tokens={{ childrenGap: 4 }} styles={{ root: { paddingTop: 12 } }}>
                  <Text styles={{ root: { fontWeight: 600 } }}>Assigned Users</Text>
                  {current.map((a) => (
                    <Stack key={a.Id} horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                      <Text styles={{ root: { flex: 1 } }}>{a.EmployeeTitle || a.Title}</Text>
                      <IconButton
                        iconProps={{ iconName: "Cancel" }}
                        title="Remove"
                        onClick={() => setDeleteAssignTarget(a)}
                      />
                    </Stack>
                  ))}
                </Stack>
              );
            })()}
          </Stack>
        </Panel>
      )}

      {/* ── Delete Incentive Dialog ── */}
      <Dialog
        hidden={!deleteTarget}
        onDismiss={() => setDeleteTarget(null)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Delete Incentive",
          subText: deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.Title}"? All assignments for this incentive will also be removed.`
            : "",
        }}
      >
        <DialogFooter>
          <PrimaryButton
            text="Delete"
            onClick={async () => {
              if (deleteTarget) {
                // Delete assignments first
                const related = assignments.filter((a) => a.IncentiveId === deleteTarget.Id);
                for (const a of related) {
                  await unassign(a.Id);
                }
                await remove(deleteTarget.Id);
                setDeleteTarget(null);
              }
            }}
          />
          <DefaultButton text="Cancel" onClick={() => setDeleteTarget(null)} />
        </DialogFooter>
      </Dialog>

      {/* ── Delete Assignment Dialog ── */}
      <Dialog
        hidden={!deleteAssignTarget}
        onDismiss={() => setDeleteAssignTarget(null)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Remove Assignment",
          subText: deleteAssignTarget
            ? `Remove "${deleteAssignTarget.EmployeeTitle || deleteAssignTarget.Title}" from this incentive?`
            : "",
        }}
      >
        <DialogFooter>
          <PrimaryButton
            text="Remove"
            onClick={async () => {
              if (deleteAssignTarget) {
                await unassign(deleteAssignTarget.Id);
                setDeleteAssignTarget(null);
              }
            }}
          />
          <DefaultButton text="Cancel" onClick={() => setDeleteAssignTarget(null)} />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};
