import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";
import { ProjectSettingsPageClient } from "@/app/(dashboard)/workspaces/[workspaceId]/projects/[projectId]/settings/client";

export default async function ProjectSettingsPage({ params }: { params: { projectId: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { projectId } = await params;

  return (
    <ProjectSettingsPageClient projectId={projectId} />
  )
}