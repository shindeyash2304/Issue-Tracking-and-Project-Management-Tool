import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";
import EditProjectForm from "@/features/projects/components/edit-project-form";
import { getProject } from "@/features/projects/queries";

export default async function ProjectSettingsPage({ params }: { params: { projectId: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { projectId } = await params;
  const project = await getProject(projectId);
  return (
    <div>
      <EditProjectForm initialValues={project} />
    </div>
  )
}