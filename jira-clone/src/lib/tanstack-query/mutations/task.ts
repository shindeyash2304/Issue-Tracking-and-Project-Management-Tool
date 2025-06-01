import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

import { paths } from "@/types/api";
import { QueryKeyFactory } from "@/lib/tanstack-query/query-key-factory";

export const useCreateTaskMutation = () => {
  type path = paths["/tasks"]["post"];
  type ResponseType = path["responses"]["200"]["content"]["*/*"];
  type RequestType = path["requestBody"]["content"]["application/json"]

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    },
    onSuccess() {
      toast.success("Task created successfully");
    },
    onError: () => {
      toast.error("Failed to create Task");
    },
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyFactory.Tasks.taskPrefix, vars.workspaceId, vars.projectId]
      })
    }
  })
}

export const useDeleteTasMutation = (workspaceId: string, projectId: string) => {
  type path = paths["/tasks/{taskId}"]["delete"];
  type ResponseType = path["responses"]["200"]["content"];
  type RequestType = path["parameters"]["path"];

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ taskId }) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      return;
    },
    onSuccess() {
      toast.success("Task deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete Task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyFactory.Tasks.taskPrefix, workspaceId, projectId],
      });
    }
  });
};

export const useEditTaskMutation = () => {
  type path = paths["/tasks/{taskId}"]["patch"];
  type ResponseType = path["responses"]["200"]["content"]["*/*"];
  type RequestType = path["requestBody"]["content"]["application/json"];
  type Params = path["parameters"]["path"];

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType & Params>({
    mutationFn: async (data) => {
      const response = await fetch(`/api/tasks/${data.taskId}`, {
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Task updated successfully");
    },
    onError: () => {
      toast.error("Failed to update Task");
    },
    onSettled: (data, _error, vars) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyFactory.Tasks.taskPrefix, data?.workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.Tasks.byTaskId(vars.taskId),
      });
    }
  });
};
