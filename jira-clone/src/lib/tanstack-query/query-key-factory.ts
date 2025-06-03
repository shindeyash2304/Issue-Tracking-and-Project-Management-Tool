import { TaskStatus } from "@/features/tasks/schema";

export namespace QueryKeyFactory {
  export namespace User {
    const userPrefix = "user";
    export const profile = () => [userPrefix, "profile"]
  }

  export namespace Workspace {
    const workspacePrefix = "workspace"
    export const all = () => [workspacePrefix];
    export const byId = (id: string) => [workspacePrefix, id];
    export const byIdForName = (id: string) => [workspacePrefix, id, "name"];
  }

  export namespace Members {
    const membersPrefix = "members";
    export const byWorkspaceId = (workspaceId: string) => [membersPrefix, workspaceId];
  }

  export namespace Projects {
    const projectsPrefix = "projects";
    export const byWorkspaceId = (workspaceId: string) => [projectsPrefix, workspaceId];
    export const byProjectId = (projectId: string) => [projectsPrefix, projectId];
  }

  export namespace Tasks {
    export const taskPrefix = "tasks";
    export const byWorkspaceId = (workspaceId: string) => [taskPrefix, workspaceId];
    export const byFilters = (workspaceId: string, projectId?: string, assigneeId?: string, dueDate?: string, status?: TaskStatus, search?: string | null) => [
      taskPrefix,
      workspaceId ?? null,
      projectId ?? null,
      assigneeId ?? null,
      dueDate ?? null,
      status ?? null,
      search ?? null
    ];
    export const byTaskId = (taskId: string) => [taskPrefix, taskId];
  }
}
