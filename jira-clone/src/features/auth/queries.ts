"use server";

import { cookies } from "next/headers"

export const getCurrentUser = async () => {
  const cks = await cookies();
  const session = cks.get("CWA-JIRA-CLONE-SESSION");
  if (!session) {
    return null;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Cookie": `CWA-JIRA-CLONE-SESSION=${session.value}`,
    },
    credentials: "include",
  });
  if (!response.ok) {
    if(response.status===403)return null;

    throw new Error("Network response was not ok");
  }
  const res = await response.json();
  return res;

}