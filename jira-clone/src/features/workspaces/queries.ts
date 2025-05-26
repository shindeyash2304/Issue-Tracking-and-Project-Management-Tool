"use server";

import { cookies } from "next/headers"

export const getCurrentWorkspaces = async () => {
    try {
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
    } catch (error) {
        return null;
        // throw new Error(error);
    }
}

export const getWorkspace = async (workspaceId : string) => {
    try {
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
    } catch (error) {
        return null;
        // throw new Error(error);
    }
}

export const getWorkspaceName = async (workspaceId: string) => {
    try {
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
    } catch (error) {
        return null;
        // throw new Error(error);
    }
}
