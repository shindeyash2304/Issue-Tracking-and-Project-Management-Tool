"use client";

import { useRouter } from 'next/navigation';

import { useWorkspaceName } from '@/lib/tanstack-query/queries/use-workspace';

import PageLoader from '@/components/page-loader';
import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';

export function WorkspaceIdJoinPageClient({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();

  const { data: name, isPending, isError } = useWorkspaceName(workspaceId);

  if (isPending) {
    return <PageLoader />;
  }

  if (isError) {
    router.push("/");
    return null;
  }

  return (
    <div className='w-full lg:max-w-xl'>
      <JoinWorkspaceForm initalValues={{ name }} />
    </div>
  )
}
