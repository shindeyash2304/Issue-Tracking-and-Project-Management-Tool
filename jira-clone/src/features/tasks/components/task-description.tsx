import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/pro-solid-svg-icons/faPencil'
import { faXmark } from '@fortawesome/pro-solid-svg-icons/faXmark'

import { Task } from '@/features/tasks/types'
import { useEditTaskMutation } from '@/lib/tanstack-query/mutations/task'

import { Button } from '@/components/ui/button'
import { DottedSeparator } from '@/components/dotted-separator'
import { Textarea } from '@/components/ui/textarea'

export const TaskDescription = ({ task }: { task: Task }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(task.description ?? '');

  const editTaskMutation = useEditTaskMutation();

  const handleSave = () => {
    editTaskMutation.mutate({ taskId: task.id, description: value }, {})
    setIsEditing(false);
  }

  return (
    <div className='p-4 border rounded-lg'>
      <div className='flex items-center justify-between'>
        <p className='text-lg font-semibold'>Overview</p>
        <Button size={'sm'} variant={'secondary'} onClick={() => setIsEditing(!isEditing)}>
          <FontAwesomeIcon icon={isEditing ? faXmark : faPencil} className='size-4 mr-2' />
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeparator className='my-4' />
      {isEditing ? (
        <div className='flex flex-col gap-y-4'>
          <Textarea placeholder='Add a description...' value={value} onChange={(e) => setValue(e.target.value)} rows={4} disabled={editTaskMutation.isPending} />
          <Button size={'sm'} className='w-fit ml-auto' onClick={handleSave} disabled={editTaskMutation.isPending}>
            {editTaskMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (

        <div className='flex flex-col gap-y-4'>
          <div>{task.description ?? <span className='text-muted-foreground'>No description set</span>}</div>
        </div>
      )}
    </div>
  )
}
