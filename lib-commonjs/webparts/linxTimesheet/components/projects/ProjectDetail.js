"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDetail = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var Button_1 = require("@fluentui/react/lib/Button");
var ProgressIndicator_1 = require("@fluentui/react/lib/ProgressIndicator");
var hoursFormatter_1 = require("../../utils/hoursFormatter");
var TaskList_1 = require("./TaskList");
var PlannedVsActual_1 = require("./PlannedVsActual");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var ProjectDetail = function (_a) {
    var project = _a.project, onBack = _a.onBack;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var progress = project.PlannedHours > 0 ? project.ActualHours / project.PlannedHours : 0;
    var isOver = progress > 1;
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 16 }, styles: { root: { paddingTop: 16 } } },
        React.createElement(Stack_1.Stack, { horizontal: true, verticalAlign: "center", tokens: { childrenGap: 8 } },
            React.createElement(Button_1.IconButton, { iconProps: { iconName: "Back" }, onClick: onBack, title: "Back to list" }),
            React.createElement(Text_1.Text, { variant: "xLarge", styles: { root: { fontWeight: 600 } } },
                project.ProjectCode,
                " - ",
                project.Title)),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 24 }, wrap: true },
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Client"),
                React.createElement(Text_1.Text, null, project.Client || "--")),
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Planned Hours"),
                React.createElement(Text_1.Text, null, (0, hoursFormatter_1.formatHours)(project.PlannedHours))),
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Actual Hours"),
                React.createElement(Text_1.Text, { styles: { root: { color: isOver ? colors.textError : undefined } } }, (0, hoursFormatter_1.formatHours)(project.ActualHours))),
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Hourly Rate"),
                React.createElement(Text_1.Text, null, project.HourlyRate > 0 ? "$".concat(project.HourlyRate) : "--")),
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
                React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Total Cost"),
                React.createElement(Text_1.Text, null, project.HourlyRate > 0
                    ? "$".concat((project.ActualHours * project.HourlyRate).toLocaleString())
                    : "--"))),
        project.PlannedHours > 0 && (React.createElement(ProgressIndicator_1.ProgressIndicator, { label: "Hours Utilization", description: "".concat((0, hoursFormatter_1.formatHours)(project.ActualHours), " of ").concat((0, hoursFormatter_1.formatHours)(project.PlannedHours)), percentComplete: Math.min(progress, 1), barHeight: 8, styles: {
                progressBar: { backgroundColor: isOver ? colors.textError : colors.textLink },
            } })),
        project.Description && (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
            React.createElement(Text_1.Text, { variant: "small", styles: { root: { color: colors.textSecondary } } }, "Description"),
            React.createElement(Text_1.Text, null, project.Description))),
        React.createElement(PlannedVsActual_1.PlannedVsActual, { project: project }),
        React.createElement(TaskList_1.TaskList, { projectId: project.Id })));
};
exports.ProjectDetail = ProjectDetail;
//# sourceMappingURL=ProjectDetail.js.map