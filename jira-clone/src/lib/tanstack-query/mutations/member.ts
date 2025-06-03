import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

import { paths } from "@/types/api";
import { QueryKeyFactory } from "@/lib/tanstack-query/query-key-factory";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const useUpdateMemberMutation = (memberId: string) => {
  type path = paths["/members/{memberId}"]["patch"];
  type ResponseType = path["responses"]["200"]["content"]["*/*"];
  type RequestType = path["requestBody"]["content"]["application/json"];

  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ role }) => {
      toast.loading("Updating member...", { id: "update-member" });
      const response = await fetch(`/api/members/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ role }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error(`Failed to update member: ${error.message}`, {
        description: "Please try again later.",
        id: "update-member"
      });
    },
    onSuccess: (data) => {
      toast.success("Member updated successfully", {
        description: `Role changed to ${data.role}`,
        id: "update-member"
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(workspaceId) });
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Members.byWorkspaceId(workspaceId) });
    }
  })
}

export const useDeleteMemberMutation = (workspaceId: string, memberId: string) => {
  type path = paths["/members/{memberId}"]["delete"];
  type ResponseType = path["responses"]["200"]["content"]["*/*"];
  type RequestType = path["requestBody"];

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      toast.loading("Deleting member...", { id: "delete-member" });
      const response = await fetch(`/api/members/${memberId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.text();
    },
    onError: (error) => {
      toast.error(`Failed to delete member: ${error.message}`, {
        description: "Please try again later.",
        id: "delete-member"
      });
    },
    onSuccess: () => {
      toast.success("Member deleted successfully", { id: "delete-member" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Members.byWorkspaceId(workspaceId) });
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(workspaceId) });
    }
  })
}
