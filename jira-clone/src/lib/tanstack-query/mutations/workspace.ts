import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { QueryKeyFactory } from "../queryKeyFactory";

export const useCreateWorkspaceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: FormData) => {
            const response = await fetch("/api/workspaces", {
                method: "POST",
                body: data,
            })
            if (!response.ok) {
                throw new Error("Failed to create workspace")
            }
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Workspace created successfully")
        },
        onError: (error) => {
            
            toast.error("Failed to create workspace")
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: QueryKeyFactory.Workspace.all()});
        }
    })
}
