"use client";

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/pro-solid-svg-icons/faPlus'
import { DottedSeparator } from '@/components/dotted-separator'
import { useCreateTaskModal } from '../hooks/useCreateProjectModal';

export default function TaskViewSwitcher() {
  const { open } = useCreateTaskModal();
  return (
    <Tabs className='flex-1 w-full border rounded-lg'>
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
          <Button onClick={open} size={'sm'} className='w-full lg:w-auto'>
            <FontAwesomeIcon icon={faPlus} className='size-4 mr-2' />
            Add
          </Button>
        </div>
        <DottedSeparator className='my-4' />
        Data filters
        <DottedSeparator className='my-4' />
        <>
          <TabsContent value='table' className='mt-0'>
            Data Table
          </TabsContent>
          <TabsContent value='kanban' className='mt-0'>
            Data Kanban
          </TabsContent>
          <TabsContent value='calendar' className='mt-0'>
            Data Calendar
          </TabsContent>
        </>
      </div>
    </Tabs>
  )
}
