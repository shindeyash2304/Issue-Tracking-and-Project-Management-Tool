"use client";

import { useRouter } from "next/navigation";

import { useWorkspaces } from "@/lib/tanstack-query/queries/use-workspace";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";

export function DashboardClient() {
  const router = useRouter();

  const { data: workspaces, isPending, isError, error } = useWorkspaces();

  if (isPending) {
    return <PageLoader />;
  }

  if (isError) {
    return <PageError message={error.message} />;
  }

  if (!workspaces || workspaces.length === 0) {
    router.push("/workspaces/create");
    return null;
  } else {
    router.push(`/workspaces/${workspaces[0].id}`);
    return null;
  }
}