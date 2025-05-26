
import { getCurrentUser } from '@/features/auth/queries'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function WorkspaceIdPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div>

        </div>
    )
}
