"use server";

import { cookies } from "next/headers"

export const getCurrentWorkspaces = async () => {
  const cks = await cookies();
  const session = cks.get("CWA-JIRA-CLONE-SESSION");
  if (!session) {
    return null;
  }

  const response = await fetch(`http://localhost:3000/api/workspaces`, {
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

export const getWorkspace = async (workspaceId: string) => {
  const cks = await cookies();
  const session = cks.get("CWA-JIRA-CLONE-SESSION");
  if (!session) {
    return null;
  }

  const response = await fetch(`http://localhost:3000/api/workspaces/${workspaceId}`, {
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

export const getWorkspaceName = async (workspaceId: string) => {
  const cks = await cookies();
  const session = cks.get("CWA-JIRA-CLONE-SESSION");
  if (!session) {
    return null;
  }

  const response = await fetch(`http://localhost:3000/api/workspaces/${workspaceId}/name`, {
    method: "GET",
    headers: {
      "Accept": "application/text",
      "Cookie": `CWA-JIRA-CLONE-SESSION=${session.value}`,
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res = await response.text();
  return res;
}
