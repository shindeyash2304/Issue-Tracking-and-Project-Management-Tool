export namespace QueryKeyFactory {
  export namespace User {
    const userPrefix = "user";
    export const userById = (id: string) => [userPrefix, id];


    export function profile() {
      return [userPrefix, "profile"];
    }
  }

  export namespace Workspace {
    const workspacePrefix = "workspace"
    export const all = () => [workspacePrefix, "all"];
    export const byId = (id: string) => [workspacePrefix, id];
  }

  export namespace Members {
    const membersPrefix = "members";
    export const byWorkspaceId = (workspaceId: string) => {
      return [membersPrefix, workspaceId];
    }
    export const byWorkspaceIdAndUserId = (workspaceId: string, userId: string) => {
      return [membersPrefix, workspaceId, userId];
    }
  }

  export namespace Projects {
    const projectsPrefix = "projects";
    export const byWorkspaceId = (workspaceId: string) => [projectsPrefix, workspaceId];
    export const byProjectId = (projectId: string) => [projectsPrefix, projectId];
  }

  export namespace Tasks {
    const taskPrefix = "tasks";
    export const byWorkspaceId = (workspaceId: string) => [taskPrefix, workspaceId]
  }
}
