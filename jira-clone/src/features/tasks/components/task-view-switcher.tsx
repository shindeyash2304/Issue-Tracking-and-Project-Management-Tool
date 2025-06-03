"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/pro-solid-svg-icons/faPlus'
import { useQueryState } from 'nuqs';
import { faLoader } from '@fortawesome/pro-solid-svg-icons/faLoader';
import { useCallback } from 'react';

import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useTasks } from '@/lib/tanstack-query/queries/use-task';
import { TaskStatus } from '@/features/tasks/schema';
import { useBulkUpdateTaskMutation } from '@/lib/tanstack-query/mutations/task';

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DottedSeparator } from '@/components/dotted-separator'
import { DataFilters } from '@/features/tasks/components/data-filters';
import { DataTable } from '@/features/tasks/components/data-table';
import { columns } from '@/components/columns';
import DataKanban from '@/features/tasks/components/data-kanban';
import DataCalendar from '@/features/tasks/components/data-calendar';

export default function TaskViewSwitcher({ hideProjectFilter = false }: { hideProjectFilter?: boolean }) {
  const workspaceId = useWorkspaceId();

  const [{ assigneeId, dueDate, projectId, search, status }] = useTaskFilters();

  const bulkUpdateTaskMutation = useBulkUpdateTaskMutation();

  const { data: tasks, isPending } = useTasks({
    workspaceId,
    assigneeId: assigneeId ?? undefined,
    dueDate: undefined,
    projectId: projectId ?? undefined,
    search: search ?? undefined,
    taskStatus: status ?? undefined
  });

  const [view, setView] = useQueryState("task-view", {
    defaultValue: 'table'
  });

  const onKanbanChange = useCallback((tasks: { id: string, position: number, status: TaskStatus }[]) => {
    bulkUpdateTaskMutation.mutate({
      workspaceId,
      tasks: tasks.map(task => ({ taskStatus: task.status, taskId: task.id, position: task.position }))
    })
  }, [bulkUpdateTaskMutation, workspaceId]);

  const { open } = useCreateTaskModal();
  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className='flex-1 w-full border rounded-lg'>
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className='flex flex-col gap-y-2 lg:flex-row justify-between items-center'>
          <TabsList className='w-full lg:w-auto'>
            <TabsTrigger value='table' className='h-8 w-full lg:w-auto'>
              Table
            </TabsTrigger>
            <TabsTrigger value='kanban' className='h-8 w-full lg:w-auto'>
              Kanban
            </TabsTrigger>
            <TabsTrigger value='calendar' className='h-8 w-full lg:w-auto'>
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button onClick={() => open()} size={'sm'} className='w-full lg:w-auto'>
            <FontAwesomeIcon icon={faPlus} className='size-4 mr-2' />
            Add
          </Button>
        </div>
        <DottedSeparator className='my-4' />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <DottedSeparator className='my-4' />
        {isPending ? (
          <div className='w-full border-rounded-lg h-[200px] flex flex-col items-center justify-center'>
            <FontAwesomeIcon icon={faLoader} className='size-5 text-muted-foreground' spin />
          </div>
        ) : (
          <>
            <TabsContent value='table' className='mt-0'>
              <DataTable columns={columns} data={tasks ?? []} />
            </TabsContent>
            <TabsContent value='kanban' className='mt-0'>
              <DataKanban data={tasks ?? []} onChange={onKanbanChange} />
            </TabsContent>
            <TabsContent value='calendar' className='mt-0'>
              <DataCalendar tasks={tasks ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  )
}
