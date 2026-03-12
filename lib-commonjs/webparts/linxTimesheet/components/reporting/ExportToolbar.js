"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportToolbar = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var CommandBar_1 = require("@fluentui/react/lib/CommandBar");
var exportUtils_1 = require("../../utils/exportUtils");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var dateUtils_1 = require("../../utils/dateUtils");
var exportColumns = [
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
var ExportToolbar = function (_a) {
    var data = _a.data, reportName = _a.reportName;
    var _b = tslib_1.__read(React.useState(false), 2), exporting = _b[0], setExporting = _b[1];
    var prepareData = function () {
        return data.map(function (entry) { return ({
            EntryDate: (0, dateUtils_1.formatDisplayDate)(entry.EntryDate),
            EntryType: entry.EntryType,
            ClockInFormatted: (0, dateUtils_1.formatTime)(entry.ClockIn),
            ClockOutFormatted: (0, dateUtils_1.formatTime)(entry.ClockOut),
            BreakMinutes: entry.BreakMinutes,
            TotalHoursFormatted: (0, hoursFormatter_1.formatHours)(entry.TotalHours),
            ProjectTitle: entry.ProjectTitle || "",
            Notes: entry.Notes || "",
            Status: entry.Status,
        }); });
    };
    var handleExcelExport = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setExporting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, (0, exportUtils_1.exportToExcel)(prepareData(), exportColumns, reportName, "Timesheet")];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    setExporting(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleCsvExport = function () {
        (0, exportUtils_1.exportToCsv)(prepareData(), exportColumns, reportName);
    };
    var handlePdfExport = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setExporting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, (0, exportUtils_1.exportToPdf)(prepareData(), exportColumns, "Timesheet Report - ".concat(reportName), reportName)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    setExporting(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var items = [
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
                        onClick: function () { handleExcelExport(); },
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
                        onClick: function () { handlePdfExport(); },
                    },
                ],
            },
        },
    ];
    return React.createElement(CommandBar_1.CommandBar, { items: items, styles: { root: { padding: 0 } } });
};
exports.ExportToolbar = ExportToolbar;
//# sourceMappingURL=ExportToolbar.js.map