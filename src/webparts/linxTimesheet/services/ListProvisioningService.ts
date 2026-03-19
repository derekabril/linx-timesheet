import { SPFI } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/views";
import { LIST_NAMES } from "../utils/constants";
import { DEFAULT_CONFIG } from "../models/IConfiguration";

interface IFieldDef {
  name: string;
  type: "Text" | "Note" | "Number" | "DateTime" | "Boolean" | "Choice" | "Currency" | "User" | "UserMulti";
  required?: boolean;
  indexed?: boolean;
  choices?: string[];
  dateOnly?: boolean;
}

interface ILookupFieldDef {
  sourceList: string;
  fieldName: string;
  lookupList: string;
  lookupField: string;
  indexed?: boolean;
}

/**
 * Provisions all SharePoint lists required by Keystone Pulse.
 * Called on first load; safely skips lists that already exist.
 */
export class ListProvisioningService {
  private sp: SPFI;

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  /**
   * Quick check: if the Configuration list already has items, all lists
   * were provisioned in a prior session — skip the expensive field-by-field
   * checks entirely.
   */
  public async isAlreadyProvisioned(): Promise<boolean> {
    try {
      const items = await this.sp.web.lists
        .getByTitle(LIST_NAMES.CONFIGURATION)
        .items.top(1)();
      return items.length > 0;
    } catch {
      return false;
    }
  }

  public async ensureAllLists(): Promise<void> {
    // Skip full provisioning if lists already exist and are seeded
    if (await this.isAlreadyProvisioned()) {
      // Always run migrations to add new fields to existing lists
      await this.ensureMigrations();
      return;
    }

    await Promise.all([
      this.ensureList(LIST_NAMES.TIME_ENTRIES, this.timeEntriesFields()),
      this.ensureList(LIST_NAMES.PROJECTS, this.projectsFields()),
      this.ensureList(LIST_NAMES.TASKS, this.tasksFields()),
      this.ensureList(LIST_NAMES.LEAVE_REQUESTS, this.leaveRequestsFields()),
      this.ensureList(LIST_NAMES.SUBMISSIONS, this.submissionsFields()),
      this.ensureList(LIST_NAMES.AUDIT_LOG, this.auditLogFields()),
      this.ensureList(LIST_NAMES.CONFIGURATION, this.configurationFields()),
      this.ensureList(LIST_NAMES.HOLIDAYS, this.holidaysFields()),
      this.ensureList(LIST_NAMES.USER_RATES, this.userRatesFields()),
      this.ensureList(LIST_NAMES.INCENTIVES, this.incentivesFields()),
      this.ensureList(LIST_NAMES.INCENTIVE_ASSIGNMENTS, this.incentiveAssignmentsFields()),
    ]);

    // Create lookup fields after all lists exist
    await this.ensureLookupFields();

    await this.seedDefaultConfiguration();
    await this.seedDefaultIncentives();
  }

  /**
   * Add fields introduced after initial provisioning.
   * Each migration checks if the field already exists before creating it.
   */
  private async ensureMigrations(): Promise<void> {
    const projectsList = this.sp.web.lists.getByTitle(LIST_NAMES.PROJECTS);
    const holidaysList = this.sp.web.lists.getByTitle(LIST_NAMES.HOLIDAYS);

    // Run independent list ensures and field additions in parallel
    await Promise.all([
      // Projects fields
      this.addField(projectsList, { name: "TeamMembers", type: "UserMulti" }),
      this.addField(projectsList, { name: "Division", type: "Text", indexed: true }),
      this.addField(projectsList, { name: "Area", type: "Text", indexed: true }),
      // UserRates list + fields
      this.ensureList(LIST_NAMES.USER_RATES, this.userRatesFields()),
      // Holidays field
      this.addField(holidaysList, { name: "Category", type: "Choice", choices: ["Regular", "Special"] }),
      // Incentive lists
      this.ensureList(LIST_NAMES.INCENTIVES, this.incentivesFields()),
      this.ensureList(LIST_NAMES.INCENTIVE_ASSIGNMENTS, this.incentiveAssignmentsFields()),
    ]);

    // Fields that depend on lists existing above
    const userRatesList = this.sp.web.lists.getByTitle(LIST_NAMES.USER_RATES);
    const submissionsList = this.sp.web.lists.getByTitle(LIST_NAMES.SUBMISSIONS);
    const timeEntriesList = this.sp.web.lists.getByTitle(LIST_NAMES.TIME_ENTRIES);
    await Promise.all([
      this.addField(userRatesList, { name: "MaxHoursPerDay", type: "Number" }),
      this.addField(userRatesList, { name: "ContractType", type: "Choice", choices: ["Regular", "Contractual"] }),
      this.addLookupField({
        sourceList: LIST_NAMES.INCENTIVE_ASSIGNMENTS,
        fieldName: "Incentive",
        lookupList: LIST_NAMES.INCENTIVES,
        lookupField: "Title",
        indexed: true,
      }),
      this.seedDefaultIncentives(),
      // Scalability indexes for existing deployments
      this.ensureFieldIndexed(submissionsList, "SubmittedDate"),
      this.ensureFieldIndexed(submissionsList, "ApprovedDate"),
      this.ensureFieldIndexed(timeEntriesList, "Submission"),
    ]);
  }

