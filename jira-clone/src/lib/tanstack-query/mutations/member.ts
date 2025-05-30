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
      const data = await response.json();
      return data;
    },
    onError: (error) => {
      toast.error(`Failed to update member: ${error.message}`, {
        description: "Please try again later.",
      });
    },
    onSuccess: (data) => {
      toast.success("Member updated successfully", {
        description: `Role changed to ${data.role}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(workspaceId) });
    }
  })
}

export const useDeleteMemberMutation = (memberId: string) => {
  type path = paths["/members/{memberId}"]["delete"];
  type ResponseType = path["responses"]["200"]["content"]["*/*"];
  type RequestType = path["requestBody"];

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
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
      const data = await response.text();
      return data;
    },
    onError: (error) => {
      toast.error(`Failed to delete member: ${error.message}`, {
        description: "Please try again later.",
      });
    },
    onSuccess: () => {
      toast.success("Member deleted successfully");
    },
    onSettled: () => {
    }
  })
}
