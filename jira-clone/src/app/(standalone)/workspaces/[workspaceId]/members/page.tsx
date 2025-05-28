import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";

import MembersList from "@/components/members-list";

export default async function WorkspaceIdMembersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  )
}