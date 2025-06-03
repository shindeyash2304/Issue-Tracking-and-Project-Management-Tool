import { paths } from "@/types/api"
import { useQuery } from "@tanstack/react-query"

import { QueryKeyFactory } from "@/lib/tanstack-query/query-key-factory"

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

export const useProject = (projectId: string) => {
  type path = paths["/projects/{projectId}"]["get"]
  type ResponseType = path["responses"]["200"]["content"]["*/*"]

  return useQuery<ResponseType, Error>({
    queryKey: QueryKeyFactory.Projects.byProjectId(projectId),
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "GET",
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }

      return await response.json();
    },
    staleTime: 60 * 60 * 1000, // 60 minutes
  })
}
