"use client";

import { faCalendar } from "@fortawesome/pro-solid-svg-icons/faCalendar";
import { faGear } from "@fortawesome/pro-solid-svg-icons/faGear";
import { faPlus } from "@fortawesome/pro-solid-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import { useCreateProjectModal } from "@/features/projects/hooks/useCreateProjectModal";
import { Project } from "@/features/projects/types";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { Task } from "@/features/tasks/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useWorkspace, useWorkspaceAnalytics } from "@/lib/tanstack-query/queries/use-workspace";
import { getImageUrl } from "@/lib/utils";

import { DottedSeparator } from "@/components/dotted-separator";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MembersAvatar from "@/features/members/components/members-avatar";
import { Member } from "@/features/members/types";
import { Analytics } from "@/features/projects/analytics";
import ProjectAvatar from "@/features/projects/components/project-avatar";

export function WorkspaceIdClient({ workspaceId }: { workspaceId: string }) {
  const { data: analytics, isPending: isAnalyticsPending, isError: isAnalyticsError, error: analyticsError } = useWorkspaceAnalytics(workspaceId);
  const { data: workspace, isPending: isWorkspacePending, isError: isWorkspaceError, error: workspaceError } = useWorkspace(workspaceId);

  const isPending = isAnalyticsPending || isWorkspacePending;
  const isError = isAnalyticsError || isWorkspaceError;

  if (isPending) {
    return <PageLoader />;
  }

  if (isError) {
    if (isWorkspaceError) {
      return <PageError message={workspaceError.message} />
    } else if (isAnalyticsError) {
      return <PageError message={analyticsError.message} />
    }
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics analytics={analytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList tasks={workspace.tasks ?? []} total={workspace.tasks?.length ?? 0} />
        <ProjectList projects={workspace.projects ?? []} total={workspace.projects?.length ?? 0} />
        <MemberList members={workspace.members} total={workspace.members.length} />
      </div>
    </div>
  )
}

const TaskList = ({ tasks, total }: { tasks: Task[], total: number }) => {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            Tasks ({total})
          </p>
          <Button variant={'muted'} size={'icon'} onClick={() => open()}>
            <FontAwesomeIcon icon={faPlus} className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {tasks.map(task => (
            <li key={task.id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p className="">{task.project?.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted foreground flex items-center">
                        <FontAwesomeIcon icon={faCalendar} className="size-3 mr-1" />
                        <span className="truncate">{formatDistanceToNow(task.dueDate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No tasks found
          </li>
        </ul>
        <Button variant={'muted'} className="mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>
            Show all
          </Link>
        </Button>
      </div>
    </div>
  )
}

const ProjectList = ({ projects, total }: { projects: Project[], total: number }) => {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateProjectModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            Projects ({total})
          </p>
          <Button variant={'secondary'} size={'icon'} onClick={open}>
            <FontAwesomeIcon icon={faPlus} className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map(project => (
            <li key={project.id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      name={project.name}
                      className="size-12"
                      fallbackClassname="text-lg"
                      imageUrl={getImageUrl(project.imageKey ?? null) ?? undefined}
                    />
                    <p className="text-lg font-medium truncate">{project.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block col-span-1 lg:col-span-2">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  )
}

const MemberList = ({ members, total }: { members: Member[], total: number }) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            Members ({total})
          </p>
          <Button variant={'secondary'} size={'icon'} asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <FontAwesomeIcon icon={faGear} className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(member => (
            <li key={member.id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                  <MembersAvatar name={member.user.name} className="size-12" />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">{member.user.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{member.user.email}</p>

                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block col-span-1 sm:col-span-2 lg:col-span-3">
            No members found
          </li>
        </ul>
      </div>
    </div>
  )
}
