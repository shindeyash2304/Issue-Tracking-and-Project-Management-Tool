import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from '@fortawesome/pro-solid-svg-icons/faArrowUpRightFromSquare';
import { faPencil } from "@fortawesome/pro-solid-svg-icons/faPencil";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { useRouter } from "next/navigation";

import { useDeleteTasMutation } from "@/lib/tanstack-query/mutations/task";
import { useConfirm } from "@/lib/hooks/use-confirm";
import { useEditTaskModal } from "@/features/tasks/hooks/use-edit-task-modal";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function TaskActions({ children, id, projectId, workspaceId }: { id: string, projectId: string, children: ReactNode, workspaceId: string }) {
  const router = useRouter();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Task",
    "Are you sure you want to delete this task? this action cannot be undone.",
    "destructive",
  );

  const { open } = useEditTaskModal();

  const deleteTasMutation = useDeleteTasMutation(workspaceId, projectId);

  const handleDeleteTask = async () => {
    try {
      await confirm();
      deleteTasMutation.mutate({ taskId: id });
    } catch (error) {
      console.error("Task deletion cancelled or failed:", error);
    }
  };

  const handleOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  }

  const handleOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  }

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleOpenTask} className="font-medium p-2.5">
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="size-4 mr-2 stroke-2" />
            Task details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenProject} className="font-medium p-2.5">
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="size-4 mr-2 stroke-2" />
            Open project
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => open(id)} className="font-medium p-2.5">
            <FontAwesomeIcon icon={faPencil} className="size-4 mr-2 stroke-2" />
            Edit task
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteTask} className="font-medium p-2.5 text-amber-700 focus:text-amber-700">
            <FontAwesomeIcon icon={faTrash} className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
