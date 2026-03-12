import { ITimeEntryFormData } from "../models/ITimeEntry";

export interface IValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate a manual time entry form.
 */
export function validateTimeEntry(data: ITimeEntryFormData): IValidationResult {
  const errors: string[] = [];

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
    const [startH, startM] = data.startTime.split(":").map(Number);
    const [endH, endM] = data.endTime.split(":").map(Number);
    const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM) - data.breakMinutes;
    if (totalMinutes > 1440) {
      errors.push("Total hours cannot exceed 24 hours.");
    }
    if (totalMinutes <= 0) {
      errors.push("Working time must be greater than 0 after subtracting breaks.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a project form.
 */
export function validateProject(data: {
  title: string;
  projectCode: string;
}): IValidationResult {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push("Project name is required.");
  }

  if (!data.projectCode || data.projectCode.trim().length === 0) {
    errors.push("Project code is required.");
  }

  if (data.projectCode && !/^[A-Za-z0-9-]+$/.test(data.projectCode)) {
    errors.push("Project code can only contain letters, numbers, and hyphens.");
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate a leave request form.
 */
export function validateLeaveRequest(data: {
  startDate: Date | null;
  endDate: Date | null;
  leaveType: string;
}): IValidationResult {
  const errors: string[] = [];

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

  return { isValid: errors.length === 0, errors };
}
