"use client";

import { useRouter } from "next/navigation";

import { useWorkspace } from "@/lib/tanstack-query/queries/use-workspace";

import PageLoader from "@/components/page-loader";
import EditWorkspaceForm from "@/features/workspaces/components/edit-workspace-form";

export function WorkspaceSettingsClient({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();

  const { data: workspace, isPending, isError } = useWorkspace(workspaceId);

  if (isPending) {
    return <PageLoader />;
  }

  if (isError) {
    router.push(`/workspaces/${workspaceId}`);
    return null;
  }

  return (
    <div className='w-full lg:max-w-xl'>
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  )
}
