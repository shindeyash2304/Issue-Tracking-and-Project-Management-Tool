import { paths } from "@/types/api"
import { useQuery } from "@tanstack/react-query"
import { QueryKeyFactory } from "../query-key-factory"

export const useProjects = (workspaceId: string) => {
  type path = paths["/projects"]["get"]
  type ResponseType = path["responses"]["200"]["content"]["*/*"]

  return useQuery<ResponseType, Error>({
    queryKey: QueryKeyFactory.Projects.byWorkspaceId(workspaceId),
    queryFn: async () => {
      const response = await fetch(`/api/projects?workspaceId=${workspaceId}`, {
        method: "GET",
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      return await response.json();
    },
    staleTime: 60 * 60 * 1000, // 60 minutes
  })
}
