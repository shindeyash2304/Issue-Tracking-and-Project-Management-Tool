import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from '@fortawesome/pro-regular-svg-icons/faListCheck'
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser'
import { faFolder } from '@fortawesome/pro-solid-svg-icons/faFolder'
import React from "react";
import { format } from "date-fns";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useMembers } from "@/lib/tanstack-query/queries/use-member";
import { useProjects } from "@/lib/tanstack-query/queries/use-projects";
import { TaskStatus } from "@/features/tasks/schema";
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";

import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";

export function DataFilters({ hideProjectFilter }: { hideProjectFilter?: boolean }) {
  const workspaceId = useWorkspaceId();

  const { data: projects, isPending: isProjectsPending } = useProjects(workspaceId);
  const { data: members, isPending: isMembersPending } = useMembers(workspaceId);

  const [{ assigneeId, dueDate, projectId, status }, setTaskFilters] = useTaskFilters();

  const isPending = isProjectsPending || isMembersPending;

  const projectOptions = projects?.map(({ id, name }) => ({ id, name })) ?? [];
  const memberOptions = members?.map(({ member: { id }, user: { name } }) => ({ id, name })) ?? [];

  if (isPending) {
    return null;
  }

  const handleChangeStatus = (value: string) => {
    if (value === 'all') {
      setTaskFilters({ status: null });
    } else {
      setTaskFilters({ status: value as TaskStatus });
    }
  };

  const handleChangeAssigneeId = (value: string) => {
    if (value === 'all') {
      setTaskFilters({ assigneeId: null });
    } else {
      setTaskFilters({ assigneeId: value });
    }
  };

  const handleChangeProjectId = (value: string) => {
    if (value === 'all') {
      setTaskFilters({ projectId: null });
    } else {
      setTaskFilters({ projectId: value });
    }
  };

  const handleChangeDueDate = (value: Date) => {
    setTaskFilters({ dueDate: format(value, "yyyy-MM-dd'T'HH:mm:ss") })
    // Todo: Fix with api
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select defaultValue={status ?? undefined} onValueChange={handleChangeStatus}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <FontAwesomeIcon icon={faListCheck} className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={assigneeId ?? undefined} onValueChange={handleChangeAssigneeId}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <FontAwesomeIcon icon={faUser} className="size-4 mr-2" />
            <SelectValue placeholder="All Assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Asignees</SelectItem>
          <SelectSeparator />
          {memberOptions.map(memberOption => (
            <SelectItem key={`assignee-option-${memberOption.id}`} value={memberOption.id}>{memberOption.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hideProjectFilter ? null : (
        <Select defaultValue={projectId ?? undefined} onValueChange={handleChangeProjectId}>
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <FontAwesomeIcon icon={faFolder} className="size-4 mr-2" />
              <SelectValue placeholder="All Projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectSeparator />
            {projectOptions.map(projectOption => (
              <SelectItem key={`project-option-${projectOption.id}`} value={projectOption.id}>{projectOption.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <DatePicker value={dueDate ? new Date(dueDate) : undefined} className="h-8 w-full lg:w-auto" placeholder="Due date" onChange={handleChangeDueDate} />
    </div>
  )

}
