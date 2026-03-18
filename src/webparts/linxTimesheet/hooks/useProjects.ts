import { useState, useEffect, useCallback, useMemo } from "react";
import { getSP } from "../services/PnPConfig";
import { ProjectService } from "../services/ProjectService";
import { IProject, IProjectCreate } from "../models/IProject";

interface UseProjectsOptions {
  activeOnly?: boolean;
  /** When set, only returns projects where this user is a team member or project manager. */
  teamMemberUserId?: number | null;
}

export const useProjects = (
  activeOnlyOrOptions: boolean | UseProjectsOptions = true
) => {
  const options: UseProjectsOptions =
    typeof activeOnlyOrOptions === "boolean"
      ? { activeOnly: activeOnlyOrOptions }
      : activeOnlyOrOptions;

  const activeOnly = options.activeOnly ?? true;
  const teamMemberUserId = options.teamMemberUserId ?? null;

  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sp = getSP();
  const service = useMemo(() => new ProjectService(sp), [sp]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data =
        teamMemberUserId != null
          ? await service.getByTeamMember(teamMemberUserId, activeOnly)
          : await service.getAll(activeOnly);
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [activeOnly, teamMemberUserId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (project: IProjectCreate): Promise<IProject> => {
    const result = await service.create(project);
    await refresh();
    return result;
  }, [service, refresh]);

  const update = useCallback(async (id: number, updates: Partial<IProject>): Promise<void> => {
    await service.update(id, updates);
    await refresh();
  }, [service, refresh]);

  const archive = useCallback(async (id: number): Promise<void> => {
    await service.archive(id);
    await refresh();
  }, [service, refresh]);

  return { projects, loading, error, refresh, create, update, archive };
};
