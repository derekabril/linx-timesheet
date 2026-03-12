"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectList = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DetailsList_1 = require("@fluentui/react/lib/DetailsList");
var CommandBar_1 = require("@fluentui/react/lib/CommandBar");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var SearchBox_1 = require("@fluentui/react/lib/SearchBox");
var useProjects_1 = require("../../hooks/useProjects");
var AppContext_1 = require("../../context/AppContext");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var LoadingSpinner_1 = require("../common/LoadingSpinner");
var ErrorMessage_1 = require("../common/ErrorMessage");
var ProjectForm_1 = require("./ProjectForm");
var ProjectDetail_1 = require("./ProjectDetail");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var ProjectList = function () {
    var isAdmin = (0, AppContext_1.useAppContext)().isAdmin;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var _a = (0, useProjects_1.useProjects)(true), projects = _a.projects, loading = _a.loading, error = _a.error, refresh = _a.refresh, create = _a.create, update = _a.update, archive = _a.archive;
    var _b = tslib_1.__read(React.useState(""), 2), searchText = _b[0], setSearchText = _b[1];
    var _c = tslib_1.__read(React.useState(false), 2), showForm = _c[0], setShowForm = _c[1];
    var _d = tslib_1.__read(React.useState(), 2), editProject = _d[0], setEditProject = _d[1];
    var _e = tslib_1.__read(React.useState(null), 2), selectedProject = _e[0], setSelectedProject = _e[1];
    var filteredProjects = projects.filter(function (p) {
        return p.Title.toLowerCase().includes(searchText.toLowerCase()) ||
            p.ProjectCode.toLowerCase().includes(searchText.toLowerCase()) ||
            p.Client.toLowerCase().includes(searchText.toLowerCase());
    });
    var commandItems = isAdmin
        ? [
            {
                key: "add",
                text: "New Project",
                iconProps: { iconName: "Add" },
                onClick: function () {
                    setEditProject(undefined);
                    setShowForm(true);
                },
            },
            {
                key: "refresh",
                text: "Refresh",
                iconProps: { iconName: "Refresh" },
                onClick: function () { return refresh(); },
            },
        ]
        : [
            {
                key: "refresh",
                text: "Refresh",
                iconProps: { iconName: "Refresh" },
                onClick: function () { return refresh(); },
            },
        ];
    var columns = [
        {
            key: "code",
            name: "Code",
            fieldName: "ProjectCode",
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
        },
        {
            key: "title",
            name: "Project Name",
            fieldName: "Title",
            minWidth: 150,
            maxWidth: 250,
            isResizable: true,
            onRender: function (item) { return (React.createElement(Text_1.Text, { styles: { root: { cursor: "pointer", color: colors.textLink, ":hover": { textDecoration: "underline" } } }, onClick: function () { return setSelectedProject(item); } }, item.Title)); },
        },
        {
            key: "client",
            name: "Client",
            fieldName: "Client",
            minWidth: 120,
            maxWidth: 180,
            isResizable: true,
        },
        {
            key: "planned",
            name: "Planned",
            minWidth: 70,
            maxWidth: 90,
            onRender: function (item) { return (0, hoursFormatter_1.formatHours)(item.PlannedHours); },
        },
        {
            key: "actual",
            name: "Actual",
            minWidth: 70,
            maxWidth: 90,
            onRender: function (item) { return (0, hoursFormatter_1.formatHours)(item.ActualHours); },
        },
        {
            key: "variance",
            name: "Variance",
            minWidth: 70,
            maxWidth: 90,
            onRender: function (item) {
                var diff = item.PlannedHours - item.ActualHours;
                var color = diff < 0 ? colors.textError : colors.textSuccess;
                return (React.createElement(Text_1.Text, { styles: { root: { color: color } } },
                    diff >= 0 ? "+" : "",
                    (0, hoursFormatter_1.formatHours)(diff)));
            },
        },
        {
            key: "rate",
            name: "Rate",
            minWidth: 60,
            maxWidth: 80,
            onRender: function (item) { return item.HourlyRate > 0 ? "$".concat(item.HourlyRate) : "--"; },
        },
    ];
    if (loading)
        return React.createElement(LoadingSpinner_1.LoadingSpinner, { label: "Loading projects..." });
    if (selectedProject) {
        return (React.createElement(ProjectDetail_1.ProjectDetail, { project: selectedProject, onBack: function () { return setSelectedProject(null); } }));
    }
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 12 }, styles: { root: { paddingTop: 16 } } },
        error && React.createElement(ErrorMessage_1.ErrorMessage, { message: error }),
        React.createElement(CommandBar_1.CommandBar, { items: commandItems }),
        React.createElement(SearchBox_1.SearchBox, { placeholder: "Search projects...", value: searchText, onChange: function (_, val) { return setSearchText(val || ""); }, styles: { root: { maxWidth: 300 } } }),
        React.createElement(DetailsList_1.DetailsList, { items: filteredProjects, columns: columns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none, isHeaderVisible: true }),
        showForm && (React.createElement(ProjectForm_1.ProjectForm, { isOpen: showForm, project: editProject, onSave: function (data) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!editProject) return [3 /*break*/, 2];
                            return [4 /*yield*/, update(editProject.Id, data)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, create(data)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            setShowForm(false);
                            return [2 /*return*/];
                    }
                });
            }); }, onDismiss: function () { return setShowForm(false); } }))));
};
exports.ProjectList = ProjectList;
//# sourceMappingURL=ProjectList.js.map