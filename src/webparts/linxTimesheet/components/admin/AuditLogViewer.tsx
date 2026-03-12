import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useAuditLog } from "../../hooks/useAuditLog";
import { AuditAction } from "../../models/enums";
import { IAuditLogEntry } from "../../models/IAuditLogEntry";
import { LIST_NAMES } from "../../utils/constants";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useAppTheme } from "../../hooks/useAppTheme";

const actionOptions: IDropdownOption[] = [
  { key: "", text: "All Actions" },
  ...Object.values(AuditAction).map((a: string) => ({ key: a, text: a })),
];

const listOptions: IDropdownOption[] = [
  { key: "", text: "All Lists" },
  ...Object.values(LIST_NAMES).map((l: string) => ({ key: l, text: l })),
];

export const AuditLogViewer: React.FC = () => {
  const { entries, loading, search } = useAuditLog();
  const { colors } = useAppTheme();
  const [actionFilter, setActionFilter] = React.useState<string>("");
  const [listFilter, setListFilter] = React.useState<string>("");
  const year = new Date().getFullYear();

  const handleSearch = (): void => {
    search({
      year,
      action: actionFilter ? (actionFilter as AuditAction) : undefined,
      targetList: listFilter || undefined,
    });
  };

  React.useEffect(() => {
    handleSearch();
  }, []);

  const columns: IColumn[] = [
    {
      key: "date",
      name: "Date/Time",
      minWidth: 140,
      maxWidth: 180,
      onRender: (item: IAuditLogEntry) =>
        new Date(item.Created).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
    },
    {
      key: "action",
      name: "Action",
      fieldName: "Action",
      minWidth: 70,
      maxWidth: 90,
    },
    {
      key: "list",
      name: "List",
      fieldName: "TargetList",
      minWidth: 120,
      maxWidth: 170,
    },
    {
      key: "itemId",
      name: "Item ID",
      fieldName: "TargetItemId",
      minWidth: 60,
      maxWidth: 70,
    },
    {
      key: "user",
      name: "By",
      minWidth: 120,
      maxWidth: 180,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onRender: (item: any) =>
        item.PerformedBy?.Title || item.PerformedByTitle || `User ${item.PerformedById || "unknown"}`,
    },
    {
      key: "details",
      name: "Details",
      minWidth: 200,
      isMultiline: true,
      onRender: (item: IAuditLogEntry) => {
        if (item.NewValue) {
          try {
            const parsed = JSON.parse(item.NewValue);
            return (
              <Text variant="tiny" styles={{ root: { fontFamily: "monospace", wordBreak: "break-all" } }}>
                {Object.entries(parsed as Record<string, unknown>)
                  .map(([k, v]: [string, unknown]) => `${k}: ${v}`)
                  .join(", ")}
              </Text>
            );
          } catch {
            return <Text variant="tiny">{item.Title}</Text>;
          }
        }
        return <Text variant="tiny">{item.Title}</Text>;
      },
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 16 } }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Audit Log ({year})
      </Text>

      <Stack horizontal tokens={{ childrenGap: 12 }} wrap verticalAlign="end">
        <Dropdown
          label="Action"
          options={actionOptions}
          selectedKey={actionFilter}
          onChange={(_, opt) => setActionFilter((opt?.key as string) || "")}
          styles={{ root: { width: 150 } }}
        />
        <Dropdown
          label="List"
          options={listOptions}
          selectedKey={listFilter}
          onChange={(_, opt) => setListFilter((opt?.key as string) || "")}
          styles={{ root: { width: 200 } }}
        />
        <PrimaryButton
          text="Search"
          iconProps={{ iconName: "Search" }}
          onClick={handleSearch}
          disabled={loading}
        />
      </Stack>

      {loading ? (
        <LoadingSpinner label="Loading audit log..." />
      ) : entries.length === 0 ? (
        <Text styles={{ root: { color: colors.textSecondary, fontStyle: "italic" } }}>
          No audit log entries found.
        </Text>
      ) : (
        <>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
            Showing {entries.length} entries
          </Text>
          <DetailsList
            items={entries}
            columns={columns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            compact
          />
        </>
      )}
    </Stack>
  );
};
