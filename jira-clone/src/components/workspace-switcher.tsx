"use client";

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/pro-solid-svg-icons/faCirclePlus'

import { useWorkspaces } from '@/lib/tanstack-query/queries/use-workspace';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WorkspaceAvatar from '@/features/workspaces/components/workspace-avatar';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';

export default function WorkspaceSwitcher() {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { open } = useCreateWorkspaceModal();
  const { data: workspaces, isPending, isError } = useWorkspaces();
  if (isPending || isError) {
    return null;
  }

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='flex items-center justify-between'>
        <p className='text-xs uppercase text-neutral-500'>Workspaces</p>
        <FontAwesomeIcon onClick={open} icon={faCirclePlus} className='size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition' />
      </div>
      <Select onValueChange={(id) => router.push(`/workspaces/${id}`)} value={workspaceId as string}>
        <SelectTrigger className='w-full bg-neutral-200 font-medium p-1'>
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.map(workspace => {
            return (
              <SelectItem key={workspace.id} value={workspace.id ?? ""}>
                <div className='flex justify-start items-center gap-3 font-medium'>
                  <WorkspaceAvatar name={workspace.name as string} imageUrl={workspace.imageUrl} />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
