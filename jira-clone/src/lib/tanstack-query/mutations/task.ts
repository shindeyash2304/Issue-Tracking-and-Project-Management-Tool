import { paths } from "@/types/api";
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";

export const useCreateTaskMutation = () => {
  type path = paths["/tasks"]["post"];
  type ResponseType = path["responses"]["200"]["content"]["*/*"];
  type RequestType = path["requestBody"]["content"]["application/json"]

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    },
    onSuccess() {
      toast.success("Task created successfully");
    },
    onError: () => {
      toast.error("Failed to create Task");
    }
  })
}
