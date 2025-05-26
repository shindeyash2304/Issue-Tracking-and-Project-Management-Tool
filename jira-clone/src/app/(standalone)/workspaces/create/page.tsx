
import { getCurrentUser } from '@/features/auth/queries';
import CreateWorkspaceForm from '@/features/workspaces/components/create-workspace-form'
import { redirect } from 'next/navigation';
import React from 'react';

export default async function WorkspaceCreatePage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }
    return (
        <div className='w-full lg:max-w-xl'>
            <CreateWorkspaceForm />
        </div>
    )
}
