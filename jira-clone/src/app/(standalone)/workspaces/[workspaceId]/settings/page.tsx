
import { getCurrentUser } from '@/features/auth/queries'
import { getWorkspace } from '@/features/workspaces/queries';
import EditWorkspaceForm from '@/features/workspaces/components/edit-workspace-form';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function WorkspaceSettingsPage({ params }: { params: { workspaceId: string } }) {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }
    const { workspaceId } = await params;
    const workspace = await getWorkspace(workspaceId);

    if (!workspace) {
        redirect(`/workspaces/${workspaceId}`)
    }

    return (
        <div className='w-full lg:max-w-xl'>
            <EditWorkspaceForm initialValues={workspace} />
        </div>
    )
}
