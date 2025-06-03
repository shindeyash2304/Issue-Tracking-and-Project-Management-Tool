import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { QueryKeyFactory } from "@/lib/tanstack-query/query-key-factory";
import { paths } from "@/types/api";

export const useCreateWorkspaceMutation = () => {
  type path = paths["/workspaces"]["post"];
  type ResponseType = Required<path["responses"]["200"]["content"]["*/*"]>;
  type RequestType = FormData

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data: FormData) => {
      toast.loading("Creating workspace...", { id: "create-workspace" });
      const response = await fetch("/api/workspaces", {
        method: "POST",
        body: data,
      })
      if (!response.ok) {
        throw new Error("Failed to create workspace")
      }
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Workspace created successfully", { id: "create-workspace" });
    },
    onError: (error) => {
      toast.error("Failed to create workspace", { id: "create-workspace" });
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.all() });
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(data?.id as string) });
    }
  })
}

export const useEditWorkspaceMutation = (workspaceId: string) => {
  type path = paths["/workspaces/{workspaceId}"]["patch"];
  type ResponseType = Required<path["responses"]["200"]["content"]["*/*"]>;
  type RequestType = FormData;

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      toast.loading("Updating workspace...", { id: "update-workspace" });
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: "PATCH",
        body: data,
      })
      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace updated successfully", { id: "update-workspace" });
    },
    onError: () => {
      toast.error("Failed to update workspace", { id: "update-workspace" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.all() });
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(workspaceId) });
    }
  });
}

export const useDeleteWorkspaceMutation = (workspaceId: string) => {
  type path = paths["/workspaces/{workspaceId}"]["delete"];
  type ResponseType = path["responses"]["200"]["content"]["*/*"];
  type RequestType = path["requestBody"];

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      toast.loading("Deleting workspace...", { id: "delete-workspace" });
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }
      return await response.text();
    },
    onSuccess: () => {
      toast.success("Workspace deleted successfully", { id: "delete-workspace" });
    },
    onError: () => {
      toast.error("Failed to delete workspace", { id: "delete-workspace" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.all() });
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(workspaceId) });
    }
  })
}

export const useResetInviteCodeMutation = (workspaceId: string) => {
  type path = paths["/workspaces/{workspaceId}/invite-code"]["patch"];
  type ResponseType = path["responses"]["200"]["content"]["*/*"];
  type RequestType = path["requestBody"];

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      toast.loading("Resetting invite code...", { id: "reset-invite-code" });
      const response = await fetch(`/api/workspaces/${workspaceId}/invite-code`, {
        method: "PATCH"
      });
      if (!response.ok) {
        throw new Error("Failed to reset invite code");
      }
      return await response.text();
    },
    onSuccess: () => {
      toast.success("Invite code reset successfully", { id: "reset-invite-code" });
    },
    onError: () => {
      toast.error("Failed to reset invite code", { id: "reset-invite-code" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(workspaceId) });
    }
  })
}

export const useJoinWorkspaceMutation = (workspaceId: string) => {
  type path = paths["/workspaces/{workspaceId}/join"]["post"];
  type ResponseType = Required<path["responses"]["200"]["content"]["*/*"]>;
  type RequestType = path["requestBody"]["content"]["application/json"];

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ inviteCode }) => {
      toast.loading("Joining workspace...", { id: "join-workspace" });
      const response = await fetch(`/api/workspaces/${workspaceId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteCode }),
      });
      if (!response.ok) {
        throw new Error("Failed to join workspace");
      }
      return await response.text();
    },
    onSuccess: () => {
      toast.success("Joined workspace successfully", { id: "join-workspace" });
    }
    ,
    onError: () => {
      toast.error("Failed to join workspace", { id: "join-workspace" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.all() });
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(workspaceId) });
    }
  })
}
