import { parseAsJson, useQueryState } from 'nuqs';
import { z } from 'zod';
import { TaskStatus } from '@/features/tasks/schema';

const schema = z.object({
  taskStatus: z.nativeEnum(TaskStatus).optional(),
})

export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState("create-task", parseAsJson(schema.parse).withOptions({ clearOnDefault: true }));
  return {
    isOpen,
    open: (status?: TaskStatus) => setIsOpen(status ? { taskStatus: status } : {}),
    close: () => setIsOpen(null),
    setIsOpen
  }
}
