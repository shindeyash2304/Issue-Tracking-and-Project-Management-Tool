"use client";

import { useEditTaskModal } from "@/features/tasks/hooks/use-edit-task-modal";

import ResponsiveModal from "@/components/responsive-modal";
import { EditTaskFormWrapper } from "@/features/tasks/components/edit-task-form-wrapper";

export function EditTaskModal() {
  const { close, taskId } = useEditTaskModal();
  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && (
        <EditTaskFormWrapper onCancel={close} id={taskId} />
      )}
    </ResponsiveModal>
  )
}
