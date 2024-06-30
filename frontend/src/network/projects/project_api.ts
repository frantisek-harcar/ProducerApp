import { Chat } from "../../models/chat";
import { Project } from "../../models/project";
import { fetchData } from "../general";
import API_BASE_URL from '../config';

export async function fetchProject(projectId: string): Promise<Project> {
    const response = await fetchData(`${API_BASE_URL}/api/projects/` + projectId,
        {
            method: "GET",
            credentials: 'include'
        });
    // const response = await fetchData(`/api/projects/` + projectId, { method: "GET", credentials: 'include' });
    return response.json();
}

export async function fetchProjectChat(projectId: string): Promise<Chat> {
    const response = await fetchData(`${API_BASE_URL}/api/projects/` + projectId + "/chat",
        {
            method: "GET",
            credentials: 'include'
        });
    // const response = await fetchData(`/api/projects/` + projectId + "/chat", { method: "GET" });
    return await response.json();
}

export interface ChatInput {
    message: string,
    userId: string,
    senderId: string,
    recipientId: string,
    chatId: string,
}

export async function updateProjectChat(projectId: string, message: ChatInput) {
    const response = await fetchData(`${API_BASE_URL}/api/projects/` + projectId + "/chat", {
        // const response = await fetchData(`/api/projects/` + projectId + "/chat", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });
    return response;
}

export async function fetchProjects(): Promise<Project[]> {
    const response = await fetchData(`${API_BASE_URL}/api/projects`, {
        // const response = await fetchData(`/api/projects`, {
        method: "GET",
        credentials: 'include'
    });

    return await response.json();
}

export interface ProjectInput {
    name: string,
    isDone?: Date,
    userId: string,
}

export async function createProject(project: ProjectInput): Promise<Project> {
    const response = await fetchData(`${API_BASE_URL}/api/projects`, {
        // const response = await fetchData(`/api/projects`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
    });

    return response.json();
}

export async function updateProject(projectId: string, project: ProjectInput): Promise<Project> {
    const response = await fetchData(`${API_BASE_URL}/api/projects/` + projectId,
        // const response = await fetchData(`/api/projects/` + projectId,
        {
            method: "PATCH",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(project),
        });
    return response.json();
}

export async function archiveProject(projectId: string) {
    await fetchData(`${API_BASE_URL}/api/projects/archive/` + projectId,
        // await fetchData(`/api/projects/archive/` + projectId,
        {
            method: "PATCH",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            }
        });
}

export async function deleteProject(projectId: string) {
    await fetchData(`${API_BASE_URL}/api/projects/` + projectId,
        {
            method: "DELETE",
            credentials: 'include'
        });
    // await fetchData(`/api/projects/` + projectId, { method: "DELETE", credentials: 'include' });
}

export async function updateTags(projectId: string, tags: string[]) {
    const response = await fetchData(`${API_BASE_URL}/api/projects/` + projectId + "/tags", {
        // const response = await fetchData(`/api/projects/` + projectId + "/tags", {
        method: "PATCH",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags }),
    });
    return response;
}

export interface ReadMessagesInput {
    messageIds: string[],
    chatId: string,
}

export async function readMessages(projectId: string, messages: ReadMessagesInput) {
    const response = await fetchData(`${API_BASE_URL}/api/projects/` + projectId + "/readMessages", {
        // const response = await fetchData(`/api/projects/` + projectId + "/readMessages", {
        method: "PATCH",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
    });
    return response;
}