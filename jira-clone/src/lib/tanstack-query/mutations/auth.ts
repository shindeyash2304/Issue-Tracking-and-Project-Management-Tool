import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { paths } from "@/types/api";
import { QueryKeyFactory } from "@/lib/tanstack-query/query-key-factory";

export const useLoginMutation = () => {
  type Path = paths["/login"]["post"]
  type ResponseType = Path["responses"]["200"]["content"]["*/*"]
  type RequestType = Path["requestBody"]["content"]["application/json"]

  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      toast.loading("Logging in...", { id: "login" });
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
      toast.success("Logged in successfully", { id: "login" });
    },
    onError: () => {
      toast.error("Login failed", { id: "login" });
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

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      toast.loading("Signing up...", { id: "register" });
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
      toast.success("Signed up successfully", { id: "register" });
    },
    onError: () => {
      toast.error("Sign up failed", { id: "register" });
    },
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      toast.loading("Logging out...", { id: "logout" });
      const response = await fetch("/api/logout", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    },
    onError: () => {
      toast.error("Logout failed", { id: "logout" });
    },
    onSuccess: () => {
      toast.success("Logged out successfully", { id: "logout" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.User.profile() });
      queryClient.invalidateQueries({ queryKey: QueryKeyFactory.Workspace.all() });
    }
  })
}
