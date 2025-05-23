"use client";

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createWorkspaceSchema } from '../schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DottedSeparator } from '@/components/dotted-separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateWorkspaceMutation } from '@/lib/tanstack-query/mutations/workspace';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/pro-solid-svg-icons/faImage';
import { useWorkspaces } from '@/lib/tanstack-query/queries/useWorkspace';

export default function CreateWorkspaceForm({onCancel}:{onCancel?: () => void}) {

    const inputRef = React.useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: '',
            image: "",
        }
    })

    const createWorkspaceMutation = useCreateWorkspaceMutation();
  return (
    <Card className='w-full h-full border-none shadow-none'>
        <CardHeader className='flex p-7'>
            <CardTitle className='text-xl font-bold'>
                Create a new Workspace
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
                    if (data.image) {
                        formData.append('image', data.image);
                    }
                    createWorkspaceMutation.mutate(formData);
                })}>
                    <div className="flex flex-col gap-y-4">
                        <FormField control={form.control} name='name' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Workspace Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder='Enter workspace name' />
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
                                    <p className="text-sm">Workspace Icon</p>
                                    <p className="text-sm text-muted-foreground">
                                        JPEG, PNG, SVG, or JPG max 1MB
                                    </p>
                                    <input ref={inputRef} disabled={createWorkspaceMutation.isPending} onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            form.setValue('image', file);
                                        }
                                    }} type='file' className='hidden' accept='.jpg, .png, .svg, .jpeg' />
                                    <Button type='button' disabled={createWorkspaceMutation.isPending} variant={'teritrary'} size={'xs'} className='w-fit mt-2' onClick={() => inputRef.current?.click()}>Upload Image</Button>
                                </div>

                             </div>   
                        )} />

                    </div>
                    <DottedSeparator className='py-7' />
                    <div className='flex items-center justify-between'>
                        <Button type='button' size={'lg'} variant={'secondary'} onClick={onCancel} disabled={createWorkspaceMutation.isPending}>Cancel</Button>
                        <Button size="lg" variant={"primary"} disabled={createWorkspaceMutation.isPending}>Create Workspace</Button>
                    </div>
                </form>
                </Form>
        </CardContent>
    </Card>
  )
}
