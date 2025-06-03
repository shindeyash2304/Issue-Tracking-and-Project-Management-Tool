import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"
import { useParams } from "next/navigation";

import { TaskStatus } from "@/features/tasks/schema"

export const useTaskFilters = () => {
  const { projectId } = useParams();
  return useQueryStates({
    projectId: parseAsString.withDefault(projectId as string ?? undefined),
    status: parseAsStringEnum(Object.values(TaskStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString
  })
};
