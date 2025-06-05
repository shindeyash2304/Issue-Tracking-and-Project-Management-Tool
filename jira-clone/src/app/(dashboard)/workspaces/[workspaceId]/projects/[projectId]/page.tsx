import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries"

import { ProjectPageClient } from "@/app/(dashboard)/workspaces/[workspaceId]/projects/[projectId]/client";


export default async function page({ params }: { params: Promise<{ projectId: string, workspaceId: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in")
  }
  const { projectId, workspaceId } = await params;

  return (
    <ProjectPageClient projectId={projectId} workspaceId={workspaceId} />
  )
}
