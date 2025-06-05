import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/pro-solid-svg-icons/faPencil'

import { Task } from '@/features/tasks/types'
import { TaskStatus } from '@/features/tasks/schema'
import { snakeCaseToTitleCase } from '@/lib/utils'
import { useEditTaskModal } from '@/features/tasks/hooks/use-edit-task-modal'

import { Button } from '@/components/ui/button'
import { DottedSeparator } from '@/components/dotted-separator'
import { OverviewProperty } from '@/features/tasks/components/overview-property'
import MembersAvatar from '@/features/members/components/members-avatar'
import TaskDate from '@/features/tasks/components/task-date'
import { Badge } from '@/components/ui/badge'

export function TaskOverview({ task }: { task: Task }) {
  const { open } = useEditTaskModal();

  return (
    <div className='flex flex-col gap-y-1 col-span-1'>
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className='text-lg font-semibold'>Overview</p>
          <Button size={'sm'} variant={'secondary'} onClick={() => open(task.id)}>
            <FontAwesomeIcon icon={faPencil} className='size-4 mr-2' />
            Edit
          </Button>
        </div>
        <DottedSeparator className='my-4' />
        <div className='flex flex-col gap-y-4'>
          <OverviewProperty label='Assignee'>
            <MembersAvatar name={task.assignee?.user.name ?? ''} className='size-6' />
            <p className='text-sm font-medium'>{task.assignee?.user.name}</p>
          </OverviewProperty>
          <OverviewProperty label='Due Date'>
            <TaskDate value={task.dueDate} />
          </OverviewProperty>
          <OverviewProperty label='Status'>
            <Badge variant={task.taskStatus as TaskStatus}>{snakeCaseToTitleCase(task.taskStatus)}</Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  )
}
