import { redirect } from 'next/navigation';
import React from 'react'

import { getCurrentUser } from '@/features/auth/queries'
import { WorkspaceIdClient } from '@/app/(dashboard)/workspaces/[workspaceId]/client';

export default async function WorkspaceIdPage({ params }: { params: { workspaceId: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { workspaceId } = await params;

  return (
    <WorkspaceIdClient workspaceId={workspaceId} />
  )
}
