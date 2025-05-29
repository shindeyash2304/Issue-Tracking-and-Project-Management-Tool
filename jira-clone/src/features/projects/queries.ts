"use server";

import { cookies } from "next/headers";

export const getProject = async (projectId: string) => {
  const cks = await cookies();
  const session = cks.get("CWA-JIRA-CLONE-SESSION");
  if (!session) {
    return null;
  }
  const response = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Cookie": `CWA-JIRA-CLONE-SESSION=${session.value}`,
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res = await response.json();
  return res;
}