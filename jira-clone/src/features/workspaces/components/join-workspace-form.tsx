"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useInviteCode } from "@/features/workspaces/hooks/use-invite-code";
import { useJoinWorkspaceMutation } from "@/lib/tanstack-query/mutations/workspace";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function JoinWorkspaceForm({ initalValues }: { initalValues: { name: string } }) {
  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const joinWorkspaceMutation = useJoinWorkspaceMutation(workspaceId);

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">
          Join Workspace
        </CardTitle>
        <CardDescription>
          You&apos; have been invited to join <strong>{initalValues.name}</strong> workspace.
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
        <CardContent className="p-7">
          <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
            <Button className="w-full lg:w-fit" variant={'secondary'} type="button" asChild>
              <Link href={"/"}>
                Cancel
              </Link>
            </Button>
            <Button className="w-full lg:w-fit" size={'lg'} type="button" onClick={() => joinWorkspaceMutation.mutate({
              inviteCode
            }, { onSuccess: () => router.push(`/workspaces/${workspaceId}`) })} disabled={joinWorkspaceMutation.isPending}>
              Join
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
