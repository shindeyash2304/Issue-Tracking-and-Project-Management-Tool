
import { TaskPageClient } from '@/features/tasks/components/task-page-client'

export default function TaskPage({ params }: { params: { taskId: string } }) {
  return (
    <TaskPageClient taskId={params.taskId} />
  )
}
