import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"
import { TaskStatus } from "../schema"
import { useParams } from "next/navigation";


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
