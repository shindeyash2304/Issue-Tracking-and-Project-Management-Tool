import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { QueryKeyFactory } from "../queryKeyFactory";
import { useRouter } from "next/navigation";

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
        onSettled: (data) => {
            queryClient.invalidateQueries({queryKey: QueryKeyFactory.Workspace.all()});
            queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(data.id) });
        }
    })
}
export const useEditWorkspaceMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: async ({data, workspaceId}:{data: FormData, workspaceId: string}) => {
            const response = await fetch(`/api/workspaces/${workspaceId}`, {
                method: "PATCH",
                body: data,
            })
            if (!response.ok) {
                throw new Error("Failed to create workspace");
            }
            return await response.json()
        },
        onSuccess: (_data, {workspaceId}) => {
            toast.success("Workspace updated successfully")
            router.push(`/workspaces/${workspaceId}`);
        },
        onError: (error) => {
            toast.error("Failed to update workspace")
        },
        onSettled: (_data, _error, {workspaceId}) => {
            queryClient.invalidateQueries({queryKey: QueryKeyFactory.Workspace.all()});
            queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(workspaceId)});
        }
    });
}

export const useDeleteWorkspaceMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: async (workspaceId: string) => {
            const response = await fetch(`/api/workspaces/${workspaceId}`, {
                method: "DELETE"
            });
            if(!response.ok){
                throw new Error("Failed to create workspace");
            }
            return await response.text();
        },
        onSuccess: () => {
            toast.success("Workspace deleted successfully");
            router.push("/");
        },
        onError: () => {
            toast.error("Failed to delete workspace");
        },
        onSettled: (_data,_error,workspaceId) => {
            queryClient.invalidateQueries({queryKey: QueryKeyFactory.Workspace.all()});
            queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(workspaceId)});
        }
    })
}

export const useResetInviteCodeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (workspaceId: string) => {
            const response = await fetch(`/api/workspaces/${workspaceId}/invite-code`, {
                method: "PATCH"
            });
            if (!response.ok) {
                throw new Error("Failed to reset invite code");
            }
            return await response.text();
        },
        onSuccess: () => {
            toast.success("Invite code reset successfully");
        },
        onError: () => {
            toast.error("Failed to reset invite code");
        },
        onSettled: (_data, _error, workspaceId) => {
            queryClient.invalidateQueries({queryKey: QueryKeyFactory.Workspace.byId(workspaceId)});
        }
    })
}

export const useJoinWorkspaceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({inviteCode, workspaceId}:{workspaceId: string,inviteCode: string}) => {
            const response = await fetch(`/api/workspaces/${workspaceId}/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inviteCode }),
            });
            if (!response.ok) {
                throw new Error("Failed to join workspace");
            }
            return await response.text();
        },
        onSuccess: (_data, {workspaceId}) => {
            toast.success("Joined workspace successfully");
            queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.all() });
            queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.byId(workspaceId) });
        }
        ,
        onError: () => {
            toast.error("Failed to join workspace");
        }
    })
}
