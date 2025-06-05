import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons/faChevronRight'
import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash'
import { useRouter } from 'next/navigation'

import { Task } from '@/features/tasks/types'
import { useDeleteTasMutation } from '@/lib/tanstack-query/mutations/task'
import { useConfirm } from '@/lib/hooks/use-confirm'

import ProjectAvatar from '@/features/projects/components/project-avatar'
import { Button } from '@/components/ui/button'

export default function TaskBreadcrumbs({ task }: { task: Task }) {
  const router = useRouter();

  const deleteTaskMutation = useDeleteTasMutation(task.workspaceId, task.projectId);

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task?",
    "This action cannot be undone.",
    "destructive"
  )

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (ok) {
      deleteTaskMutation.mutate({ taskId: task.id }, {
        onSuccess: () => {
          router.push(`/workspaces/${task.workspaceId}/tasks`);
        }
      });
    }
  }

  return (
    <div className='flex items-center gap-x-2'>
      <ConfirmDialog />
      <ProjectAvatar name={task.project?.name ?? ''} imageUrl={task.project?.imageKey} className='size-6 lg:size-8' />
      <Link href={`/workspaces/${task.workspaceId}`}>
        <p className='text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition'>
          {task.project?.name}
        </p>
      </Link>
      <FontAwesomeIcon icon={faChevronRight} className='text-muted-foreground size-4 lg:size-5' />
      <p className='text-sm lg:text-lg font-semibold'>{task.name}</p>
      <Button variant={"destructive"} className='ml-auto' size={"sm"} onClick={handleDeleteTask} disabled={deleteTaskMutation.isPending}>
        <FontAwesomeIcon icon={faTrash} className='size-4 lg:mr-2' />
        <span className='hidden lg:block'>Delete task</span>
      </Button>
    </div>
  )
}
