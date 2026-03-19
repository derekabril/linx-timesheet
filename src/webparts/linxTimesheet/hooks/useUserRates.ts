import { useState, useEffect, useCallback, useMemo } from "react";
import { IUserRate, IUserRateCreate } from "../models/IUserRate";
import { UserRateService } from "../services/UserRateService";
import { getSP } from "../services/PnPConfig";

export const useUserRates = () => {
  const service = useMemo(() => new UserRateService(getSP()), []);
  const [rates, setRates] = useState<IUserRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.getAll();
      setRates(data);
    } catch (e) {
      setError(`Failed to load user rates: ${e}`);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  const create = useCallback(async (data: IUserRateCreate) => {
    await service.create(data);
    await refresh();
  }, [service, refresh]);

  const update = useCallback(async (id: number, updates: Partial<IUserRateCreate>) => {
    await service.update(id, updates);
    await refresh();
  }, [service, refresh]);

  const remove = useCallback(async (id: number) => {
    await service.delete(id);
    await refresh();
  }, [service, refresh]);

  const getRateForUser = useCallback(
    (userId: number): number => {
      const rate = rates.find((r) => r.EmployeeId === userId);
      return rate?.HourlyRate ?? 0;
    },
    [rates]
  );

  const getMaxHoursForUser = useCallback(
    (userId: number): number => {
      const rate = rates.find((r) => r.EmployeeId === userId);
      return rate?.MaxHoursPerDay ?? 0;
    },
    [rates]
  );

  const getContractTypeForUser = useCallback(
    (userId: number): string => {
      const rate = rates.find((r) => r.EmployeeId === userId);
      return rate?.ContractType ?? "Regular";
    },
    [rates]
  );

  return { rates, loading, error, refresh, create, update, remove, getRateForUser, getMaxHoursForUser, getContractTypeForUser };
};
