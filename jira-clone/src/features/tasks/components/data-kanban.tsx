
import { useCallback, useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { Task } from '@/features/tasks/types'
import { TaskStatus } from '@/features/tasks/schema'

import KanbanColumnHeader from '@/features/tasks/components/kanban-column-header';
import KanbanCard from '@/features/tasks/components/kanban-card';

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE
];

type TaskState = {
  [key in TaskStatus]: Task[];
}

export default function DataKanban({ data, onChange }: { data: Task[], onChange: (tasks: { id: string, position: number, status: TaskStatus }[]) => void }) {
  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: []
    };

    data.forEach(task => {
      initialTasks[task.taskStatus].push(task);
    });

    Object.keys(initialTasks).forEach(key => {
      initialTasks[key as TaskStatus].sort((a, b) => {
        return a.position - b.position;
      });
    });
    return initialTasks;
  });

  useEffect(() => {
    const newTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: []
    };

    data.forEach(task => {
      newTasks[task.taskStatus].push(task);
    });

    Object.keys(newTasks).forEach(key => {
      newTasks[key as TaskStatus].sort((a, b) => {
        return a.position - b.position;
      });
    });
    setTasks(newTasks);
  }, [data]);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    let updatesPayload: { id: string, status: TaskStatus, position: number }[] = [];

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };

      // Safely remove the task from the source column
      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      // If no task was found at the source index, we can return early
      if (!movedTask) {
        console.error("No task found at source index");
        return prevTasks;
      }

      //Create new task object with updated status if moved to a different column
      const updatedMovedTasks = sourceStatus !== destinationStatus ? { ...movedTask, status: destinationStatus } : movedTask;

      //Update the task in the source column
      newTasks[sourceStatus] = sourceColumn;

      // Add the task to the destination column at the new index
      const destinationColumn = [...newTasks[destinationStatus]];
      destinationColumn.splice(destination.index, 0, updatedMovedTasks);
      newTasks[destinationStatus] = destinationColumn;

      //Prepare the updates payload
      updatesPayload = [];

      // Update the moved task's position
      updatesPayload.push({
        id: updatedMovedTasks.id,
        status: updatedMovedTasks.taskStatus as TaskStatus,
        position: Math.min((destination.index + 1) * 1000, 1_000_000)
      });

      // Update positions of other tasks in the destination column
      newTasks[destinationStatus].forEach((task, index) => {
        if (task.id !== updatedMovedTasks.id) {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000);
          if (task.position !== newPosition) {
            updatesPayload.push({
              id: task.id,
              status: destinationStatus as TaskStatus,
              position: newPosition
            });
          }
        }
      });

      // If the source and destination statuses are different, update positions in the source column
      if (destinationStatus !== sourceStatus) {
        newTasks[sourceStatus].forEach((task, index) => {
          if (task) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.position !== newPosition) {
              updatesPayload.push({
                id: task.id,
                status: sourceStatus as TaskStatus,
                position: newPosition
              });
            }
          }
        })
      }


      return newTasks;
    });
    onChange(updatesPayload);
  }, [onChange])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='flex overflow-x-auto'>
        {boards.map((board) => (
          <div key={board} className='flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]'>
            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
            <Droppable droppableId={board}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className='py-1.5 min-h-[200px]'
                >
                  {tasks[board].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className='bg-white p-2 rounded-md mb-2 shadow-sm hover:shadow-md transition-shadow'
                        >
                          <KanbanCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        )
        )}

      </div>
    </DragDropContext>
  )
}

