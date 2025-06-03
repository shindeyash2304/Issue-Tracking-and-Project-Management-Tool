import { useQuery } from "@tanstack/react-query"
import axios from 'axios';
import { minutesToMilliseconds } from "date-fns";

import { QueryKeyFactory } from "@/lib/tanstack-query/query-key-factory"
import { TaskStatus } from "@/features/tasks/schema";
import { paths } from "@/types/api";

type path = paths["/tasks"]["get"]
type Params = path["parameters"]["query"]["getTaskDto"]
type ResponseType = path["responses"]["200"]["content"]["*/*"]
export const useTasks = ({ workspaceId, assigneeId, dueDate, projectId, taskStatus, search }: Omit<Params, 'taskStatus'> & { taskStatus?: TaskStatus }) => {
  return useQuery<ResponseType, Error>({
    queryKey: QueryKeyFactory.Tasks.byFilters(workspaceId, projectId, assigneeId, dueDate, taskStatus, search),
    queryFn: async () => {
      const response = await axios.get("/api/tasks", {
        params:
        {
          workspaceId,
          projectId: projectId ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          taskStatus: taskStatus ?? undefined,
          search
        },
        responseType: "json",
        withCredentials: true
      });
      return response.data;
    },
    staleTime: minutesToMilliseconds(30)
  })
}

export const useTask = (taskId: string) => {
  type path = paths["/tasks/{taskId}"]["get"];
  type ResponseType = path["responses"]["200"]["content"]["*/*"];

  return useQuery<ResponseType, Error>({
    queryKey: QueryKeyFactory.Tasks.byTaskId(taskId),
    queryFn: async () => {
      const response = await axios.get(`/api/tasks/${taskId}`, {
        responseType: "json",
        withCredentials: true
      });
      return response.data;
    },
    staleTime: minutesToMilliseconds(30)
  })
};
