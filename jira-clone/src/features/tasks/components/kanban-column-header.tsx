
import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDashed } from '@fortawesome/pro-solid-svg-icons/faCircleDashed';
import { faCircle } from '@fortawesome/pro-regular-svg-icons/faCircle';
import { CircleDotDashedIcon } from 'lucide-react';
import { faCircleCheck } from '@fortawesome/pro-regular-svg-icons/faCircleCheck';
import { faCircleDot } from '@fortawesome/pro-regular-svg-icons/faCircleDot';
import { faPlus } from '@fortawesome/pro-solid-svg-icons/faPlus';

import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { TaskStatus } from '@/features/tasks/schema';
import { snakeCaseToTitleCase } from '@/lib/utils';

import { Button } from '@/components/ui/button';

const statusIconMap: Record<TaskStatus, ReactNode> = {
  [TaskStatus.BACKLOG]: <FontAwesomeIcon icon={faCircleDashed} className='size-[18px] text-pink-400' />,
  [TaskStatus.DONE]: <FontAwesomeIcon icon={faCircleCheck} className='size-[18px] text-emerald-400' />,
  [TaskStatus.IN_PROGRESS]: <CircleDotDashedIcon className='size-[18px] text-yellow-400' />,
  [TaskStatus.IN_REVIEW]: <FontAwesomeIcon icon={faCircleDot} className='size-[18px] text-blue-400' />,
  [TaskStatus.TODO]: <FontAwesomeIcon icon={faCircle} className='size-[18px] text-red-400' />
}

export default function KanbanColumnHeader({ board, taskCount }: { taskCount: number, board: TaskStatus }) {

  const { open } = useCreateTaskModal();

  const icon = statusIconMap[board];
  return (
    <div className='px-2 py-1.5 flex items-center justify-between'>
      <div className='flex items-center gap-x-2'>
        {icon}
        <h2 className='text-sm font-medium'>
          {snakeCaseToTitleCase(board)}
        </h2>
        <div className='size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium'>
          {taskCount}
        </div>
      </div>
      <Button className='size-5' size="icon" variant={'ghost'} onClick={() => open(board)}>
        <FontAwesomeIcon icon={faPlus} className='size-4 text-neutral-500' />
      </Button>
    </div>
  )
}
