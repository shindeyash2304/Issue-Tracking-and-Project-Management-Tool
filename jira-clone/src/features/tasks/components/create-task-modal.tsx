"use client";

import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";

import ResponsiveModal from "@/components/responsive-modal";
import { CreateTaskFormWrapper } from "@/features/tasks/components/create-task-form-wrapper";

export function CreateTaskModal() {
  const { isOpen, close } = useCreateTaskModal();
  return (
    <ResponsiveModal open={isOpen !== null} onOpenChange={close}>
      <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  )
}
