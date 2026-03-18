import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IAppContext } from "./types";
import { IAppConfiguration, DEFAULT_CONFIG } from "../models/IConfiguration";
import { IUser } from "../models/IUser";
import { IHoliday } from "../models/IHoliday";
import { getSP } from "../services/PnPConfig";
import { UserService } from "../services/UserService";
import { ConfigurationService } from "../services/ConfigurationService";
import { HolidayService } from "../services/HolidayService";
import { ListProvisioningService } from "../services/ListProvisioningService";

const defaultAppContext: IAppContext = {
  currentUser: null,
  isManager: false,
  isAdmin: false,
  isSiteOwner: false,
  configuration: DEFAULT_CONFIG,
  holidays: [],
  isLoading: true,
  error: null,
  refreshConfig: async () => {},
  refreshHolidays: async () => {},
};

export const AppContext = React.createContext<IAppContext>(defaultAppContext);

export const useAppContext = (): IAppContext => React.useContext(AppContext);

interface IAppProviderProps {
  context: WebPartContext;
  children: React.ReactNode;
}

export const AppProvider: React.FC<IAppProviderProps> = ({ context, children }) => {
  const [currentUser, setCurrentUser] = React.useState<IUser | null>(null);
  const [isManager, setIsManager] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isSiteOwner, setIsSiteOwner] = React.useState(false);
  const [configuration, setConfiguration] = React.useState<IAppConfiguration>(DEFAULT_CONFIG);
  const [holidays, setHolidays] = React.useState<IHoliday[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const sp = getSP();
  const userService = React.useMemo(() => new UserService(sp), [sp]);
  const configService = React.useMemo(() => new ConfigurationService(sp), [sp]);
  const holidayService = React.useMemo(() => new HolidayService(sp), [sp]);

  const refreshConfig = React.useCallback(async () => {
    const config = await configService.load();
    setConfiguration(config);
  }, [configService]);

  const refreshHolidays = React.useCallback(async () => {
    const year = new Date().getFullYear();
    const h = await holidayService.getByYear(year);
    setHolidays(h);
  }, [holidayService]);

  React.useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        setIsLoading(true);

        // Provision lists on first load
        const provisioner = new ListProvisioningService(sp);
        await provisioner.ensureAllLists();

        // Load user, config, holidays in parallel
        const [user, manager, siteOwner, config, yearHolidays] = await Promise.all([
          userService.getCurrentUser(),
          userService.isManager(),
          userService.isSiteOwner(),
          configService.load(),
          holidayService.getByYear(new Date().getFullYear()),
        ]);

        setCurrentUser(user);
        setIsManager(manager);
        setIsAdmin(user.isSiteAdmin);
        setIsSiteOwner(siteOwner);
        setConfiguration(config);
        setHolidays(yearHolidays);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize app.");
        console.error("AppContext init error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const value: IAppContext = {
    currentUser,
    isManager,
    isAdmin,
    isSiteOwner,
    configuration,
    holidays,
    isLoading,
    error,
    refreshConfig,
    refreshHolidays,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
