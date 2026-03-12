"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogViewer = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DetailsList_1 = require("@fluentui/react/lib/DetailsList");
var Dropdown_1 = require("@fluentui/react/lib/Dropdown");
var Button_1 = require("@fluentui/react/lib/Button");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var useAuditLog_1 = require("../../hooks/useAuditLog");
var enums_1 = require("../../models/enums");
var constants_1 = require("../../utils/constants");
var LoadingSpinner_1 = require("../common/LoadingSpinner");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var actionOptions = tslib_1.__spreadArray([
    { key: "", text: "All Actions" }
], tslib_1.__read(Object.values(enums_1.AuditAction).map(function (a) { return ({ key: a, text: a }); })), false);
var listOptions = tslib_1.__spreadArray([
    { key: "", text: "All Lists" }
], tslib_1.__read(Object.values(constants_1.LIST_NAMES).map(function (l) { return ({ key: l, text: l }); })), false);
var AuditLogViewer = function () {
    var _a = (0, useAuditLog_1.useAuditLog)(), entries = _a.entries, loading = _a.loading, search = _a.search;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var _b = tslib_1.__read(React.useState(""), 2), actionFilter = _b[0], setActionFilter = _b[1];
    var _c = tslib_1.__read(React.useState(""), 2), listFilter = _c[0], setListFilter = _c[1];
    var year = new Date().getFullYear();
    var handleSearch = function () {
        search({
            year: year,
            action: actionFilter ? actionFilter : undefined,
            targetList: listFilter || undefined,
        });
    };
    React.useEffect(function () {
        handleSearch();
    }, []);
    var columns = [
        {
            key: "date",
            name: "Date/Time",
            minWidth: 140,
            maxWidth: 180,
            onRender: function (item) {
                return new Date(item.Created).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                });
            },
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
            onRender: function (item) { var _a; return ((_a = item.PerformedBy) === null || _a === void 0 ? void 0 : _a.Title) || item.PerformedByTitle || "User ".concat(item.PerformedById || "unknown"); },
        },
        {
            key: "details",
            name: "Details",
            minWidth: 200,
            isMultiline: true,
            onRender: function (item) {
                if (item.NewValue) {
                    try {
                        var parsed = JSON.parse(item.NewValue);
                        return (React.createElement(Text_1.Text, { variant: "tiny", styles: { root: { fontFamily: "monospace", wordBreak: "break-all" } } }, Object.entries(parsed)
                            .map(function (_a) {
                            var _b = tslib_1.__read(_a, 2), k = _b[0], v = _b[1];
                            return "".concat(k, ": ").concat(v);
                        })
                            .join(", ")));
                    }
                    catch (_a) {
                        return React.createElement(Text_1.Text, { variant: "tiny" }, item.Title);
                    }
                }
                return React.createElement(Text_1.Text, { variant: "tiny" }, item.Title);
            },
        },
    ];
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 }, styles: { root: { paddingTop: 16 } } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } },
            "Audit Log (",
            year,
            ")"),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 12 }, wrap: true, verticalAlign: "end" },
            React.createElement(Dropdown_1.Dropdown, { label: "Action", options: actionOptions, selectedKey: actionFilter, onChange: function (_, opt) { return setActionFilter((opt === null || opt === void 0 ? void 0 : opt.key) || ""); }, styles: { root: { width: 150 } } }),
            React.createElement(Dropdown_1.Dropdown, { label: "List", options: listOptions, selectedKey: listFilter, onChange: function (_, opt) { return setListFilter((opt === null || opt === void 0 ? void 0 : opt.key) || ""); }, styles: { root: { width: 200 } } }),
            React.createElement(Button_1.PrimaryButton, { text: "Search", iconProps: { iconName: "Search" }, onClick: handleSearch, disabled: loading })),
        loading ? (React.createElement(LoadingSpinner_1.LoadingSpinner, { label: "Loading audit log..." })) : entries.length === 0 ? (React.createElement(Text_1.Text, { styles: { root: { color: colors.textSecondary, fontStyle: "italic" } } }, "No audit log entries found.")) : (React.createElement(React.Fragment, null,
            React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } },
                "Showing ",
                entries.length,
                " entries"),
            React.createElement(DetailsList_1.DetailsList, { items: entries, columns: columns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none, compact: true })))));
};
exports.AuditLogViewer = AuditLogViewer;
//# sourceMappingURL=AuditLogViewer.js.map