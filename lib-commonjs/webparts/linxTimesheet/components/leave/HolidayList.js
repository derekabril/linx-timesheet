"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidayList = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var DetailsList_1 = require("@fluentui/react/lib/DetailsList");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Text_1 = require("@fluentui/react/lib/Text");
var AppContext_1 = require("../../context/AppContext");
var dateUtils_1 = require("../../utils/dateUtils");
var useAppTheme_1 = require("../../hooks/useAppTheme");
var HolidayList = function () {
    var holidays = (0, AppContext_1.useAppContext)().holidays;
    var colors = (0, useAppTheme_1.useAppTheme)().colors;
    var columns = [
        {
            key: "name",
            name: "Holiday",
            fieldName: "Title",
            minWidth: 150,
            maxWidth: 250,
        },
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
    ];
    return (React.createElement(Stack_1.Stack, { tokens: { childrenGap: 8 } },
        React.createElement(Text_1.Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Company Holidays"),
        holidays.length === 0 ? (React.createElement(Text_1.Text, { styles: { root: { color: colors.textSecondary, fontStyle: "italic" } } }, "No holidays configured.")) : (React.createElement(DetailsList_1.DetailsList, { items: holidays, columns: columns, layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none, compact: true }))));
};
exports.HolidayList = HolidayList;
//# sourceMappingURL=HolidayList.js.map