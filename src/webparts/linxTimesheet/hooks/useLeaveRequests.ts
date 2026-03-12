import { useState, useEffect, useCallback, useMemo } from "react";
import { getSP } from "../services/PnPConfig";
import { LeaveService } from "../services/LeaveService";
import { AuditService } from "../services/AuditService";
import { ILeaveRequest, ILeaveRequestCreate } from "../models/ILeaveRequest";
import { AuditAction } from "../models/enums";
import { LIST_NAMES } from "../utils/constants";

export const useLeaveRequests = (employeeId: number | null, year: number) => {
  const [requests, setRequests] = useState<ILeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sp = getSP();
  const service = useMemo(() => new LeaveService(sp), [sp]);
  const auditService = useMemo(() => new AuditService(sp), [sp]);

  const refresh = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await service.getByEmployee(employeeId, year);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  }, [employeeId, year]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (request: ILeaveRequestCreate): Promise<ILeaveRequest> => {
    const result = await service.create(request);
    await auditService.logCreate(LIST_NAMES.LEAVE_REQUESTS, result.Id, request as unknown as Record<string, unknown>);
    await refresh();
    return result;
  }, [service, auditService, refresh]);

  const submit = useCallback(async (id: number): Promise<void> => {
    await service.update(id, { Status: "Submitted" as never });
    await auditService.logStatusChange(AuditAction.Submit, LIST_NAMES.LEAVE_REQUESTS, id, "Draft", "Submitted");
    await refresh();
  }, [service, auditService, refresh]);

  const cancel = useCallback(async (id: number): Promise<void> => {
    await service.cancel(id);
    await refresh();
  }, [service, refresh]);

  return { requests, loading, error, refresh, create, submit, cancel };
};
