import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import CreateProjectModal from '@/features/projects/components/create-project-modal'
import { CreateTaskModal } from '@/features/tasks/components/create-task-modal'
import CreateWorkspaceModal from '@/features/workspaces/components/create-workspace-modal'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen'>
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <div className="flex w-full h-full">
        <div className='fixed hidden left-0 top-0 lg:block lg:w-64 h-full overflow-y-auto'>
          <Sidebar />
        </div>
        <div className='lg:pl-64 w-full'>
          <div className="mx-auto max-w-screen-2xl h-full">
            <Navbar />
            <main className='h-full py-8 px-6 flex flex-col'>
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
