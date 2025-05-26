
import { getCurrentUser } from '@/features/auth/queries'
import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';
import { getWorkspaceName } from '@/features/workspaces/queries';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function WorkspaceIdJoinPage({params}:{params: { workspaceId: string, inviteCode: string }}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

    const {workspaceId} = await params;

    const workspace = await getWorkspaceName(workspaceId);
  if (!workspace) {
    redirect("/");
  }

  return (
    <div className='w-full lg:max-w-xl'>
      <JoinWorkspaceForm initalValues={{name: workspace}} />
    </div>
  )
}
