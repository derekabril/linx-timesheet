import * as React from "react";
import { CommandBar, ICommandBarItemProps } from "@fluentui/react/lib/CommandBar";
import { ITimeEntry } from "../../models/ITimeEntry";
import { exportToExcel, exportToCsv, exportToPdf, IExportColumn } from "../../utils/exportUtils";
import { formatHours } from "../../utils/hoursFormatter";
import { formatDisplayDate, formatTime } from "../../utils/dateUtils";

interface IExportToolbarProps {
  data: ITimeEntry[];
  reportName: string;
}

const exportColumns: IExportColumn[] = [
  { key: "EntryDate", header: "Date", width: 15 },
  { key: "EntryType", header: "Type", width: 10 },
  { key: "ClockInFormatted", header: "Start", width: 12 },
  { key: "ClockOutFormatted", header: "End", width: 12 },
  { key: "BreakMinutes", header: "Break (min)", width: 12 },
  { key: "TotalHoursFormatted", header: "Hours", width: 10 },
  { key: "ProjectTitle", header: "Project", width: 20 },
  { key: "Notes", header: "Notes", width: 25 },
  { key: "Status", header: "Status", width: 12 },
];

export const ExportToolbar: React.FC<IExportToolbarProps> = ({ data, reportName }) => {
  const [exporting, setExporting] = React.useState(false);

  const prepareData = (): Record<string, unknown>[] => {
    return data.map((entry) => ({
      EntryDate: formatDisplayDate(entry.EntryDate),
      EntryType: entry.EntryType,
      ClockInFormatted: formatTime(entry.ClockIn),
      ClockOutFormatted: formatTime(entry.ClockOut),
      BreakMinutes: entry.BreakMinutes,
      TotalHoursFormatted: formatHours(entry.TotalHours),
      ProjectTitle: entry.ProjectTitle || "",
      Notes: entry.Notes || "",
      Status: entry.Status,
    }));
  };

  const handleExcelExport = async (): Promise<void> => {
    setExporting(true);
    try {
      await exportToExcel(prepareData(), exportColumns, reportName, "Timesheet");
    } finally {
      setExporting(false);
    }
  };

  const handleCsvExport = (): void => {
    exportToCsv(prepareData(), exportColumns, reportName);
  };

  const handlePdfExport = async (): Promise<void> => {
    setExporting(true);
    try {
      await exportToPdf(prepareData(), exportColumns, `Timesheet Report - ${reportName}`, reportName);
    } finally {
      setExporting(false);
    }
  };

  const items: ICommandBarItemProps[] = [
    {
      key: "export",
      text: "Export",
      iconProps: { iconName: "Download" },
      disabled: data.length === 0 || exporting,
      subMenuProps: {
        items: [
          {
            key: "excel",
            text: "Export to Excel",
            iconProps: { iconName: "ExcelDocument" },
            onClick: () => { handleExcelExport(); },
          },
          {
            key: "csv",
            text: "Export to CSV",
            iconProps: { iconName: "TextDocument" },
            onClick: handleCsvExport,
          },
          {
            key: "pdf",
            text: "Export to PDF",
            iconProps: { iconName: "PDF" },
            onClick: () => { handlePdfExport(); },
          },
        ],
      },
    },
  ];

  return <CommandBar items={items} styles={{ root: { padding: 0 } }} />;
};
