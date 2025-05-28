"use client";

import { Fragment } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons/faArrowLeft";
import { faEllipsisVertical } from '@fortawesome/pro-solid-svg-icons/faEllipsisVertical'

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useMembers } from "@/lib/tanstack-query/queries/use-member";
import { useDeleteMemberMutation, useUpdateMemberMutation } from "@/lib/tanstack-query/mutations/member";
import { useConfirm } from "@/lib/hooks/use-confirm";

import { components } from "@/types/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import MembersAvatar from "@/features/members/components/members-avatar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function MembersList() {
  const workspaceId = useWorkspaceId();
  const { data: members, isPending } = useMembers(workspaceId);

  const [ConfirmDialog, confirm] = useConfirm(
    "Remove Member",
    "This member will be removed form the workspace",
    "destructive"
  );
  if (isPending) return null;

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button variant={'secondary'} size={'sm'} asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <FontAwesomeIcon icon={faArrowLeft} className='mr-2' />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">
          Members list
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {members?.map((member, ind) => (
          <Fragment key={`member-${member.member.id}`}>
            <MemberListItem item={member} confirm={confirm} />
            {ind < members.length - 1 ? <Separator className="my-2.5" /> : null}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  )
}

function MemberListItem({ item, confirm }: {
  item: {
    member: components["schemas"]["Members"];
    user: components["schemas"]["Users"];
  }, confirm: () => Promise<unknown>
}) {

  const updateMemberMutation = useUpdateMemberMutation(item.member.id);
  const deleteMemberMutation = useDeleteMemberMutation(item.member.id);

  const handleUpdateMember = (role: components["schemas"]["UpdateMemberDto"]["role"]) => {
    updateMemberMutation.mutate({ role });
  }

  const handleDeleteMember = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteMemberMutation.mutate(undefined);
  }

  return (
    <Fragment key={item.member.id}>
      <div className="flex items-center gap-2">
        <MembersAvatar name={item.user.name} className="size-10" fallbackClassname="text-lg" />
        <div className="flex flex-col">
          <p className="text-sm font-medium">{item.user.name}</p>
          <p className="text-xs text-muted-foreground">{item.user.email}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={'icon'} className="ml-auto" variant={'secondary'}>
              <FontAwesomeIcon icon={faEllipsisVertical} className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem className="font-medium" onClick={() => handleUpdateMember("ADMIN")} disabled={updateMemberMutation.isPending}>
              Set as Administrator
            </DropdownMenuItem>
            <DropdownMenuItem className="font-medium" onClick={() => handleUpdateMember("MEMBER")} disabled={updateMemberMutation.isPending}>
              Set as Member
            </DropdownMenuItem>
            <DropdownMenuItem className="font-medium text-amber-700" onClick={handleDeleteMember} disabled={deleteMemberMutation.isPending}>
              Remove {item.user.name}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Fragment>
  )
}
