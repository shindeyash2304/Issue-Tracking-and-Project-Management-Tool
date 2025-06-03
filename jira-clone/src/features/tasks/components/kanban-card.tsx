import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/pro-solid-svg-icons/faEllipsis';

import { Task } from '@/features/tasks/types'

import { TaskActions } from '@/components/task-actions'
import { DottedSeparator } from '@/components/dotted-separator';
import MembersAvatar from '@/features/members/components/members-avatar';
import TaskDate from '@/features/tasks/components/task-date';
import ProjectAvatar from '@/features/projects/components/project-avatar';

export default function KanbanCard({ task }: { task: Task }) {
  return (
    <div className='bg-white p-2.5 mb-1.5 rounded-shadow-sm space-y-3'>
      <div className="flex items-start justify-between gap-x-2">
        <p className='text-sm line-clamp-2'>{task.name}</p>
        <TaskActions {...task}>
          <FontAwesomeIcon icon={faEllipsis} className='size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition' />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <MembersAvatar name={task.assignee?.user.name ?? "Assignee"} fallbackClassname='text-[10px]' />
        <div className='size-1 rounded-full bg-neutral-300' />
        <TaskDate value={task.dueDate} classname='text-xs' />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar name={task.project?.name ?? "Project"} imageUrl={task.project?.imageKey} fallbackClassname='text-[10px]' />
        <span className='text-xs font-medium'>{task.project?.name}</span>
      </div>
    </div>
  )
}
