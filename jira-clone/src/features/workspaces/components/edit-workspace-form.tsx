"use client";

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/pro-solid-svg-icons/faImage';
import { useRouter } from 'next/navigation';
import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons/faArrowLeft';
import { faCopy } from '@fortawesome/pro-regular-svg-icons/faCopy';
import { toast } from 'sonner';
import { useRef } from 'react';

import { editWorkspaceSchema } from '@/features/workspaces/schema';
import { useDeleteWorkspaceMutation, useEditWorkspaceMutation, useResetInviteCodeMutation } from '@/lib/tanstack-query/mutations/workspace';
import { cn, getImageUrl } from '@/lib/utils';
import type { Workspace } from '@/features/workspaces/types';
import { useConfirm } from '@/lib/hooks/use-confirm';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function EditWorkspaceForm({ onCancel, initialValues }: { onCancel?: () => void, initialValues: Workspace }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete workspace",
    "This action cannot be undone",
    "destructive"
  );

  const [ResetDialog, confirmReset] = useConfirm(
    "Reset Invite Link",
    "This will generate a new invite link for your workspace. The old link will no longer work.",
    "destructive"
  );

  const form = useForm<z.infer<typeof editWorkspaceSchema>>({
    resolver: zodResolver(editWorkspaceSchema),
    defaultValues: {
      name: initialValues.name,
      image: initialValues.imageUrl ?? ""
    }
  })

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteWorkspaceMutation.mutate(undefined, { onSuccess: () => router.push("/") });
  }

  const handleReset = async () => {
    const ok = await confirmReset();

    if (!ok) return;

    resetInviteCodeMutation.mutate(undefined, {
      onSettled: () => {
        router.refresh();
      }
    });
  }

  const editWorkspaceMutation = useEditWorkspaceMutation(initialValues.id);
  const deleteWorkspaceMutation = useDeleteWorkspaceMutation(initialValues.id);
  const resetInviteCodeMutation = useResetInviteCodeMutation(initialValues.id);

  const inviteUrl = `${window.location.origin}/workspaces/${initialValues.id}/join/${initialValues.inviteCode}`;

  function copyInviteLink() {
    navigator.clipboard.writeText(inviteUrl).then(() =>
      toast.success("Invite link copied to clipboard"));
  }

  return (
    <div className='flex flex-col gap-y-4'>
      <DeleteDialog />
      <ResetDialog />
      <Card className='w-full h-full border-none shadow-none'>
        <CardHeader className='flex flex-row items-center gap-x-4 p-7 space-y-0'>
          <Button size={"sm"} variant={'secondary'} onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.id}`)}>
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
              if (data.name) {
                formData.append('name', data.name);
              }
              if (data.image instanceof File) {
                formData.append('image', data.image);
              }
              editWorkspaceMutation.mutate(formData, {
                onSuccess: (workspace) => router.push(`/workspaces/${workspace.id}`),
              });
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
                      <p className="text-sm">Workspace Icon</p>
                      <p className="text-sm text-muted-foreground">
                        JPEG, PNG, SVG, or JPG max 1MB
                      </p>
                      <input ref={inputRef} disabled={editWorkspaceMutation.isPending} onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          form.setValue('image', file);
                        }
                      }} type='file' className='hidden' accept='.jpg, .png, .svg, .jpeg' />
                      <Button type='button' disabled={editWorkspaceMutation.isPending} variant={'teritrary'} size={'xs'} className='w-fit mt-2' onClick={() => inputRef.current?.click()}>Upload Image</Button>
                    </div>

                  </div>
                )} />

              </div>
              <DottedSeparator className='py-7' />
              <div className='flex items-center justify-between'>
                <Button type='button' size={'lg'} variant={'secondary'} onClick={onCancel} disabled={editWorkspaceMutation.isPending} className={cn(!onCancel && "invisible")}>Cancel</Button>
                <Button size="lg" variant={"primary"} disabled={editWorkspaceMutation.isPending}>Save Changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className='w-full h-full border-none shadow-none'>
        <CardContent className='p-7'>
          <div className='flex flex-col'>
            <h3 className='font-bold'>Invite members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>
            <div className='mt-4'>
              <div className='flex items-center gap-x-2'>
                <Input disabled value={inviteUrl} className='w-full text-ellipsis' />
                <Button variant={'secondary'} className='size-12' onClick={copyInviteLink}>
                  <FontAwesomeIcon icon={faCopy} />
                </Button>
              </div>
            </div>
            <DottedSeparator className='py-7' />
            <Button className='mt-6 ml-auto' size={'sm'} variant={'destructive'} type='button' disabled={resetInviteCodeMutation.isPending} onClick={handleReset}>
              Reset Invite Link
            </Button>
          </div>
        </CardContent>

      </Card>

      <Card className='w-full h-full border-none shadow-none'>
        <CardContent className='p-7'>
          <div className='flex flex-col'>
            <h3 className='font-bold'>Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all associated data
            </p>
            <DottedSeparator className='py-7' />
            <Button className='mt-6 ml-auto' size={'sm'} variant={'destructive'} type='button' disabled={deleteWorkspaceMutation.isPending || editWorkspaceMutation.isPending} onClick={handleDelete}>
              Delete workspace
            </Button>
          </div>
        </CardContent>

      </Card>
    </div>
  )
}
