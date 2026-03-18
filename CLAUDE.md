# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Keystone Pulse is a SharePoint Framework (SPFx) v1.22.1 web part for time tracking, project management, leave management, and reporting. It runs inside SharePoint Online as a client-side web part. Keystone Pulse represents the living rhythm of the organization—tracking hours, effort, and labor cost to give a clearer view of the organization's energy, capacity, and focus.

## Build & Development Commands

- **Build for production:** `npm run build` (runs `heft test --clean --production && heft package-solution --production`)
- **Start dev server:** `npm run start` (serves on https://localhost:4321, opens SharePoint workbench)
- **Run tests:** `npm test` (runs `heft test` using Jest via `@types/heft-jest`)
- **Clean:** `npm run clean`

The build toolchain uses Heft (Rush Stack) with the `@microsoft/spfx-web-build-rig`. TypeScript is compiled via the rig's tsconfig-base. The `.sppkg` package is output to `sharepoint/solution/`.

## Tech Stack

- **SPFx 1.22.1** with React 17, TypeScript ~5.8
- **PnPjs v4** (`@pnp/sp`) for SharePoint REST API calls — initialized as a singleton via `getSP()` in `services/PnPConfig.ts`
- **Fluent UI v8** (`@fluentui/react`) for UI components
- **Fluent UI Charting** (`@fluentui/react-charting`) for report charts
- **ExcelJS / jsPDF** for export functionality
- **Node >= 22.0.0 < 23.0.0** required

## Architecture

All source lives under `src/webparts/linxTimesheet/`. Single web part entry point: `LinxTimesheetWebPart.ts`.

### Key layers:

- **`services/`** — SharePoint data access via PnPjs. Each service class takes an `SPFI` instance. `ListProvisioningService` auto-creates all 8 SharePoint lists on first load.
- **`context/`** — Two React contexts:
  - `AppContext` — current user, permissions (isManager/isAdmin), configuration, holidays. Provisions lists on init.
  - `TimesheetContext` — selected date/week, time entries, active clock entry, current submission.
- **`hooks/`** — Custom hooks wrapping services (useTimeEntries, useProjects, useLeaveRequests, etc.)
- **`components/`** — Organized by feature area: `layout/`, `reporting/`, `projects/`, `admin/`, `leave/`, `approval/`, `common/`
- **`models/`** — TypeScript interfaces and enums for all domain entities
- **`utils/`** — Pure utility functions (date math, hours formatting, overtime/leave calculation, validation, export)

### SharePoint Lists

Defined in `utils/constants.ts` as `LIST_NAMES`. All prefixed with "Linx":
LinxTimeEntries, LinxProjects, LinxTasks, LinxLeaveRequests, LinxTimesheetSubmissions, LinxAuditLog, LinxConfiguration, LinxHolidays

### App Tabs (navigation)

Timesheet, Projects, Leave, Approvals, Reports, Admin — defined in `models/enums.ts` as `AppTab`.

## Configuration

- `config/serve.json` — Dev server targets `linxconsultingoffice.sharepoint.com` workbench
- `config/package-solution.json` — Solution metadata, `skipFeatureDeployment: true` (tenant-scoped)
- `config/config.json` — Bundle entry point and localized resources mapping
