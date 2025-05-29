"use client";

import ResponsiveModal from '@/components/responsive-modal'
import CreateProjectForm from '@/features/projects/components/create-project-form';
import { useCreateProjectModal } from '@/features/projects/hooks/useCreateProjectModal';

export default function CreateProjectModal() {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  )
}
