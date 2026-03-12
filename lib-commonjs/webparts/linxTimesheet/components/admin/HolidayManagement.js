"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidayManagement = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DetailsList_1 = require("@fluentui/react/lib/DetailsList");
var Button_1 = require("@fluentui/react/lib/Button");
var TextField_1 = require("@fluentui/react/lib/TextField");
var DatePicker_1 = require("@fluentui/react/lib/DatePicker");
var Toggle_1 = require("@fluentui/react/lib/Toggle");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var AppContext_1 = require("../../context/AppContext");
var HolidayService_1 = require("../../services/HolidayService");
var PnPConfig_1 = require("../../services/PnPConfig");
var dateUtils_1 = require("../../utils/dateUtils");
var ConfirmDialog_1 = require("../common/ConfirmDialog");
var HolidayManagement = function () {
    var _a = (0, AppContext_1.useAppContext)(), holidays = _a.holidays, refreshHolidays = _a.refreshHolidays;
    var service = React.useMemo(function () { return new HolidayService_1.HolidayService((0, PnPConfig_1.getSP)()); }, []);
    var _b = tslib_1.__read(React.useState(""), 2), name = _b[0], setName = _b[1];
    var _c = tslib_1.__read(React.useState(), 2), date = _c[0], setDate = _c[1];
    var _d = tslib_1.__read(React.useState(false), 2), isRecurring = _d[0], setIsRecurring = _d[1];
    var _e = tslib_1.__read(React.useState(false), 2), saving = _e[0], setSaving = _e[1];
    var _f = tslib_1.__read(React.useState(false), 2), success = _f[0], setSuccess = _f[1];
    var _g = tslib_1.__read(React.useState(null), 2), deleteId = _g[0], setDeleteId = _g[1];
    var handleAdd = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!name.trim() || !date)
                        return [2 /*return*/];
                    setSaving(true);
                    setSuccess(false);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 4, 5]);
                    return [4 /*yield*/, service.create({
                            Title: name,
                            HolidayDate: (0, dateUtils_1.toDateString)(date),
                            Year: date.getFullYear(),
                            IsRecurring: isRecurring,
                        })];
                case 2:
                    _a.sent();
                    setName("");
                    setDate(undefined);
                    setIsRecurring(false);
                    setSuccess(true);
                    return [4 /*yield*/, refreshHolidays()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (deleteId === null)
                        return [2 /*return*/];
                    return [4 /*yield*/, service.delete(deleteId)];
                case 1:
                    _a.sent();
                    setDeleteId(null);
                    return [4 /*yield*/, refreshHolidays()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var columns = [
        { key: "name", name: "Holiday", fieldName: "Title", minWidth: 150, maxWidth: 250 },
        {
            key: "date",
            name: "Date",
            minWidth: 120,
            maxWidth: 180,
            onRender: function (item) { return (0, dateUtils_1.formatDisplayDate)(item.HolidayDate); },
        },
        {
            key: "recurring",
            name: "Recurring",
            minWidth: 70,
            maxWidth: 90,
            onRender: function (item) { return (item.IsRecurring ? "Yes" : "No"); },
        },
        {
            key: "actions",
            name: "",
            minWidth: 40,
            maxWidth: 40,
            onRender: function (item) { return (React.createElement(Button_1.IconButton, { iconProps: { iconName: "Delete" }, title: "Delete", onClick: function () { return setDeleteId(item.Id); } })); },
        },
    ];
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 16 }, styles: { root: { paddingTop: 16 } } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Manage Company Holidays"),
        success && (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.success, onDismiss: function () { return setSuccess(false); } }, "Holiday added successfully.")),
        React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 12 }, wrap: true },
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
                React.createElement(Text_1.Text, { variant: "small" }, "Holiday Name"),
                React.createElement(TextField_1.TextField, { value: name, onChange: function (_, v) { return setName(v || ""); }, styles: { root: { width: 200 } } })),
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
                React.createElement(Text_1.Text, { variant: "small" }, "Date"),
                React.createElement(DatePicker_1.DatePicker, { value: date, onSelectDate: function (d) { return setDate(d || undefined); }, styles: { root: { width: 160 } } })),
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 4 } },
                React.createElement(Text_1.Text, { variant: "small" }, "Recurring"),
                React.createElement(Toggle_1.Toggle, { checked: isRecurring, onChange: function (_, val) { return setIsRecurring(val || false); } })),
            React.createElement(Stack_1.Stack, { verticalAlign: "end" },
                React.createElement(Button_1.PrimaryButton, { text: "Add Holiday", iconProps: { iconName: "Add" }, onClick: handleAdd, disabled: saving || !name.trim() || !date }))),
        React.createElement(DetailsList_1.DetailsList, { items: holidays, columns: columns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none, compact: true }),
        React.createElement(ConfirmDialog_1.ConfirmDialog, { isOpen: deleteId !== null, title: "Delete Holiday", message: "Are you sure you want to delete this holiday?", confirmText: "Delete", onConfirm: handleDelete, onCancel: function () { return setDeleteId(null); } })));
};
exports.HolidayManagement = HolidayManagement;
//# sourceMappingURL=HolidayManagement.js.map