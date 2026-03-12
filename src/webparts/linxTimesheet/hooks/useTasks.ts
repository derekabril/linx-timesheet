import { useState, useEffect, useCallback, useMemo } from "react";
import { getSP } from "../services/PnPConfig";
import { TaskService } from "../services/TaskService";
import { ITask, ITaskCreate } from "../models/ITask";

export const useTasks = (projectId: number | null, activeOnly: boolean = true) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sp = getSP();
  const service = useMemo(() => new TaskService(sp), [sp]);

  const refresh = useCallback(async () => {
    if (!projectId) {
      setTasks([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await service.getByProject(projectId, activeOnly);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId, activeOnly]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (task: ITaskCreate): Promise<ITask> => {
    const result = await service.create(task);
    await refresh();
    return result;
  }, [service, refresh]);

  const update = useCallback(async (id: number, updates: Partial<ITask>): Promise<void> => {
    await service.update(id, updates);
    await refresh();
  }, [service, refresh]);

  const archive = useCallback(async (id: number): Promise<void> => {
    await service.archive(id);
    await refresh();
  }, [service, refresh]);

  return { tasks, loading, error, refresh, create, update, archive };
};
