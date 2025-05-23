import { useQuery } from "@tanstack/react-query"
import { QueryKeyFactory } from "../queryKeyFactory"
import { paths } from "@/types/api"

export const useWorkspaces = () => {
    type path = paths["/workspaces"]["get"]
    type ResponseType = path["responses"]["200"]["content"]["*/*"]
    type RequestType = path["requestBody"]
    return useQuery<ResponseType, Error>({
        queryKey: QueryKeyFactory.Workspace.all(),
        queryFn: async () => {
            const response =  await fetch("/api/workspaces",{
                method: "GET",
                credentials: 'include',
            })
            if(!response.ok){
                throw new Error("")
            }

            return await response.json();
        },
        staleTime: 60 * 60 * 1000, // 60 minutes
    })
}
