"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePagination = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var usePagination = function (items, pageSize) {
    if (pageSize === void 0) { pageSize = 20; }
    var _a = tslib_1.__read((0, react_1.useState)(1), 2), currentPage = _a[0], setCurrentPage = _a[1];
    var totalPages = (0, react_1.useMemo)(function () { return Math.max(1, Math.ceil(items.length / pageSize)); }, [items.length, pageSize]);
    var pageItems = (0, react_1.useMemo)(function () {
        var start = (currentPage - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, currentPage, pageSize]);
    var goToPage = (0, react_1.useCallback)(function (page) {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }, [totalPages]);
    var nextPage = (0, react_1.useCallback)(function () {
        setCurrentPage(function (prev) { return Math.min(prev + 1, totalPages); });
    }, [totalPages]);
    var prevPage = (0, react_1.useCallback)(function () {
        setCurrentPage(function (prev) { return Math.max(prev - 1, 1); });
    }, []);
    return {
        currentPage: currentPage,
        totalPages: totalPages,
        pageItems: pageItems,
        goToPage: goToPage,
        nextPage: nextPage,
        prevPage: prevPage,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
    };
};
exports.usePagination = usePagination;
//# sourceMappingURL=usePagination.js.map