import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries"

import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";

export default async function TasksPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div className="flex flex-col h-full">
      <TaskViewSwitcher />
    </div>
  )
}
