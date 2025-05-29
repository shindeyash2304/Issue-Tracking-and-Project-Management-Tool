import { paths } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QueryKeyFactory } from "../query-key-factory";
import { useRouter } from "next/navigation";

export const useCreateProjectMutation = () => {
  type path = paths["/projects"]["post"];
  type ResponseType = Required<path["responses"]["200"]["content"]["*/*"]>;
  type RequestType = FormData

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data: FormData) => {
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
      toast.success("Project created successfully")
    },
    onError: () => {
      toast.error("Failed to create project")
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

  const router = useRouter();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data: FormData) => {
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
      router.refresh();
      toast.success("Project updated successfully");
    },
    onError: () => {
      toast.error("Failed to update project");
    },
    onSettled: () => {

    }
  });
}

export const useDeleteProjectMutation = (projectId: string) => {
  type path = paths["/projects/{projectId}"]["delete"];
  type ResponseType = void
  type RequestType = undefined;

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
    },
    onSuccess: () => {
      toast.success("Deleted project successfully");
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Projects.byProjectId(projectId) })
    }
  })
}
