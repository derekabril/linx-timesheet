"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyReport = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DetailsList_1 = require("@fluentui/react/lib/DetailsList");
var Dropdown_1 = require("@fluentui/react/lib/Dropdown");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var AppContext_1 = require("../../context/AppContext");
var TimeEntryService_1 = require("../../services/TimeEntryService");
var PnPConfig_1 = require("../../services/PnPConfig");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var dateUtils_1 = require("../../utils/dateUtils");
var LoadingSpinner_1 = require("../common/LoadingSpinner");
var ExportToolbar_1 = require("./ExportToolbar");
var months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
var MonthlyReport = function () {
    var currentUser = (0, AppContext_1.useAppContext)().currentUser;
    var now = new Date();
    var _a = tslib_1.__read(React.useState(now.getMonth()), 2), selectedMonth = _a[0], setSelectedMonth = _a[1];
    var _b = tslib_1.__read(React.useState(now.getFullYear()), 2), selectedYear = _b[0], setSelectedYear = _b[1];
    var _c = tslib_1.__read(React.useState([]), 2), entries = _c[0], setEntries = _c[1];
    var _d = tslib_1.__read(React.useState(false), 2), loading = _d[0], setLoading = _d[1];
    var monthOptions = months.map(function (m, i) { return ({ key: i, text: m }); });
    var yearOptions = [
        { key: now.getFullYear() - 1, text: String(now.getFullYear() - 1) },
        { key: now.getFullYear(), text: String(now.getFullYear()) },
    ];
    React.useEffect(function () {
        var load = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var service, start, end, data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!currentUser)
                            return [2 /*return*/];
                        setLoading(true);
                        service = new TimeEntryService_1.TimeEntryService((0, PnPConfig_1.getSP)());
                        start = new Date(selectedYear, selectedMonth, 1);
                        end = new Date(selectedYear, selectedMonth + 1, 0);
                        return [4 /*yield*/, service.getByDateRange(currentUser.id, (0, dateUtils_1.toDateString)(start), (0, dateUtils_1.toDateString)(end))];
                    case 1:
                        data = _a.sent();
                        setEntries(data);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        load();
    }, [currentUser, selectedMonth, selectedYear]);
    // Group by week
    var weeklyTotals = React.useMemo(function () {
        var weeks = new Map();
        entries.forEach(function (e) {
            var w = e.WeekNumber;
            var existing = weeks.get(w) || { weekNumber: w, totalHours: 0, entries: 0 };
            existing.totalHours += e.TotalHours;
            existing.entries += 1;
            weeks.set(w, existing);
        });
        return Array.from(weeks.values()).sort(function (a, b) { return a.weekNumber - b.weekNumber; });
    }, [entries]);
    var totalHours = entries.reduce(function (sum, e) { return sum + e.TotalHours; }, 0);
    var columns = [
        { key: "week", name: "Week", minWidth: 60, maxWidth: 80, onRender: function (item) { return "W".concat(item.weekNumber); } },
        { key: "entries", name: "Entries", fieldName: "entries", minWidth: 60, maxWidth: 80 },
        { key: "hours", name: "Total Hours", minWidth: 80, maxWidth: 110, onRender: function (item) { return (0, hoursFormatter_1.formatHours)(item.totalHours); } },
    ];
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 } },
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 12 } },
            React.createElement(Dropdown_1.Dropdown, { label: "Month", options: monthOptions, selectedKey: selectedMonth, onChange: function (_, opt) { return opt && setSelectedMonth(opt.key); }, styles: { root: { width: 140 } } }),
            React.createElement(Dropdown_1.Dropdown, { label: "Year", options: yearOptions, selectedKey: selectedYear, onChange: function (_, opt) { return opt && setSelectedYear(opt.key); }, styles: { root: { width: 100 } } })),
        React.createElement(ExportToolbar_1.ExportToolbar, { data: entries, reportName: "monthly-".concat(months[selectedMonth], "-").concat(selectedYear) }),
        loading ? (React.createElement(LoadingSpinner_1.LoadingSpinner, { label: "Loading..." })) : (React.createElement(React.Fragment, null,
            React.createElement(DetailsList_1.DetailsList, { items: weeklyTotals, columns: columns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none, compact: true }),
            React.createElement(Text_1.Text, { styles: { root: { fontWeight: 600 } } },
                "Month Total: ",
                (0, hoursFormatter_1.formatHours)(totalHours),
                " (",
                entries.length,
                " entries)")))));
};
exports.MonthlyReport = MonthlyReport;
//# sourceMappingURL=MonthlyReport.js.map