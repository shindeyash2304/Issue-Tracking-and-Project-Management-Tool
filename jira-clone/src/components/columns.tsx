"use client";

import React from 'react'
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/pro-solid-svg-icons/faEllipsisVertical';

import { snakeCaseToTitleCase } from '@/lib/utils';
import { TaskStatus } from '@/features/tasks/schema';

import { Task } from '@/features/tasks/types';
import { Button } from '@/components/ui/button';
import ProjectAvatar from '@/features/projects/components/project-avatar';
import MembersAvatar from '@/features/members/components/members-avatar';
import TaskDate from '@/features/tasks/components/task-date';
import { Badge } from '@/components/ui/badge';
import { TaskActions } from '@/components/task-actions';

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.original.name;
      return (
        <p className='line-clamp-1'>{name}</p>
      )
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const project = row.original.project;
      console.log(row.original)
      return (
        <div className='flex items-center gap-x-2 text-sm font-medium'>
          <ProjectAvatar name={project?.name ?? ""} className='size-6' imageUrl={project?.imageKey} />
          <p className='line-clamp-1'>{project?.name}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;
      return (
        <div className='flex items-center gap-x-2 text-sm font-medium'>
          <MembersAvatar name={assignee?.user.name ?? ''} className='size-6' />
          <p className='line-clamp-1'>{assignee?.user.name}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      return (
        <TaskDate value={dueDate} />
      )
    },
  },
  {
    accessorKey: "taskStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.original.taskStatus;
      return (
        <Badge variant={status as TaskStatus}>{snakeCaseToTitleCase(status)}</Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      const projectId = row.original.projectId;
      return <TaskActions id={id} projectId={projectId} workspaceId={row.original.workspaceId}>
        <Button variant={'ghost'} className='size-8 p-0'>
          <FontAwesomeIcon icon={faEllipsisVertical} className='size-4' />
        </Button>
      </TaskActions>
    }
  }

];
