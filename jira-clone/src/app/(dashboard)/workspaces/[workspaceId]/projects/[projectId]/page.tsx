import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { redirect } from "next/navigation";
import { faPencil } from '@fortawesome/pro-solid-svg-icons/faPencil'
import Link from "next/link";

import { getCurrentUser } from "@/features/auth/queries"
import { getProject } from "@/features/projects/queries";
import { getImageUrl } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";


export default async function page({ params }: { params: { projectId: string, workspaceId: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in")
  }
  const { projectId, workspaceId } = await params;
  const project = await getProject(projectId);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar name={project.name} imageUrl={getImageUrl(project.imageKey) ?? undefined} className="size-8" />
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
