"use client";

import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";

import ResponsiveModal from "@/components/responsive-modal";
import { CreateTaskFormWrapper } from "@/features/tasks/components/create-task-form-wrapper";

export function CreateTaskModal() {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  )
}
