import { useQuery } from "@tanstack/react-query"
import { QueryKeyFactory } from "../queryKeyFactory"
import { paths } from "@/types/api";

type ResponseType = paths["/profile"]["get"]["responses"]["200"]["content"]["*/*"]

export const useUser = () => {
    return useQuery<ResponseType, Error>({
        queryKey: QueryKeyFactory.User.profile(),
        queryFn: async () => {
            const response = await fetch(`/api/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
            })
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            const res = await response.json();
            return res;


        },
        retry: 1,
        staleTime: 60 * 60 * 1000, // 60 minutes
    });
}
