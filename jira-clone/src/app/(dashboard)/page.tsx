import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";
import { DashboardClient } from "@/app/(dashboard)/client";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <DashboardClient />
  )
}
