"use client";

import Link from "next/link";
import { faPencil } from "@fortawesome/pro-solid-svg-icons/faPencil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useProject } from "@/lib/tanstack-query/queries/use-projects";
import { getImageUrl } from "@/lib/utils";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";

export function ProjectPageClient({ projectId, workspaceId }: { projectId: string, workspaceId: string }) {

  const { data: project, isPending, isError, error } = useProject(projectId);

  if (isPending) {
    return <PageLoader />;
  }

  if (isError) {
    return <PageError message={error.message} />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar name={project.name} imageUrl={getImageUrl(project.imageKey ?? null) ?? undefined} className="size-8" />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant={'secondary'} size={'sm'} asChild>
            <Link href={`/workspaces/${workspaceId}/projects/${projectId}/settings`}>
              <FontAwesomeIcon icon={faPencil} className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher hideProjectFilter />
    </div>
  )

}