  private async ensureList(title: string, fields: IFieldDef[]): Promise<void> {
    try {
      // Check if the list exists
      await this.sp.web.lists.getByTitle(title)();
    } catch {
      // List doesn't exist, create it (100 = GenericList template)
      await this.sp.web.lists.add(title, `Keystone Pulse - ${title}`, 100, false);
    }

    // Always ensure all fields exist (addField silently skips existing ones)
    const list = this.sp.web.lists.getByTitle(title);
    for (const field of fields) {
      await this.addField(list, field);
    }
  }

  private async addField(list: ReturnType<typeof this.sp.web.lists.getByTitle>, field: IFieldDef): Promise<void> {
    try {
      // Check if the field already exists — skip if so
      try {
        await list.fields.getByInternalNameOrTitle(field.name)();
        return; // Field exists, nothing to do
      } catch {
        // Field doesn't exist, proceed to create it
      }

      switch (field.type) {
        case "Text":
          await list.fields.addText(field.name, { MaxLength: 255 });
          break;
        case "Note":
          await list.fields.addMultilineText(field.name, {
            NumberOfLines: 6,
            RichText: false,
          });
          break;
        case "Number":
          await list.fields.addNumber(field.name, { MinimumValue: undefined, MaximumValue: undefined });
          break;
        case "Currency":
          await list.fields.addCurrency(field.name, {
            MinimumValue: 0,
            MaximumValue: undefined,
            CurrencyLocaleId: 1033,
          });
          break;
        case "DateTime":
          await list.fields.addDateTime(field.name, {
            DisplayFormat: field.dateOnly ? 1 : 0, // 1 = DateOnly, 0 = DateTime
          });
          break;
        case "Boolean":
          await list.fields.addBoolean(field.name);
          break;
        case "Choice":
          await list.fields.addChoice(field.name, {
            Choices: field.choices || [],
          });
          break;
        case "User":
          await list.fields.addUser(field.name, { SelectionMode: 0 }); // 0 = PeopleOnly
          break;
        case "UserMulti":
          await list.fields.addUser(field.name, { SelectionMode: 0 });
          // Enable multi-value after creation
          await list.fields.getByInternalNameOrTitle(field.name).update({
            AllowMultipleValues: true,
          });
          break;
      }

      // Set indexed if needed
      if (field.indexed) {
        const f = list.fields.getByInternalNameOrTitle(field.name);
        await f.update({ Indexed: true });
      }
    } catch (e) {
      console.warn(`Failed to add field ${field.name}: ${e}`);
    }
  }

