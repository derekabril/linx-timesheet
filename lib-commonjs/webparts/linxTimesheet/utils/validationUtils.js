"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTimeEntry = validateTimeEntry;
exports.validateProject = validateProject;
exports.validateLeaveRequest = validateLeaveRequest;
var tslib_1 = require("tslib");
/**
 * Validate a manual time entry form.
 */
function validateTimeEntry(data) {
    var errors = [];
    if (!data.entryDate) {
        errors.push("Entry date is required.");
    }
    if (!data.startTime) {
        errors.push("Start time is required.");
    }
    if (!data.endTime) {
        errors.push("End time is required.");
    }
    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
        errors.push("End time must be after start time.");
    }
    if (data.breakMinutes < 0) {
        errors.push("Break minutes cannot be negative.");
    }
    if (data.breakMinutes > 480) {
        errors.push("Break cannot exceed 8 hours.");
    }
    // Check total doesn't exceed 24 hours
    if (data.startTime && data.endTime) {
        var _a = tslib_1.__read(data.startTime.split(":").map(Number), 2), startH = _a[0], startM = _a[1];
        var _b = tslib_1.__read(data.endTime.split(":").map(Number), 2), endH = _b[0], endM = _b[1];
        var totalMinutes = (endH * 60 + endM) - (startH * 60 + startM) - data.breakMinutes;
        if (totalMinutes > 1440) {
            errors.push("Total hours cannot exceed 24 hours.");
        }
        if (totalMinutes <= 0) {
            errors.push("Working time must be greater than 0 after subtracting breaks.");
        }
    }
    return {
        isValid: errors.length === 0,
        errors: errors,
    };
}
/**
 * Validate a project form.
 */
function validateProject(data) {
    var errors = [];
    if (!data.title || data.title.trim().length === 0) {
        errors.push("Project name is required.");
    }
    if (!data.projectCode || data.projectCode.trim().length === 0) {
        errors.push("Project code is required.");
    }
    if (data.projectCode && !/^[A-Za-z0-9-]+$/.test(data.projectCode)) {
        errors.push("Project code can only contain letters, numbers, and hyphens.");
    }
    return { isValid: errors.length === 0, errors: errors };
}
/**
 * Validate a leave request form.
 */
function validateLeaveRequest(data) {
    var errors = [];
    if (!data.startDate) {
        errors.push("Start date is required.");
    }
    if (!data.endDate) {
        errors.push("End date is required.");
    }
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
        errors.push("End date must be on or after start date.");
    }
    if (!data.leaveType) {
        errors.push("Leave type is required.");
    }
    return { isValid: errors.length === 0, errors: errors };
}
//# sourceMappingURL=validationUtils.js.map