import { useQuery } from "@tanstack/react-query";

import { QueryKeyFactory } from "@/lib/tanstack-query/query-key-factory";
import { paths } from "@/types/api";

export const useMembers = (workspaceId: string) => {
  type path = paths["/members"]["post"];
  type ResponseType = path["responses"]["200"]["content"]["*/*"]

  return useQuery<ResponseType, Error>({
    queryKey: QueryKeyFactory.Members.byWorkspaceId(workspaceId),
    queryFn: async () => {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ workspaceId }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    }
  })
}