  private lookupFieldDefs(): ILookupFieldDef[] {
    return [
      { sourceList: LIST_NAMES.TIME_ENTRIES, fieldName: "Project", lookupList: LIST_NAMES.PROJECTS, lookupField: "Title", indexed: true },
      { sourceList: LIST_NAMES.TIME_ENTRIES, fieldName: "Task", lookupList: LIST_NAMES.TASKS, lookupField: "Title" },
      { sourceList: LIST_NAMES.TIME_ENTRIES, fieldName: "Submission", lookupList: LIST_NAMES.SUBMISSIONS, lookupField: "Title", indexed: true },
      { sourceList: LIST_NAMES.TASKS, fieldName: "Project", lookupList: LIST_NAMES.PROJECTS, lookupField: "Title" },
      { sourceList: LIST_NAMES.INCENTIVE_ASSIGNMENTS, fieldName: "Incentive", lookupList: LIST_NAMES.INCENTIVES, lookupField: "Title", indexed: true },
    ];
  }

  private async ensureLookupFields(): Promise<void> {
    for (const def of this.lookupFieldDefs()) {
      await this.addLookupField(def);
    }
  }

  private async addLookupField(def: ILookupFieldDef): Promise<void> {
    try {
      const sourceList = this.sp.web.lists.getByTitle(def.sourceList);

      // Check if the field already exists
      try {
        await sourceList.fields.getByInternalNameOrTitle(def.fieldName)();
        return; // Already exists
      } catch {
        // Doesn't exist, create it
      }

      // Get the lookup target list ID
      const lookupListInfo = await this.sp.web.lists.getByTitle(def.lookupList).select("Id")();
      const lookupListId = lookupListInfo.Id;

      await sourceList.fields.addLookup(def.fieldName, {
        LookupListId: lookupListId,
        LookupFieldName: def.lookupField,
      });

      if (def.indexed) {
        const f = sourceList.fields.getByInternalNameOrTitle(def.fieldName);
        await f.update({ Indexed: true });
      }
    } catch (e) {
      console.warn(`Failed to add lookup field ${def.fieldName} on ${def.sourceList}: ${e}`);
    }
  }

  /**
   * Ensure an existing field is indexed. Safe to call if already indexed.
   */
  private async ensureFieldIndexed(
    list: ReturnType<typeof this.sp.web.lists.getByTitle>,
    fieldName: string
  ): Promise<void> {
    try {
      const field = list.fields.getByInternalNameOrTitle(fieldName);
      const info = await field.select("Indexed")();
      if (!info.Indexed) {
        await field.update({ Indexed: true });
      }
    } catch (e) {
      console.warn(`Failed to ensure index on ${fieldName}: ${e}`);
    }
  }

  private async seedDefaultConfiguration(): Promise<void> {
    try {
      const items = await this.sp.web.lists
        .getByTitle(LIST_NAMES.CONFIGURATION)
        .items.top(1)();

      if (items.length > 0) return; // Already seeded

      const list = this.sp.web.lists.getByTitle(LIST_NAMES.CONFIGURATION);
      const defaults: Array<{ Title: string; SettingValue: string; SettingCategory: string }> = [
        { Title: "OvertimeDailyThreshold", SettingValue: String(DEFAULT_CONFIG.overtimeDailyThreshold), SettingCategory: "Overtime" },
        { Title: "OvertimeWeeklyThreshold", SettingValue: String(DEFAULT_CONFIG.overtimeWeeklyThreshold), SettingCategory: "Overtime" },
        { Title: "SubmissionPeriod", SettingValue: DEFAULT_CONFIG.submissionPeriod, SettingCategory: "Workflow" },
        { Title: "WorkingDaysPerWeek", SettingValue: String(DEFAULT_CONFIG.workingDaysPerWeek), SettingCategory: "General" },
        { Title: "DefaultBreakMinutes", SettingValue: String(DEFAULT_CONFIG.defaultBreakMinutes), SettingCategory: "General" },
        { Title: "LeaveBalances", SettingValue: JSON.stringify(DEFAULT_CONFIG.leaveBalances), SettingCategory: "Leave" },
      ];

      for (const item of defaults) {
        await list.items.add(item);
      }
    } catch (e) {
      console.warn("Failed to seed default configuration:", e);
    }
  }

  // ── Field definitions ────────────────────────────────────────────────

