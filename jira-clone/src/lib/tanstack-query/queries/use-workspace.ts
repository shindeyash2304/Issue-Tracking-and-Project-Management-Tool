import { useQuery } from "@tanstack/react-query";

import { QueryKeyFactory } from "@/lib/tanstack-query/query-key-factory"
import { paths } from "@/types/api"

export const useWorkspaces = () => {
  type path = paths["/workspaces"]["get"]
  type ResponseType = path["responses"]["200"]["content"]["*/*"]

  return useQuery<ResponseType, Error>({
    queryKey: QueryKeyFactory.Workspace.all(),
    queryFn: async () => {
      const response = await fetch("/api/workspaces", {
        method: "GET",
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error("")
      }

      return await response.json();
    },
    staleTime: 60 * 60 * 1000, // 60 minutes
  })
}

export const useWorkspace = (workspaceId: string) => {
  type path = paths["/workspaces/{workspaceId}"]["get"];
  type ResponseType = path["responses"]["200"]["content"]["*/*"];

  return useQuery<ResponseType, Error>({
    queryKey: QueryKeyFactory.Workspace.byId(workspaceId),
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: "GET",
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error("Failed to fetch workspace")
      }
      return await response.json()
    },
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
}
