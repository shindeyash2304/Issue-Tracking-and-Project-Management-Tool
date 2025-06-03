import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { paths } from "@/types/api";
import { QueryKeyFactory } from "@/lib/tanstack-query/query-key-factory";

export const useCreateProjectMutation = () => {
  type path = paths["/projects"]["post"];
  type ResponseType = Required<path["responses"]["200"]["content"]["*/*"]>;
  type RequestType = FormData

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data: FormData) => {
      toast.loading("Creating project...", { id: "create-project" });
      const response = await fetch("/api/projects", {
        method: "POST",
        credentials: "include",
        body: data,
      })
      if (!response.ok) {
        throw new Error("Failed to create project")
      }
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Project created successfully", { id: "create-project" });
    },
    onError: () => {
      toast.error("Failed to create project", { id: "create-project" });
    },
    onSettled: (data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Projects.byWorkspaceId(vars.get("workspaceId") as string) });
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Projects.byProjectId(data?.id ?? "") });
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(vars.get("workspaceId") as string) })
    }
  })
}

export const useEditProjectMutation = (workspaceId: string, projectId: string) => {
  type path = paths["/projects/{projectId}"]["patch"];
  type ResponseType = path["responses"]["200"]["content"]["*/*"];
  type RequestType = FormData

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data: FormData) => {
      toast.loading("Updating project...", { id: "update-project" });
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        credentials: 'include',
        body: data
      });

      if (!response.ok) {
        throw new Error("Project updated successfully");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Project updated successfully", { id: "update-project" });
    },
    onError: () => {
      toast.error("Failed to update project", { id: "update-project" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(workspaceId) });
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Tasks.byWorkspaceId(workspaceId) });
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Projects.byProjectId(projectId) });
    }
  });
}

export const useDeleteProjectMutation = (projectId: string) => {
  type path = paths["/projects/{projectId}"]["delete"];
  type ResponseType = path["responses"]["200"]["content"];
  type RequestType = path["requestBody"];

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      toast.loading("Deleting project...", { id: "delete-project" });
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
    },
    onSuccess: () => {
      toast.success("Deleted project successfully", { id: "delete-project" });
    },
    onError: () => {
      toast.error("Failed to delete project", { id: "delete-project" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Projects.byProjectId(projectId) });
    }
  })
}
