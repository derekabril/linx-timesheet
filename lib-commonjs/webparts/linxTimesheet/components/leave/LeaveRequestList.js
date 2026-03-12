"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRequestList = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DetailsList_1 = require("@fluentui/react/lib/DetailsList");
var Button_1 = require("@fluentui/react/lib/Button");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var AppContext_1 = require("../../context/AppContext");
var useLeaveRequests_1 = require("../../hooks/useLeaveRequests");
var dateUtils_1 = require("../../utils/dateUtils");
var StatusBadge_1 = require("../common/StatusBadge");
var ConfirmDialog_1 = require("../common/ConfirmDialog");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var LeaveRequestList = function () {
    var currentUser = (0, AppContext_1.useAppContext)().currentUser;
    var year = new Date().getFullYear();
    var _a = (0, useLeaveRequests_1.useLeaveRequests)((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || null, year), requests = _a.requests, cancel = _a.cancel;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var _b = tslib_1.__read(React.useState(null), 2), cancelId = _b[0], setCancelId = _b[1];
    var handleCancel = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (cancelId === null)
                        return [2 /*return*/];
                    return [4 /*yield*/, cancel(cancelId)];
                case 1:
                    _a.sent();
                    setCancelId(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var columns = [
        {
            key: "type",
            name: "Type",
            fieldName: "LeaveType",
            minWidth: 80,
            maxWidth: 110,
        },
        {
            key: "start",
            name: "Start",
            minWidth: 120,
            maxWidth: 150,
            onRender: function (item) { return (0, dateUtils_1.formatDisplayDate)(item.StartDate); },
        },
        {
            key: "end",
            name: "End",
            minWidth: 120,
            maxWidth: 150,
            onRender: function (item) { return (0, dateUtils_1.formatDisplayDate)(item.EndDate); },
        },
        {
            key: "days",
            name: "Days",
            fieldName: "TotalDays",
            minWidth: 50,
            maxWidth: 60,
        },
        {
            key: "status",
            name: "Status",
            minWidth: 80,
            maxWidth: 100,
            onRender: function (item) { return React.createElement(StatusBadge_1.StatusBadge, { status: item.Status }); },
        },
        {
            key: "comments",
            name: "Comments",
            fieldName: "ApproverComments",
            minWidth: 150,
            maxWidth: 250,
            onRender: function (item) { return item.ApproverComments || "--"; },
        },
        {
            key: "actions",
            name: "",
            minWidth: 40,
            maxWidth: 40,
            onRender: function (item) {
                return item.Status === "Submitted" || item.Status === "Draft" ? (React.createElement(Button_1.IconButton, { iconProps: { iconName: "Cancel" }, title: "Cancel request", onClick: function () { return setCancelId(item.Id); } })) : null;
            },
        },
    ];
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } },
            "My Leave Requests (",
            year,
            ")"),
        requests.length === 0 ? (React.createElement(Text_1.Text, { styles: { root: { color: colors.textSecondary, fontStyle: "italic" } } }, "No leave requests for this year.")) : (React.createElement(DetailsList_1.DetailsList, { items: requests, columns: columns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none, compact: true })),
        React.createElement(ConfirmDialog_1.ConfirmDialog, { isOpen: cancelId !== null, title: "Cancel Leave Request", message: "Are you sure you want to cancel this leave request?", confirmText: "Cancel Request", onConfirm: handleCancel, onCancel: function () { return setCancelId(null); } })));
};
exports.LeaveRequestList = LeaveRequestList;
//# sourceMappingURL=LeaveRequestList.js.map