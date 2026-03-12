"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectCostReport = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DetailsList_1 = require("@fluentui/react/lib/DetailsList");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var ProgressIndicator_1 = require("@fluentui/react/lib/ProgressIndicator");
var useProjects_1 = require("../../hooks/useProjects");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var LoadingSpinner_1 = require("../common/LoadingSpinner");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var ProjectCostReport = function () {
    var _a = (0, useProjects_1.useProjects)(true), projects = _a.projects, loading = _a.loading;
    var _b = (0, useAppTheme_1.useAppTheme)(), colors = _b.colors, theme = _b.theme;
    var projectsWithCost = projects
        .filter(function (p) { return p.ActualHours > 0 || p.PlannedHours > 0; })
        .map(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { totalCost: p.ActualHours * p.HourlyRate, budgetUsed: p.PlannedHours > 0 ? (p.ActualHours / p.PlannedHours) * 100 : 0 })); });
    var totalCost = projectsWithCost.reduce(function (sum, p) { return sum + p.totalCost; }, 0);
    var totalActualHours = projectsWithCost.reduce(function (sum, p) { return sum + p.ActualHours; }, 0);
    var columns = [
        { key: "code", name: "Code", fieldName: "ProjectCode", minWidth: 70, maxWidth: 90 },
        { key: "name", name: "Project", fieldName: "Title", minWidth: 150, maxWidth: 220 },
        { key: "client", name: "Client", fieldName: "Client", minWidth: 100, maxWidth: 150 },
        {
            key: "rate",
            name: "Rate",
            minWidth: 60,
            maxWidth: 80,
            onRender: function (item) { return item.HourlyRate > 0 ? "$".concat(item.HourlyRate) : "--"; },
        },
        {
            key: "actual",
            name: "Hours",
            minWidth: 70,
            maxWidth: 90,
            onRender: function (item) { return (0, hoursFormatter_1.formatHours)(item.ActualHours); },
        },
        {
            key: "cost",
            name: "Cost",
            minWidth: 80,
            maxWidth: 110,
            onRender: function (item) {
                return item.totalCost > 0 ? "$".concat(item.totalCost.toLocaleString()) : "--";
            },
        },
        {
            key: "budget",
            name: "Budget Used",
            minWidth: 150,
            maxWidth: 200,
            onRender: function (item) { return (React.createElement(ProgressIndicator_1.ProgressIndicator, { percentComplete: Math.min(item.budgetUsed / 100, 1), barHeight: 6, styles: {
                    progressBar: { backgroundColor: item.budgetUsed > 100 ? colors.textError : colors.textLink },
                }, description: "".concat(Math.round(item.budgetUsed), "%") })); },
        },
    ];
    if (loading)
        return React.createElement(LoadingSpinner_1.LoadingSpinner, { label: "Loading projects..." });
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 }, styles: { root: { paddingTop: 12 } } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Project Cost Tracking"),
        projectsWithCost.length === 0 ? (React.createElement(Text_1.Text, { styles: { root: { color: colors.textSecondary, fontStyle: "italic" } } }, "No project data available.")) : (React.createElement(React.Fragment, null,
            React.createElement(DetailsList_1.DetailsList, { items: projectsWithCost, columns: columns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none, compact: true }),
            React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 24 }, styles: { root: { padding: "8px 0", borderTop: "2px solid ".concat(theme.semanticColors.bodyDivider), fontWeight: 600 } } },
                React.createElement(Text_1.Text, null,
                    "Total Hours: ",
                    (0, hoursFormatter_1.formatHours)(totalActualHours)),
                React.createElement(Text_1.Text, null,
                    "Total Cost: $",
                    totalCost.toLocaleString()))))));
};
exports.ProjectCostReport = ProjectCostReport;
//# sourceMappingURL=ProjectCostReport.js.map