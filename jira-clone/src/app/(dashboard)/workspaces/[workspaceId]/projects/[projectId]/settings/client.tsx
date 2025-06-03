"use client";

import { useProject } from "@/lib/tanstack-query/queries/use-projects";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import EditProjectForm from "@/features/projects/components/edit-project-form";

export const ProjectSettingsPageClient = ({ projectId }: { projectId: string }) => {

  const { data: project, isPending, isError, error } = useProject(projectId);

  if (isPending) {
    return <PageLoader />;
  }

  if (isError) {
    return <PageError message={error.message} />;
  }

  return (
    <div>
      <EditProjectForm initialValues={project} />
    </div>
  )
}