  private timeEntriesFields(): IFieldDef[] {
    return [
      { name: "Employee", type: "User", indexed: true },
      { name: "EntryDate", type: "DateTime", dateOnly: true, indexed: true },
      { name: "ClockIn", type: "DateTime" },
      { name: "ClockOut", type: "DateTime" },
      { name: "BreakMinutes", type: "Number" },
      { name: "TotalHours", type: "Number" },
      { name: "EntryType", type: "Choice", indexed: true, choices: ["Clock", "Manual", "Timer"] },
      { name: "Notes", type: "Note" },
      { name: "Status", type: "Choice", indexed: true, choices: ["Active", "Completed", "Voided"] },
      { name: "IsOvertime", type: "Boolean" },
      { name: "OvertimeHours", type: "Number" },
      { name: "WeekNumber", type: "Number", indexed: true },
      { name: "Year", type: "Number", indexed: true },
    ];
  }

  private projectsFields(): IFieldDef[] {
    return [
      { name: "ProjectCode", type: "Text", indexed: true },
      { name: "Division", type: "Text", indexed: true },
      { name: "Area", type: "Text", indexed: true },
      { name: "Client", type: "Text", indexed: true },
      { name: "Description", type: "Note" },
      { name: "ProjectManager", type: "User" },
      { name: "TeamMembers", type: "UserMulti" },
      { name: "PlannedHours", type: "Number" },
      { name: "ActualHours", type: "Number" },
      { name: "StartDate", type: "DateTime", dateOnly: true },
      { name: "EndDate", type: "DateTime", dateOnly: true },
      { name: "IsActive", type: "Boolean", indexed: true },
      { name: "HourlyRate", type: "Currency" },
    ];
  }

  private tasksFields(): IFieldDef[] {
    return [
      { name: "TaskCode", type: "Text" },
      { name: "PlannedHours", type: "Number" },
      { name: "IsActive", type: "Boolean" },
    ];
  }

  private leaveRequestsFields(): IFieldDef[] {
    return [
      { name: "Employee", type: "User", indexed: true },
      { name: "LeaveType", type: "Choice", indexed: true, choices: ["Vacation", "Sick", "Personal", "Bereavement", "Other"] },
      { name: "StartDate", type: "DateTime", dateOnly: true, indexed: true },
      { name: "EndDate", type: "DateTime", dateOnly: true },
      { name: "TotalDays", type: "Number" },
      { name: "Status", type: "Choice", indexed: true, choices: ["Draft", "Submitted", "Approved", "Rejected", "Cancelled"] },
      { name: "Approver", type: "User", indexed: true },
      { name: "ApproverComments", type: "Note" },
      { name: "RequestDate", type: "DateTime" },
      { name: "Year", type: "Number", indexed: true },
    ];
  }

  private submissionsFields(): IFieldDef[] {
    return [
      { name: "Employee", type: "User", indexed: true },
      { name: "PeriodStart", type: "DateTime", dateOnly: true, indexed: true },
      { name: "PeriodEnd", type: "DateTime", dateOnly: true },
      { name: "TotalHours", type: "Number" },
      { name: "OvertimeHours", type: "Number" },
      { name: "RegularHours", type: "Number" },
      { name: "Status", type: "Choice", indexed: true, choices: ["Draft", "Submitted", "Approved", "Rejected", "Processed", "Cancelled"] },
      { name: "Approver", type: "User", indexed: true },
      { name: "SubmittedDate", type: "DateTime", indexed: true },
      { name: "ApprovedDate", type: "DateTime", indexed: true },
      { name: "ApproverComments", type: "Note" },
      { name: "WeekNumber", type: "Number", indexed: true },
      { name: "Year", type: "Number", indexed: true },
    ];
  }

  private auditLogFields(): IFieldDef[] {
    return [
      { name: "Action", type: "Choice", indexed: true, choices: ["Create", "Update", "Delete", "Submit", "Approve", "Reject", "ClockIn", "ClockOut"] },
      { name: "TargetList", type: "Text", indexed: true },
      { name: "TargetItemId", type: "Number", indexed: true },
      { name: "PerformedBy", type: "User", indexed: true },
      { name: "ActionDate", type: "DateTime", indexed: true },
      { name: "PreviousValue", type: "Note" },
      { name: "NewValue", type: "Note" },
      { name: "Year", type: "Number", indexed: true },
    ];
  }

