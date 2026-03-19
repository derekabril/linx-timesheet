import { useState, useCallback, useMemo } from "react";
import { getSP } from "../services/PnPConfig";
import { AuditService } from "../services/AuditService";
import { IAuditLogEntry } from "../models/IAuditLogEntry";
import { AuditAction } from "../models/enums";

export const useAuditLog = () => {
  const [entries, setEntries] = useState<IAuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sp = getSP();
  const service = useMemo(() => new AuditService(sp), [sp]);

  const search = useCallback(
    async (filters: {
      year?: number;
      action?: AuditAction;
      targetList?: string;
      performedById?: number;
    }): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const data = await service.getEntries(filters, 200);
        setEntries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load audit log");
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const purge = useCallback(
    async (cutoffDate: Date): Promise<number> => {
      setLoading(true);
      setError(null);
      try {
        const count = await service.purgeOlderThan(cutoffDate);
        return count;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to purge audit log");
        return 0;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  return { entries, loading, error, search, purge };
};
