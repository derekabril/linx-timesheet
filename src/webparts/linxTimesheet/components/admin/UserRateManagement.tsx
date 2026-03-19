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
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { SpinButton } from "@fluentui/react/lib/SpinButton";
import { Label } from "@fluentui/react/lib/Label";
import { NormalPeoplePicker } from "@fluentui/react/lib/Pickers";
import { IPersonaProps } from "@fluentui/react/lib/Persona";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useUserRates } from "../../hooks/useUserRates";
import { IUserRate } from "../../models/IUserRate";
import { ContractType } from "../../models/enums";
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

export const UserRateManagement: React.FC = () => {
  const { rates, loading, error, create, update, remove } = useUserRates();
  const { colors } = useAppTheme();
  const userService = React.useMemo(() => new UserService(getSP()), []);

  const [showForm, setShowForm] = React.useState(false);
  const [editRate, setEditRate] = React.useState<IUserRate | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<IUserRate | null>(null);

  // Form state
  const [selectedUser, setSelectedUser] = React.useState<IPersonaProps[]>([]);
  const [hourlyRate, setHourlyRate] = React.useState(0);
  const [maxHoursPerDay, setMaxHoursPerDay] = React.useState(8);
  const [contractType, setContractType] = React.useState<string>(ContractType.Regular);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const openNew = (): void => {
    setEditRate(null);
    setSelectedUser([]);
    setHourlyRate(0);
    setMaxHoursPerDay(8);
    setContractType(ContractType.Regular);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (rate: IUserRate): void => {
    setEditRate(rate);
    setSelectedUser([{
      key: String(rate.EmployeeId),
      text: rate.EmployeeTitle || rate.Title,
    }]);
    setHourlyRate(rate.HourlyRate);
    setMaxHoursPerDay(rate.MaxHoursPerDay || 8);
    setContractType(rate.ContractType || ContractType.Regular);
    setFormError(null);
    setShowForm(true);
  };

  const onResolveSuggestions = async (
    filter: string,
    selectedItems?: IPersonaProps[]
  ): Promise<IPersonaProps[]> => {
    if (!filter || filter.length < 2) return [];
    try {
      const users = await userService.searchUsers(filter);
      const selectedIds = (selectedItems || []).map((p) => p.key);
      // Also exclude users who already have a rate set
      const existingIds = rates.map((r) => String(r.EmployeeId));
      return users
        .filter((u) => !selectedIds.includes(String(u.Id)) && !existingIds.includes(String(u.Id)))
        .map(userToPersona);
    } catch {
      return [];
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!editRate && selectedUser.length === 0) {
      setFormError("Please select a user.");
      return;
    }
    if (hourlyRate <= 0) {
      setFormError("Hourly rate must be greater than 0.");
      return;
    }
    if (maxHoursPerDay <= 0) {
      setFormError("Max hours per day must be greater than 0.");
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      if (editRate) {
        await update(editRate.Id, { HourlyRate: hourlyRate, MaxHoursPerDay: maxHoursPerDay, ContractType: contractType });
      } else {
        const userId = Number(selectedUser[0].key);
        await create({
          Title: selectedUser[0].text || "",
          EmployeeId: userId,
          HourlyRate: hourlyRate,
          MaxHoursPerDay: maxHoursPerDay,
          ContractType: contractType,
        });
      }
      setShowForm(false);
    } catch (e) {
      setFormError(`Failed to save: ${e}`);
    } finally {
      setSaving(false);
    }
  };

  const columns: IColumn[] = [
    {
      key: "name",
      name: "Employee",
      minWidth: 180,
      maxWidth: 280,
      onRender: (item: IUserRate) => item.EmployeeTitle || item.Title,
    },
    {
      key: "rate",
      name: "Hourly Rate",
      minWidth: 100,
      maxWidth: 140,
      onRender: (item: IUserRate) => `$${item.HourlyRate.toFixed(2)}`,
    },
    {
      key: "maxHours",
      name: "Max Hours/Day",
      minWidth: 100,
      maxWidth: 130,
      onRender: (item: IUserRate) => item.MaxHoursPerDay ? `${item.MaxHoursPerDay}h` : "--",
    },
    {
      key: "contractType",
      name: "Contract Type",
      minWidth: 100,
      maxWidth: 130,
      onRender: (item: IUserRate) => item.ContractType || "Regular",
    },
    {
      key: "actions",
      name: "Actions",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: IUserRate) => (
        <Stack horizontal tokens={{ childrenGap: 4 }}>
          <IconButton
            iconProps={{ iconName: "Edit" }}
            title="Edit Rate"
            onClick={() => openEdit(item)}
          />
          <IconButton
            iconProps={{ iconName: "Delete" }}
            title="Delete Rate"
            onClick={() => setDeleteTarget(item)}
          />
        </Stack>
      ),
    },
  ];

  if (loading) return <LoadingSpinner label="Loading user rates..." />;

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 12 } }}>
      {error && <ErrorMessage message={error} />}

      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
          User Hourly Rates
        </Text>
        <PrimaryButton text="Add Rate" iconProps={{ iconName: "Add" }} onClick={openNew} />
      </Stack>

      {rates.length === 0 ? (
        <Text styles={{ root: { color: colors.textSecondary, fontStyle: "italic" } }}>
          No user rates configured yet. Click "Add Rate" to set hourly rates for users.
        </Text>
      ) : (
        <DetailsList
          items={rates}
          columns={columns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          compact
        />
      )}

      {showForm && (
        <Panel
          isOpen={showForm}
          onDismiss={() => setShowForm(false)}
          headerText={editRate ? "Edit Hourly Rate" : "Add Hourly Rate"}
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
            {formError && (
              <MessageBar messageBarType={MessageBarType.error}>{formError}</MessageBar>
            )}
            {editRate ? (
              <Stack tokens={{ childrenGap: 4 }}>
                <Label>Employee</Label>
                <Text>{editRate.EmployeeTitle || editRate.Title}</Text>
              </Stack>
            ) : (
              <Stack tokens={{ childrenGap: 4 }}>
                <Label>Employee</Label>
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
              </Stack>
            )}
            <SpinButton
              label="Hourly Rate ($)"
              min={0}
              max={10000}
              step={5}
              value={String(hourlyRate)}
              onChange={(_, v) => setHourlyRate(Number(v) || 0)}
            />
            <SpinButton
              label="Max Billable Hours Per Day"
              min={0.5}
              max={24}
              step={0.5}
              value={String(maxHoursPerDay)}
              onChange={(_, v) => setMaxHoursPerDay(Number(v) || 8)}
            />
            <Dropdown
              label="Contract Type"
              selectedKey={contractType}
              options={[
                { key: ContractType.Regular, text: "Regular" },
                { key: ContractType.Contractual, text: "Contractual" },
              ] as IDropdownOption[]}
              onChange={(_, opt) => setContractType((opt?.key as string) || ContractType.Regular)}
            />
          </Stack>
        </Panel>
      )}

      <Dialog
        hidden={!deleteTarget}
        onDismiss={() => setDeleteTarget(null)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Delete Rate",
          subText: deleteTarget
            ? `Are you sure you want to delete the hourly rate for "${deleteTarget.EmployeeTitle || deleteTarget.Title}"?`
            : "",
        }}
      >
        <DialogFooter>
          <PrimaryButton
            text="Delete"
            onClick={async () => {
              if (deleteTarget) {
                await remove(deleteTarget.Id);
                setDeleteTarget(null);
              }
            }}
          />
          <DefaultButton text="Cancel" onClick={() => setDeleteTarget(null)} />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};
