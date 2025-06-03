
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/features/auth/queries';

import { TaskPageClient } from '@/features/tasks/components/task-page-client'

export default async function TaskPage({ params }: { params: { taskId: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <TaskPageClient taskId={params.taskId} />
  )
}
