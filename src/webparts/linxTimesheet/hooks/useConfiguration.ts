import { useCallback, useState, useMemo } from "react";
import { getSP } from "../services/PnPConfig";
import { ConfigurationService } from "../services/ConfigurationService";
import { IAppConfiguration } from "../models/IConfiguration";
import { useAppContext } from "../context/AppContext";

export const useConfiguration = () => {
  const { configuration, refreshConfig } = useAppContext();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sp = getSP();
  const service = useMemo(() => new ConfigurationService(sp), [sp]);

  const saveConfiguration = useCallback(
    async (config: IAppConfiguration): Promise<void> => {
      setSaving(true);
      setError(null);
      try {
        await service.saveAll(config);
        await refreshConfig();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save configuration");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [service, refreshConfig]
  );

  return { configuration, saving, error, saveConfiguration };
};
