/**
 * Export utilities for Excel, CSV, and PDF generation.
 * Uses dynamic imports to keep initial bundle size small.
 */

export interface IExportColumn {
  key: string;
  header: string;
  width?: number;
}

/**
 * Export data to Excel using exceljs (dynamically loaded).
 */
export async function exportToExcel(
  data: Record<string, unknown>[],
  columns: IExportColumn[],
  fileName: string,
  sheetName: string = "Sheet1"
): Promise<void> {
  const { Workbook } = await import(/* webpackChunkName: "exceljs" */ "exceljs");
  const wb = new Workbook();
  wb.creator = "Keystone Pulse";
  wb.created = new Date();

  const ws = wb.addWorksheet(sheetName);

  // Set up columns
  ws.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width || 15,
  }));

  // Style header row
  ws.getRow(1).font = { bold: true };
  ws.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0078D4" },
  };
  ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

  // Add data rows
  data.forEach((row) => ws.addRow(row));

  // Generate and download
  const buffer = await wb.xlsx.writeBuffer();
  downloadBlob(
    buffer,
    `${fileName}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}

/**
 * Export data to CSV.
 */
export function exportToCsv(
  data: Record<string, unknown>[],
  columns: IExportColumn[],
  fileName: string
): void {
  const headers = columns.map((c) => `"${c.header}"`).join(",");
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const val = row[col.key];
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(",")
  );

  const csv = [headers, ...rows].join("\n");
  downloadBlob(
    new TextEncoder().encode(csv),
    `${fileName}.csv`,
    "text/csv;charset=utf-8"
  );
}

/**
 * Export data to PDF using jspdf (dynamically loaded).
 */
export async function exportToPdf(
  data: Record<string, unknown>[],
  columns: IExportColumn[],
  title: string,
  fileName: string
): Promise<void> {
  const { jsPDF } = await import(/* webpackChunkName: "jspdf" */ "jspdf");
  const autoTable = (await import(/* webpackChunkName: "jspdf-autotable" */ "jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape" });

  // Title
  doc.setFontSize(16);
  doc.text(title, 14, 16);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 23);

  // Table
  autoTable(doc, {
    head: [columns.map((c) => c.header)],
    body: data.map((row) => columns.map((col) => String(row[col.key] ?? ""))),
    startY: 28,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 120, 212] },
  });

  doc.save(`${fileName}.pdf`);
}

/**
 * Helper to trigger a browser download from a buffer or typed array.
 */
function downloadBlob(
  data: ArrayBuffer | Uint8Array,
  fileName: string,
  mimeType: string
): void {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
