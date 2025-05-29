"use client";

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/pro-solid-svg-icons/faImage';
import { useRouter } from 'next/navigation';

import { createProjectSchema } from '@/features/projects/schema';
import { useCreateProjectMutation } from '@/lib/tanstack-query/mutations/project';
import { cn } from '@/lib/utils';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DottedSeparator } from '@/components/dotted-separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export default function CreateProjectForm({ onCancel }: { onCancel?: () => void }) {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      image: "",
      workspaceId

    }
  })

  const createProjectMutation = useCreateProjectMutation();
  return (
    <Card className='w-full h-full border-none shadow-none'>
      <CardHeader className='flex p-7'>
        <CardTitle className='text-xl font-bold'>
          Create a new Project
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className='p-7'>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit((data) => {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('workspaceId', data.workspaceId);
            if (data.image) {
              formData.append('image', data.image);
            }
            createProjectMutation.mutate(formData, {
              onSuccess: (project) => {
                form.reset();
                router.push(`/workspaces/${workspaceId}/projects/${project.id}`);
              }
            });
          })}>
            <div className="flex flex-col gap-y-4">
              <FormField control={form.control} name='name' render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter project name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name='image' render={({ field }) => (
                <div className='flex flex-row gap-x-2'>
                  <div className="flex items-center gap-x-5">
                    {field.value ? (
                      <div className='size-[72px] relative rounded-md overflow-hidden'>
                        <Image src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value} fill alt='File' className='object-cover' />
                      </div>
                    ) : (
                      <Avatar className='size-[72px]'>
                        <AvatarFallback>
                          <FontAwesomeIcon icon={faImage} className='size-9 text-neutral-400' />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm">Project Icon</p>
                    <p className="text-sm text-muted-foreground">
                      JPEG, PNG, SVG, or JPG max 1MB
                    </p>
                    <input ref={inputRef} disabled={createProjectMutation.isPending} onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        form.setValue('image', file);
                      }
                    }} type='file' className='hidden' accept='.jpg, .png, .svg, .jpeg' />
                    {field.value ? (
                      <Button type='button' disabled={createProjectMutation.isPending} variant={'destructive'} size={'xs'} className='w-fit mt-2' onClick={() => {
                        field.onChange(null);
                        if (inputRef.current) {
                          inputRef.current.value = ""
                        }
                      }}>Remove Image</Button>
                    ) : (
                      <Button type='button' disabled={createProjectMutation.isPending} variant={'teritrary'} size={'xs'} className='w-fit mt-2' onClick={() => inputRef.current?.click()}>Upload Image</Button>
                    )}
                  </div>

                </div>
              )} />

            </div>
            <DottedSeparator className='py-7' />
            <div className='flex items-center justify-between'>
              <Button type='button' size={'lg'} variant={'secondary'} onClick={onCancel} disabled={createProjectMutation.isPending} className={cn(!onCancel && "invisible")}>Cancel</Button>
              <Button size="lg" variant={"primary"} disabled={createProjectMutation.isPending}>Create Project</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
