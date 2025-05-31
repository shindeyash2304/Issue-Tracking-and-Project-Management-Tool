import { Card, CardContent } from "@/components/ui/card";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useMembers } from "@/lib/tanstack-query/queries/use-member";
import { useProjects } from "@/lib/tanstack-query/queries/use-projects";
import { faLoader } from "@fortawesome/pro-solid-svg-icons/faLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateTaskForm from "./create-task-form";

export function CreateTaskFormWrapper({ onCancel }: { onCancel: () => void }) {
  const workspaceId = useWorkspaceId();

  const { data: projects, isPending: isProjectsPending } = useProjects(workspaceId);
  const { data: members, isPending: isMembersPending } = useMembers(workspaceId);

  const projectOptions = projects?.map(({ id, name }) => ({ id, name })) ?? [];
  const memberOptions = members?.map(({ member: { id }, user: { name } }) => ({ id, name })) ?? [];

  const isPending = isProjectsPending || isMembersPending;

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
      <CreateTaskForm memberOptions={memberOptions} projectOptions={projectOptions} onCancel={onCancel} />
    </div>
  )
}