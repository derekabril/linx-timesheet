import { useState, useEffect, useCallback, useMemo } from "react";
import { IIncentive, IIncentiveCreate, IIncentiveAssignment, IIncentiveAssignmentCreate } from "../models/IIncentive";
import { IncentiveService } from "../services/IncentiveService";
import { getSP } from "../services/PnPConfig";

export const useIncentives = () => {
  const service = useMemo(() => new IncentiveService(getSP()), []);
  const [incentives, setIncentives] = useState<IIncentive[]>([]);
  const [assignments, setAssignments] = useState<IIncentiveAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [incData, assignData] = await Promise.all([
        service.getAll(),
        service.getAssignments(),
      ]);
      setIncentives(incData);
      setAssignments(assignData);
    } catch (e) {
      setError(`Failed to load incentives: ${e}`);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  const create = useCallback(async (data: IIncentiveCreate) => {
    await service.create(data);
    await refresh();
  }, [service, refresh]);

  const update = useCallback(async (id: number, updates: Partial<IIncentiveCreate>) => {
    await service.update(id, updates);
    await refresh();
  }, [service, refresh]);

  const remove = useCallback(async (id: number) => {
    await service.delete(id);
    await refresh();
  }, [service, refresh]);

  const assign = useCallback(async (data: IIncentiveAssignmentCreate) => {
    await service.createAssignment(data);
    await refresh();
  }, [service, refresh]);

  const unassign = useCallback(async (id: number) => {
    await service.deleteAssignment(id);
    await refresh();
  }, [service, refresh]);

  return { incentives, assignments, loading, error, refresh, create, update, remove, assign, unassign };
};
