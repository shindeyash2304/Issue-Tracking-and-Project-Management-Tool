import { paths } from "@/types/api"
import { useQuery } from "@tanstack/react-query"
import { hoursToMilliseconds } from "date-fns"

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
    staleTime: hoursToMilliseconds(1),
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
    staleTime: hoursToMilliseconds(1),
  })
}

export const useProjectAnalytics = (projectId: string) => {
  type path = paths["/projects/{projectId}/analytics"]["get"];
  type ResponseType = path["responses"]["200"]["content"]["*/*"];

  return useQuery<ResponseType, Error>({
    queryKey: QueryKeyFactory.Projects.forProjectAnalytics(projectId),
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/analytics`, {
        method: "GET",
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error("Failed to fetch project analytics");
      }

      return await response.json();
    },
    staleTime: hoursToMilliseconds(1),
  })
};
