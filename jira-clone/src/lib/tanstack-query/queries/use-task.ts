import { useQuery } from "@tanstack/react-query"
import { QueryKeyFactory } from "../query-key-factory"

export const useTasks = (workspaceId: string) => {
  return useQuery({
    queryKey: QueryKeyFactory.Tasks.byWorkspaceId(workspaceId),
    queryFn: async () => {

    }
  })
}
