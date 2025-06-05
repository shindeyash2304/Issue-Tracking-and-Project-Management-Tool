
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/features/auth/queries';

import { TaskPageClient } from '@/features/tasks/components/task-page-client'

export default async function TaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { taskId } = await params;

  return (
    <TaskPageClient taskId={taskId} />
  )
}
