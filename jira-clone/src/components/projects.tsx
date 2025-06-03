"use client"

import { faCirclePlus } from '@fortawesome/pro-solid-svg-icons/faCirclePlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import { useCreateProjectModal } from '@/features/projects/hooks/useCreateProjectModal';
import { useWorkspace } from '@/lib/tanstack-query/queries/use-workspace';
import { type Project } from '@/features/projects/types';

import ProjectAvatar from '@/features/projects/components/project-avatar';

export default function Projects() {
  const { open } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();
  const { data: workspace, isPending } = useWorkspace(workspaceId);
  if (isPending) return null;
  const { projects } = workspace!;

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='flex items-center justify-between'>
        <p className='text-xs uppercase text-neutral-500'>Projects</p>
        <FontAwesomeIcon onClick={open} icon={faCirclePlus} className='size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition' />
      </div>
      {projects?.map(project => <Project project={project} key={project.id} />)}
    </div>
  )
}

function Project({ project }: { project: Project }) {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  const href = `/workspaces/${workspaceId}/projects/${project.id}`;
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div className={cn("flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500", isActive && "bg-white shadow-sm hover:opacity-100 text-primary")}>
        <ProjectAvatar name={project.name} imageUrl={project.imageKey} />
        <span className='truncate'>{project.name}</span>
      </div>
    </Link>
  )
}
