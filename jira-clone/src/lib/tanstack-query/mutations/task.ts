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
      toast.loading("Creating task...", { id: "create-task" });
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
      toast.success("Task created successfully", { id: "create-task" });
    },
    onError: () => {
      toast.error("Failed to create Task", { id: "create-task" });
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
      toast.loading("Deleting task...", { id: "delete-task" });
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
      toast.success("Task deleted successfully", { id: "delete-task" });
    },
    onError: () => {
      toast.error("Failed to delete Task", { id: "delete-task" });
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
      toast.loading("Updating task...", { id: "update-task" });
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
      toast.success("Task updated successfully", { id: "update-task" });
    },
    onError: () => {
      toast.error("Failed to update Task", { id: "update-task" });
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

export const useBulkUpdateTaskMutation = () => {
  type path = paths["/tasks/bulk-update"]["patch"];
  type ResponseType = path["responses"]["200"]["content"];
  type RequestType = path["requestBody"]["content"]["application/json"];

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      toast.loading("Updating tasks...", { id: "bulk-update-tasks" });
      const response = await fetch("/api/tasks/bulk-update", {
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to bulk update tasks");
      }
      return;
    },
    onSuccess() {
      toast.success("Tasks updated successfully", { id: "bulk-update-tasks" });
    },
    onError: () => {
      toast.error("Failed to update Tasks", { id: "bulk-update-tasks" });
    },
    onSettled: (_, _error, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.Tasks.byWorkspaceId(workspaceId),
      });
    }
  });
}
