import { getCurrentUser } from "@/features/auth/actions";
import CreateWorkspaceForm from "@/features/workspaces/components/create-workspace-form";
import { redirect, RedirectType } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
    if(!user){
      redirect("/sign-in", RedirectType.push);
    }
  return (
    <div>
        <CreateWorkspaceForm />
    </div>
  );
}
