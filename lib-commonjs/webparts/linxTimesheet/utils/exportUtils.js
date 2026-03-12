"use strict";
/**
 * Export utilities for Excel, CSV, and PDF generation.
 * Uses dynamic imports to keep initial bundle size small.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToExcel = exportToExcel;
exports.exportToCsv = exportToCsv;
exports.exportToPdf = exportToPdf;
var tslib_1 = require("tslib");
/**
 * Export data to Excel using exceljs (dynamically loaded).
 */
function exportToExcel(data_1, columns_1, fileName_1) {
    return tslib_1.__awaiter(this, arguments, void 0, function (data, columns, fileName, sheetName) {
        var Workbook, wb, ws, buffer;
        if (sheetName === void 0) { sheetName = "Sheet1"; }
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require(/* webpackChunkName: "exceljs" */ "exceljs")); })];
                case 1:
                    Workbook = (_a.sent()).Workbook;
                    wb = new Workbook();
                    wb.creator = "Linx Timesheet";
                    wb.created = new Date();
                    ws = wb.addWorksheet(sheetName);
                    // Set up columns
                    ws.columns = columns.map(function (col) { return ({
                        header: col.header,
                        key: col.key,
                        width: col.width || 15,
                    }); });
                    // Style header row
                    ws.getRow(1).font = { bold: true };
                    ws.getRow(1).fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FF0078D4" },
                    };
                    ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
                    // Add data rows
                    data.forEach(function (row) { return ws.addRow(row); });
                    return [4 /*yield*/, wb.xlsx.writeBuffer()];
                case 2:
                    buffer = _a.sent();
                    downloadBlob(buffer, "".concat(fileName, ".xlsx"), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Export data to CSV.
 */
function exportToCsv(data, columns, fileName) {
    var headers = columns.map(function (c) { return "\"".concat(c.header, "\""); }).join(",");
    var rows = data.map(function (row) {
        return columns
            .map(function (col) {
            var val = row[col.key];
            if (val === null || val === undefined)
                return '""';
            var str = String(val).replace(/"/g, '""');
            return "\"".concat(str, "\"");
        })
            .join(",");
    });
    var csv = tslib_1.__spreadArray([headers], tslib_1.__read(rows), false).join("\n");
    downloadBlob(new TextEncoder().encode(csv), "".concat(fileName, ".csv"), "text/csv;charset=utf-8");
}
/**
 * Export data to PDF using jspdf (dynamically loaded).
 */
function exportToPdf(data, columns, title, fileName) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var jsPDF, autoTable, doc;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require(/* webpackChunkName: "jspdf" */ "jspdf")); })];
                case 1:
                    jsPDF = (_a.sent()).jsPDF;
                    return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require(/* webpackChunkName: "jspdf-autotable" */ "jspdf-autotable")); })];
                case 2:
                    autoTable = (_a.sent()).default;
                    doc = new jsPDF({ orientation: "landscape" });
                    // Title
                    doc.setFontSize(16);
                    doc.text(title, 14, 16);
                    doc.setFontSize(10);
                    doc.text("Generated: ".concat(new Date().toLocaleDateString()), 14, 23);
                    // Table
                    autoTable(doc, {
                        head: [columns.map(function (c) { return c.header; })],
                        body: data.map(function (row) { return columns.map(function (col) { var _a; return String((_a = row[col.key]) !== null && _a !== void 0 ? _a : ""); }); }),
                        startY: 28,
                        styles: { fontSize: 8 },
                        headStyles: { fillColor: [0, 120, 212] },
                    });
                    doc.save("".concat(fileName, ".pdf"));
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Helper to trigger a browser download from a buffer or typed array.
 */
function downloadBlob(data, fileName, mimeType) {
    var blob = new Blob([data], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
//# sourceMappingURL=exportUtils.js.map