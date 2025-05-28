import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { paths } from "@/types/api";
import { QueryKeyFactory } from "@/lib/tanstack-query/query-key-factory";

export const useLoginMutation = () => {
  type Path = paths["/login"]["post"]
  type ResponseType = Path["responses"]["200"]["content"]["*/*"]
  type RequestType = Path["requestBody"]["content"]["application/json"]
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Login failed");
      console.error("Login failed:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.User.profile() })
    }
  })
}

export const useSignUpMutation = () => {
  type path = paths["/register"]["post"]
  type ResponseType = path["responses"]["200"]["content"]["*/*"]
  type RequestType = path["requestBody"]["content"]["application/json"]

  const router = useRouter();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Signed up successfully");
      router.push("/sign-in");
    },
    onError: (error) => {
      toast.error("Sign up failed");
    },
  })
}

export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      const response = await fetch("/api/logout", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Logout failed");
      console.error("Logout failed:", error);
    },
    onSettled: () => {
      toast.success("Logged out successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.User.profile() });
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.all() });
    }
  })
}
