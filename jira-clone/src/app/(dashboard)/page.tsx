import { redirect, RedirectType } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";
import { getCurrentWorkspaces } from "@/features/workspaces/queries";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in", RedirectType.push);
  }
  const workspaces = await getCurrentWorkspaces();
  if (!workspaces || workspaces.length === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces[0].id}`)
  }
}
