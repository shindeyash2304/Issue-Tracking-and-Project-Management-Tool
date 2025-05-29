"use client";

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/pro-solid-svg-icons/faImage';
import { useRouter } from 'next/navigation';
import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons/faArrowLeft';
import { useRef } from 'react';

import { editProjectSchema } from '@/features/projects/schema';
import { useDeleteProjectMutation, useEditProjectMutation } from '@/lib/tanstack-query/mutations/project';
import { cn, getImageUrl } from '@/lib/utils';
import type { Project } from '@/features/projects/types';
import { useConfirm } from '@/lib/hooks/use-confirm';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function EditProjectForm({ onCancel, initialValues }: { onCancel?: () => void, initialValues: Project }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete project",
    "This action cannot be undone",
    "destructive"
  );

  const form = useForm<z.infer<typeof editProjectSchema>>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: initialValues.name,
      image: initialValues.imageKey ?? ""
    }
  })

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteProjectMutation.mutate(undefined);
  }

  const editProjectMutation = useEditProjectMutation(initialValues.workspaceId, initialValues.id);
  const deleteProjectMutation = useDeleteProjectMutation(initialValues.id);

  return (
    <div className='flex flex-col gap-y-4'>
      <DeleteDialog />
      <Card className='w-full h-full border-none shadow-none'>
        <CardHeader className='flex flex-row items-center gap-x-4 p-7 space-y-0'>
          <Button size={"sm"} variant={'secondary'} onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.id}`)}>
            <FontAwesomeIcon icon={faArrowLeft} className='mr-2' />
            Back
          </Button>
          <CardTitle className='text-xl font-bold'>
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className='p-7'>
          <Form {...form}>
            <form className='space-y-4' onSubmit={form.handleSubmit((data) => {
              const formData = new FormData();
              formData.append('workspaceId', initialValues.workspaceId);
              if (data.name) {
                formData.append('name', data.name);
              }
              if (data.image instanceof File) {
                formData.append('image', data.image);
              }
              editProjectMutation.mutate(formData, {
                onSuccess: (project) => {
                  form.reset();
                  router.push(`/workspaces/${initialValues.workspaceId}/projects/${project.id}`);
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
                          <Image src={field.value instanceof File ? URL.createObjectURL(field.value) : getImageUrl(field.value)!} fill alt='File' className='object-cover' />
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
                      <input ref={inputRef} disabled={editProjectMutation.isPending} onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          form.setValue('image', file);
                        }
                      }} type='file' className='hidden' accept='.jpg, .png, .svg, .jpeg' />
                      <Button type='button' disabled={editProjectMutation.isPending} variant={'teritrary'} size={'xs'} className='w-fit mt-2' onClick={() => inputRef.current?.click()}>Upload Image</Button>
                    </div>

                  </div>
                )} />

              </div>
              <DottedSeparator className='py-7' />
              <div className='flex items-center justify-between'>
                <Button type='button' size={'lg'} variant={'secondary'} onClick={onCancel} disabled={editProjectMutation.isPending} className={cn(!onCancel && "invisible")}>Cancel</Button>
                <Button size="lg" variant={"primary"} disabled={editProjectMutation.isPending}>Save Changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className='w-full h-full border-none shadow-none'>
        <CardContent className='p-7'>
          <div className='flex flex-col'>
            <h3 className='font-bold'>Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a project is irreversible and will remove all associated data
            </p>
            <DottedSeparator className='py-7' />
            <Button className='mt-6 ml-auto' size={'sm'} variant={'destructive'} type='button' disabled={deleteProjectMutation.isPending || editProjectMutation.isPending} onClick={handleDelete}>
              Delete project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