  private configurationFields(): IFieldDef[] {
    return [
      { name: "SettingValue", type: "Note" },
      { name: "SettingCategory", type: "Choice", choices: ["Overtime", "Leave", "General", "Workflow"] },
      { name: "Description", type: "Note" },
    ];
  }

  private holidaysFields(): IFieldDef[] {
    return [
      { name: "HolidayDate", type: "DateTime", dateOnly: true, indexed: true },
      { name: "Year", type: "Number", indexed: true },
      { name: "IsRecurring", type: "Boolean" },
      { name: "Category", type: "Choice", choices: ["Regular", "Special"] },
    ];
  }

  private userRatesFields(): IFieldDef[] {
    return [
      { name: "Employee", type: "User", indexed: true },
      { name: "HourlyRate", type: "Currency" },
      { name: "MaxHoursPerDay", type: "Number" },
      { name: "ContractType", type: "Choice", choices: ["Regular", "Contractual"] },
    ];
  }

  private incentivesFields(): IFieldDef[] {
    return [
      { name: "Frequency", type: "Choice", indexed: true, choices: ["Daily", "Weekly", "Monthly"] },
      { name: "Value", type: "Currency" },
      { name: "IncentiveType", type: "Choice", indexed: true, choices: ["Individual", "Team", "Company"] },
      { name: "IsActive", type: "Boolean" },
    ];
  }

  private incentiveAssignmentsFields(): IFieldDef[] {
    return [
      { name: "Employee", type: "User", indexed: true },
      // Incentive lookup is added in ensureLookupFields
    ];
  }

  private async seedDefaultIncentives(): Promise<void> {
    try {
      const items = await this.sp.web.lists
        .getByTitle(LIST_NAMES.INCENTIVES)
        .items.top(1)();

      if (items.length > 0) return; // Already seeded

      const list = this.sp.web.lists.getByTitle(LIST_NAMES.INCENTIVES);
      const defaults = [
        { Title: "Individual Task Completion (8K)", Frequency: "Daily", Value: 8, IncentiveType: "Individual", IsActive: true },
        { Title: "Individual Task Completion (3JR)", Frequency: "Daily", Value: 3, IncentiveType: "Individual", IsActive: true },
        { Title: "Team Task Completion", Frequency: "Daily", Value: 2, IncentiveType: "Team", IsActive: true },
        { Title: "Team Task Completion", Frequency: "Daily", Value: 5, IncentiveType: "Team", IsActive: true },
        { Title: "Standardized Documents (#)", Frequency: "Daily", Value: 2, IncentiveType: "Team", IsActive: true },
        { Title: "Sits Kept (#)", Frequency: "Daily", Value: 2, IncentiveType: "Team", IsActive: true },
        { Title: "Analysis Kept (#)", Frequency: "Daily", Value: 10, IncentiveType: "Team", IsActive: true },
        { Title: "Weekly Analysis's (>5=$50)", Frequency: "Weekly", Value: 50, IncentiveType: "Team", IsActive: true },
        { Title: "New Clients Signed (#)", Frequency: "Daily", Value: 100, IncentiveType: "Team", IsActive: true },
        { Title: "$60K/Month Cash Collect (Y/N)", Frequency: "Monthly", Value: 500, IncentiveType: "Company", IsActive: true },
        { Title: "LINX QBO Daily Accurate & Completed", Frequency: "Daily", Value: 2, IncentiveType: "Individual", IsActive: true },
        { Title: "LINX Liquidity Lens Accurate & Delivered", Frequency: "Weekly", Value: 2, IncentiveType: "Individual", IsActive: true },
        { Title: "All Client QBO Accurate & Complete", Frequency: "Daily", Value: 4, IncentiveType: "Team", IsActive: true },
        { Title: "All Client Liquidity Lens Accurate & Complete", Frequency: "Weekly", Value: 2, IncentiveType: "Team", IsActive: true },
      ];

      for (const item of defaults) {
        await list.items.add(item);
      }
    } catch (e) {
      console.warn("Failed to seed default incentives:", e);
    }
  }
}
