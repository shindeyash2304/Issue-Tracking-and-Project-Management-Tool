"use client";

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation';

import { createTaskSchema, TaskStatus } from '@/features/tasks/schema';
import { useCreateTaskMutation } from '@/lib/tanstack-query/mutations/task';
import { cn } from '@/lib/utils';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DottedSeparator } from '@/components/dotted-separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { DatePicker } from '@/components/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
import MembersAvatar from '@/features/members/components/members-avatar';
import ProjectAvatar from '@/features/projects/components/project-avatar';
import { format } from 'date-fns';

export default function CreateTaskForm({ onCancel, projectOptions, memberOptions }: { onCancel?: () => void, projectOptions: { id: string, name: string }[], memberOptions: { id: string, name: string }[] }) {
  const workspaceId = useWorkspaceId();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      workspaceId,
      description: ""
    }
  })

  const createTaskMutation = useCreateTaskMutation();

  return (
    <Card className='w-full h-full border-none shadow-none'>
      <CardHeader className='flex p-7'>
        <CardTitle className='text-xl font-bold'>
          Create a new Task
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className='p-7'>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit((data) => {
            console.log(data)
            createTaskMutation.mutate({ ...data, taskStatus: data.status, dueDate: format(data.dueDate, "yyyy-MM-dd'T'HH:mm:ss.SSSX") }, {
              onSuccess: () => {
                form.reset();
                onCancel?.();
              }
            });
          })}>
            <div className="flex flex-col gap-y-4">
              <FormField control={form.control} name='name' render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter task name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name='dueDate' render={({ field }) => (
                <FormItem>
                  <FormLabel>Due date</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name='assigneeId' render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {memberOptions.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-x-2">
                            <MembersAvatar name={member.name} className='size-6' />
                            {member.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={form.control} name='status' render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                      <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                      <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                      <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                      <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={form.control} name='projectId' render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Project" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {projectOptions.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center gap-x-2">
                            <ProjectAvatar name={project.name} className='size-6' />
                            {project.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
            </div>
            <DottedSeparator className='py-7' />
            <div className='flex items-center justify-between'>
              <Button type='button' size={'lg'} variant={'secondary'} onClick={onCancel} disabled={createTaskMutation.isPending} className={cn(!onCancel && "invisible")}>Cancel</Button>
              <Button size="lg" variant={"primary"} type='submit' onClick={() => {
                console.log(form.getValues());
                // console.log(form.e)
              }} disabled={createTaskMutation.isPending}>Create Task</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
