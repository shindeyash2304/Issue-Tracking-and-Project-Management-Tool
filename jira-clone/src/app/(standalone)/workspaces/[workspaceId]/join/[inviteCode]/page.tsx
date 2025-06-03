import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/features/auth/queries'

import { WorkspaceIdJoinPageClient } from '@/app/(standalone)/workspaces/[workspaceId]/join/[inviteCode]/client';

export default async function WorkspaceIdJoinPage({ params }: { params: { workspaceId: string, inviteCode: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { workspaceId } = await params;

  return (
    <WorkspaceIdJoinPageClient workspaceId={workspaceId} />
  )
}
