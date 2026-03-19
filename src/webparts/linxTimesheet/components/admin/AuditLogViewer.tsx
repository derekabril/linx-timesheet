import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { PrimaryButton, DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
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

const purgeOptions: IDropdownOption[] = [
  { key: 3, text: "Older than 3 months" },
  { key: 6, text: "Older than 6 months" },
  { key: 12, text: "Older than 12 months" },
];

export const AuditLogViewer: React.FC = () => {
  const { entries, loading, search, purge } = useAuditLog();
  const { colors } = useAppTheme();
  const [actionFilter, setActionFilter] = React.useState<string>("");
  const [listFilter, setListFilter] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(50);
  const [showPurgeDialog, setShowPurgeDialog] = React.useState(false);
  const [purgeMonths, setPurgeMonths] = React.useState<number>(6);
  const [purgeResult, setPurgeResult] = React.useState<{ count: number; visible: boolean } | null>(null);
  const year = new Date().getFullYear();

  const handleSearch = (): void => {
    setCurrentPage(1);
    search({
      year,
      action: actionFilter ? (actionFilter as AuditAction) : undefined,
      targetList: listFilter || undefined,
    });
  };

  const handlePurge = async (): Promise<void> => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - purgeMonths);
    const count = await purge(cutoff);
    setShowPurgeDialog(false);
    setPurgeResult({ count, visible: true });
    handleSearch();
  };

  const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
  const pagedEntries = entries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pageSizeOptions: IDropdownOption[] = [
    { key: 25, text: "25" },
    { key: 50, text: "50" },
    { key: 100, text: "100" },
    { key: 200, text: "200" },
  ];

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
        <DefaultButton
          text="Purge Old Entries"
          iconProps={{ iconName: "Delete" }}
          onClick={() => setShowPurgeDialog(true)}
          disabled={loading}
        />
      </Stack>

      {purgeResult?.visible && (
        <MessageBar
          messageBarType={MessageBarType.success}
          onDismiss={() => setPurgeResult(null)}
        >
          Successfully purged {purgeResult.count} audit log {purgeResult.count === 1 ? "entry" : "entries"}.
        </MessageBar>
      )}

      <Dialog
        hidden={!showPurgeDialog}
        onDismiss={() => setShowPurgeDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Purge Audit Log",
          subText: "This will permanently delete old audit log entries. This action cannot be undone.",
        }}
      >
        <Dropdown
          label="Delete entries"
          options={purgeOptions}
          selectedKey={purgeMonths}
          onChange={(_e: React.FormEvent<HTMLDivElement>, opt?: IDropdownOption) => setPurgeMonths(opt?.key as number)}
        />
        <DialogFooter>
          <PrimaryButton text="Purge" onClick={handlePurge} disabled={loading} />
          <DefaultButton text="Cancel" onClick={() => setShowPurgeDialog(false)} />
        </DialogFooter>
      </Dialog>

      {loading ? (
        <LoadingSpinner label="Loading audit log..." />
      ) : entries.length === 0 ? (
        <Text styles={{ root: { color: colors.textSecondary, fontStyle: "italic" } }}>
          No audit log entries found.
        </Text>
      ) : (
        <>
          <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
            <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
              Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, entries.length)} of {entries.length} entries
            </Text>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
              <Text variant="small">Items per page:</Text>
              <Dropdown
                options={pageSizeOptions}
                selectedKey={pageSize}
                onChange={(_, opt) => { setPageSize(opt?.key as number); setCurrentPage(1); }}
                styles={{ root: { width: 80 } }}
              />
            </Stack>
          </Stack>
          <DetailsList
            items={pagedEntries}
            columns={columns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            compact
          />
          {totalPages > 1 && (
            <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={{ childrenGap: 8 }}>
              <IconButton
                iconProps={{ iconName: "ChevronLeft" }}
                title="Previous page"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              />
              <Text variant="small">
                Page {currentPage} of {totalPages}
              </Text>
              <IconButton
                iconProps={{ iconName: "ChevronRight" }}
                title="Next page"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              />
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
};
