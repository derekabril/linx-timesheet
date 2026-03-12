"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskList = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DetailsList_1 = require("@fluentui/react/lib/DetailsList");
var Button_1 = require("@fluentui/react/lib/Button");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var useTasks_1 = require("../../hooks/useTasks");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var LoadingSpinner_1 = require("../common/LoadingSpinner");
var TaskForm_1 = require("./TaskForm");
var AppContext_1 = require("../../context/AppContext");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var TaskList = function (_a) {
    var projectId = _a.projectId;
    var isAdmin = (0, AppContext_1.useAppContext)().isAdmin;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var _b = (0, useTasks_1.useTasks)(projectId), tasks = _b.tasks, loading = _b.loading, create = _b.create;
    var _c = tslib_1.__read(React.useState(false), 2), showForm = _c[0], setShowForm = _c[1];
    var columns = [
        { key: "code", name: "Code", fieldName: "TaskCode", minWidth: 80, maxWidth: 100 },
        { key: "title", name: "Task Name", fieldName: "Title", minWidth: 150, maxWidth: 250 },
        {
            key: "planned",
            name: "Planned Hours",
            minWidth: 90,
            maxWidth: 110,
            onRender: function (item) { return (0, hoursFormatter_1.formatHours)(item.PlannedHours); },
        },
        {
            key: "status",
            name: "Active",
            minWidth: 60,
            maxWidth: 80,
            onRender: function (item) { return (item.IsActive ? "Yes" : "No"); },
        },
    ];
    if (loading)
        return React.createElement(LoadingSpinner_1.LoadingSpinner, { label: "Loading tasks..." });
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 } },
        React.createElement(Stack_1.Stack, { horizontal: true, horizontalAlign: "space-between", verticalAlign: "center" },
            React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Tasks"),
            isAdmin && (React.createElement(Button_1.PrimaryButton, { text: "Add Task", iconProps: { iconName: "Add" }, onClick: function () { return setShowForm(true); } }))),
        tasks.length === 0 ? (React.createElement(Text_1.Text, { styles: { root: { color: colors.textSecondary, fontStyle: "italic" } } }, "No tasks defined for this project.")) : (React.createElement(DetailsList_1.DetailsList, { items: tasks, columns: columns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none, compact: true })),
        showForm && (React.createElement(TaskForm_1.TaskForm, { isOpen: showForm, projectId: projectId, onSave: function (data) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, create(data)];
                        case 1:
                            _a.sent();
                            setShowForm(false);
                            return [2 /*return*/];
                    }
                });
            }); }, onDismiss: function () { return setShowForm(false); } }))));
};
exports.TaskList = TaskList;
//# sourceMappingURL=TaskList.js.map