import { SPFI } from "@pnp/sp";
import { IConfigurationItem, IAppConfiguration, DEFAULT_CONFIG } from "../models/IConfiguration";
import { LIST_NAMES } from "../utils/constants";

export class ConfigurationService {
  private sp: SPFI;

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  /**
   * Load all configuration items and parse them into IAppConfiguration.
   */
  public async load(): Promise<IAppConfiguration> {
    try {
      const items: IConfigurationItem[] = await this.sp.web.lists
        .getByTitle(LIST_NAMES.CONFIGURATION)
        .items.select("Id", "Title", "SettingValue", "SettingCategory", "Description")
        .top(50)();

      const config: IAppConfiguration = { ...DEFAULT_CONFIG };
      const configMap = new Map(items.map((i) => [i.Title, i.SettingValue]));

      if (configMap.has("OvertimeDailyThreshold")) {
        config.overtimeDailyThreshold = Number(configMap.get("OvertimeDailyThreshold"));
      }
      if (configMap.has("OvertimeWeeklyThreshold")) {
        config.overtimeWeeklyThreshold = Number(configMap.get("OvertimeWeeklyThreshold"));
      }
      if (configMap.has("SubmissionPeriod")) {
        config.submissionPeriod = configMap.get("SubmissionPeriod") as "Weekly" | "BiWeekly";
      }
      if (configMap.has("WorkingDaysPerWeek")) {
        config.workingDaysPerWeek = Number(configMap.get("WorkingDaysPerWeek"));
      }
      if (configMap.has("DefaultBreakMinutes")) {
        config.defaultBreakMinutes = Number(configMap.get("DefaultBreakMinutes"));
      }
      if (configMap.has("LeaveBalances")) {
        try {
          config.leaveBalances = JSON.parse(configMap.get("LeaveBalances")!);
        } catch {
          // Keep defaults
        }
      }
      if (configMap.has("RegularHolidayRate")) {
        config.regularHolidayRate = Number(configMap.get("RegularHolidayRate"));
      }
      if (configMap.has("SpecialHolidayRate")) {
        config.specialHolidayRate = Number(configMap.get("SpecialHolidayRate"));
      }
      if (configMap.has("NotificationEmail")) {
        config.notificationEmail = configMap.get("NotificationEmail") || "";
      }
      if (configMap.has("CeoEmail")) {
        config.ceoEmail = configMap.get("CeoEmail") || "";
      }
      if (configMap.has("BookkeeperEmails")) {
        config.bookkeeperEmails = configMap.get("BookkeeperEmails") || "";
      }

      return config;
    } catch {
      // List may not exist yet, return defaults
      return { ...DEFAULT_CONFIG };
    }
  }

  /**
   * Save a single configuration setting.
   */
  public async saveSetting(key: string, value: string, category: string): Promise<void> {
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.CONFIGURATION)
      .items.filter(`Title eq '${key}'`)
      .select("Id")
      .top(1)();

    if (items.length > 0) {
      await this.sp.web.lists
        .getByTitle(LIST_NAMES.CONFIGURATION)
        .items.getById(items[0].Id)
        .update({ SettingValue: value });
    } else {
      await this.sp.web.lists
        .getByTitle(LIST_NAMES.CONFIGURATION)
        .items.add({
          Title: key,
          SettingValue: value,
          SettingCategory: category,
        });
    }
  }

  /**
   * Save multiple configuration settings at once.
   */
  public async saveAll(config: IAppConfiguration): Promise<void> {
    await this.saveSetting("OvertimeDailyThreshold", String(config.overtimeDailyThreshold), "Overtime");
    await this.saveSetting("OvertimeWeeklyThreshold", String(config.overtimeWeeklyThreshold), "Overtime");
    await this.saveSetting("SubmissionPeriod", config.submissionPeriod, "Workflow");
    await this.saveSetting("WorkingDaysPerWeek", String(config.workingDaysPerWeek), "General");
    await this.saveSetting("DefaultBreakMinutes", String(config.defaultBreakMinutes), "General");
    await this.saveSetting("LeaveBalances", JSON.stringify(config.leaveBalances), "Leave");
    await this.saveSetting("RegularHolidayRate", String(config.regularHolidayRate), "Holiday");
    await this.saveSetting("SpecialHolidayRate", String(config.specialHolidayRate), "Holiday");
    await this.saveSetting("NotificationEmail", config.notificationEmail, "Workflow");
    await this.saveSetting("CeoEmail", config.ceoEmail, "Workflow");
    await this.saveSetting("BookkeeperEmails", config.bookkeeperEmails, "Workflow");
  }
}
