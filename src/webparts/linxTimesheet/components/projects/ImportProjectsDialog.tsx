import * as React from "react";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { ProgressIndicator } from "@fluentui/react/lib/ProgressIndicator";
import { Icon } from "@fluentui/react/lib/Icon";
import { IProjectCreate } from "../../models/IProject";
import { useAppTheme } from "../../hooks/useAppTheme";

interface IParsedRow {
  code: string;
  division: string;
  area: string;
  projectName: string;
  isDuplicate: boolean;
}

interface IImportResult {
  created: number;
  skipped: number;
  failed: number;
  errors: string[];
}

interface IImportProjectsDialogProps {
  isOpen: boolean;
  existingCodes: string[];
  onImport: (project: IProjectCreate) => Promise<void>;
  onDismiss: () => void;
  onComplete: () => void;
}

type ImportStage = "upload" | "preview" | "importing" | "done";

export const ImportProjectsDialog: React.FC<IImportProjectsDialogProps> = ({
  isOpen,
  existingCodes,
  onImport,
  onDismiss,
  onComplete,
}) => {
  const { colors } = useAppTheme();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [stage, setStage] = React.useState<ImportStage>("upload");
  const [rows, setRows] = React.useState<IParsedRow[]>([]);
  const [parseError, setParseError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [result, setResult] = React.useState<IImportResult | null>(null);

  const reset = (): void => {
    setStage("upload");
    setRows([]);
    setParseError(null);
    setProgress(0);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDismiss = (): void => {
    if (stage === "done") {
      onComplete();
    }
    reset();
    onDismiss();
  };

  const getCellValue = (cell: unknown): string => {
    if (cell === null || cell === undefined) return "";
    if (typeof cell === "object" && cell !== null) {
      const obj = cell as Record<string, unknown>;
      // Formula cell — use the computed result if available
      if ("formula" in obj || "sharedFormula" in obj) {
        return obj.result != null ? String(obj.result) : "";
      }
      // Rich text cell
      if ("richText" in obj) return "";
      return "";
    }
    return String(cell);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError(null);

    try {
      const ExcelJS = await import("exceljs");
      const wb = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await wb.xlsx.load(buffer);

      const sheet = wb.getWorksheet("All Projects");
      if (!sheet) {
        setParseError('Sheet "All Projects" not found in the file. Available sheets: ' +
          wb.worksheets.map(ws => ws.name).join(", "));
        return;
      }

      const existingSet = new Set(existingCodes.map(c => c.toLowerCase()));
      const parsed: IParsedRow[] = [];

      sheet.eachRow((row, rowNum) => {
        if (rowNum === 1) return; // skip header

        const code = getCellValue(row.getCell(1).value).trim();
        const division = getCellValue(row.getCell(2).value).trim();
        const area = getCellValue(row.getCell(3).value).trim();
        const projectName = getCellValue(row.getCell(4).value).trim();

        // Skip empty rows
        if (!code || !projectName) return;

        parsed.push({
          code,
          division,
          area,
          projectName,
          isDuplicate: existingSet.has(code.toLowerCase()),
        });
      });

      if (parsed.length === 0) {
        setParseError("No valid project rows found in the file.");
        return;
      }

      setRows(parsed);
      setStage("preview");
    } catch (err) {
      setParseError(`Failed to parse file: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleImport = async (): Promise<void> => {
    const toImport = rows.filter(r => !r.isDuplicate);
    if (toImport.length === 0) return;

    setStage("importing");
    const importResult: IImportResult = { created: 0, skipped: rows.filter(r => r.isDuplicate).length, failed: 0, errors: [] };

    for (let i = 0; i < toImport.length; i++) {
      const row = toImport[i];
      try {
        await onImport({
          Title: row.projectName,
          ProjectCode: row.code,
          Division: row.division,
          Area: row.area,
          Client: "",
          Description: "",
          ProjectManagerId: 0,
          PlannedHours: 0,
          ActualHours: 0,
          IsActive: true,
        });
        importResult.created++;
      } catch (err) {
        importResult.failed++;
        importResult.errors.push(`${row.code}: ${err instanceof Error ? err.message : String(err)}`);
      }
      setProgress((i + 1) / toImport.length);
    }

    setResult(importResult);
    setStage("done");
  };

  const newCount = rows.filter(r => !r.isDuplicate).length;
  const dupCount = rows.filter(r => r.isDuplicate).length;

  const previewColumns: IColumn[] = [
    {
      key: "status",
      name: "",
      minWidth: 24,
      maxWidth: 24,
      onRender: (item: IParsedRow) => (
        <Icon
          iconName={item.isDuplicate ? "StatusCircleBlock" : "StatusCircleCheckmark"}
          styles={{ root: { color: item.isDuplicate ? colors.textSecondary : colors.textSuccess, fontSize: 14 } }}
          title={item.isDuplicate ? "Already exists — will be skipped" : "New — will be imported"}
        />
      ),
    },
    { key: "code", name: "Code", minWidth: 140, maxWidth: 200, onRender: (item: IParsedRow) => item.code },
    { key: "division", name: "Division", minWidth: 140, maxWidth: 200, onRender: (item: IParsedRow) => item.division },
    { key: "area", name: "Area", minWidth: 140, maxWidth: 200, onRender: (item: IParsedRow) => item.area },
    { key: "name", name: "Project Name", minWidth: 160, maxWidth: 280, onRender: (item: IParsedRow) => item.projectName },
  ];

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={stage === "importing" ? undefined : handleDismiss}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: "Import Projects from Excel",
      }}
      minWidth={720}
      maxWidth={900}
      modalProps={{ isBlocking: stage === "importing" }}
    >
      {stage === "upload" && (
        <Stack tokens={{ childrenGap: 12 }}>
          <Text>
            Select an Excel file with an &quot;All Projects&quot; sheet. Expected columns: Code, Division, Area, Project Name.
          </Text>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            style={{ padding: 8 }}
          />
          {parseError && (
            <MessageBar messageBarType={MessageBarType.error}>{parseError}</MessageBar>
          )}
        </Stack>
      )}

      {stage === "preview" && (
        <Stack tokens={{ childrenGap: 12 }}>
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <Text styles={{ root: { color: colors.textSuccess, fontWeight: 600 } }}>
              {newCount} new project{newCount !== 1 ? "s" : ""} to import
            </Text>
            {dupCount > 0 && (
              <Text styles={{ root: { color: colors.textSecondary } }}>
                {dupCount} duplicate{dupCount !== 1 ? "s" : ""} will be skipped
              </Text>
            )}
          </Stack>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            <DetailsList
              items={rows}
              columns={previewColumns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
              compact
            />
          </div>
        </Stack>
      )}

      {stage === "importing" && (
        <Stack tokens={{ childrenGap: 12 }}>
          <Text>Importing projects... Please wait.</Text>
          <ProgressIndicator
            percentComplete={progress}
            description={`${Math.round(progress * 100)}% complete`}
          />
        </Stack>
      )}

      {stage === "done" && result && (
        <Stack tokens={{ childrenGap: 12 }}>
          <MessageBar
            messageBarType={result.failed === 0 ? MessageBarType.success : MessageBarType.warning}
          >
            Import complete: {result.created} created, {result.skipped} skipped (duplicates)
            {result.failed > 0 ? `, ${result.failed} failed` : ""}.
          </MessageBar>
          {result.errors.length > 0 && (
            <Stack tokens={{ childrenGap: 4 }}>
              <Text variant="smallPlus" styles={{ root: { fontWeight: 600 } }}>Errors:</Text>
              {result.errors.map((err, i) => (
                <Text key={i} variant="small" styles={{ root: { color: colors.textError } }}>{err}</Text>
              ))}
            </Stack>
          )}
        </Stack>
      )}

      <DialogFooter>
        {stage === "preview" && (
          <>
            <PrimaryButton
              text={`Import ${newCount} Project${newCount !== 1 ? "s" : ""}`}
              onClick={handleImport}
              disabled={newCount === 0}
            />
            <DefaultButton text="Cancel" onClick={handleDismiss} />
          </>
        )}
        {stage === "done" && (
          <PrimaryButton text="Close" onClick={handleDismiss} />
        )}
        {stage === "upload" && (
          <DefaultButton text="Cancel" onClick={handleDismiss} />
        )}
      </DialogFooter>
    </Dialog>
  );
};
