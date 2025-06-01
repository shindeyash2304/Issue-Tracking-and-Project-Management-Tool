import { faLoader } from "@fortawesome/pro-solid-svg-icons/faLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useMembers } from "@/lib/tanstack-query/queries/use-member";
import { useProjects } from "@/lib/tanstack-query/queries/use-projects";
import { useTask } from "@/lib/tanstack-query/queries/use-task";

import { Card, CardContent } from "@/components/ui/card";
import EditTaskForm from "@/features/tasks/components/edit-task-form";

export function EditTaskFormWrapper({ onCancel, id }: { onCancel: () => void, id: string }) {
  const workspaceId = useWorkspaceId();

  const { data: projects, isPending: isProjectsPending } = useProjects(workspaceId);
  const { data: members, isPending: isMembersPending } = useMembers(workspaceId);

  const { data: task, isPending: isTaskPending } = useTask(id);

  const projectOptions = projects?.map(({ id, name }) => ({ id, name })) ?? [];
  const memberOptions = members?.map(({ member: { id }, user: { name } }) => ({ id, name })) ?? [];

  const isPending = isProjectsPending || isMembersPending || isTaskPending;

  if (isPending) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <FontAwesomeIcon icon={faLoader} className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <EditTaskForm memberOptions={memberOptions} projectOptions={projectOptions} onCancel={onCancel} initialValues={task!} />
    </div>
  )
}