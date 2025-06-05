import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/features/auth/queries'
import { WorkspaceSettingsClient } from '@/app/(standalone)/workspaces/[workspaceId]/settings/client';

export default async function WorkspaceSettingsPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { workspaceId } = await params;

  return (
    <WorkspaceSettingsClient workspaceId={workspaceId} />
  )
}
