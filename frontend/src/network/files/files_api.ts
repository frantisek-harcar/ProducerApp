import { fetchData } from "../general";
import { File as FileModel } from "../../models/file"
import { UnauthorizedError } from "../../errors/http_errors";
import useSWR from 'swr';
import API_BASE_URL from '../config';

export interface FileInput {
    file: any,
    price?: Number,
    userId: string,
    projectId?: string,
}

export interface UpdateFileInput {
    price: Number
}

export async function createFile(fileInput: FormData): Promise<FileModel> {
    const response = await fetchData(`${API_BASE_URL}/api/files/createFile`,
    // const response = await fetchData(`/api/files/createFile`, {
        {
            method: "POST",
            credentials: 'include',
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            // },
            body: fileInput,
        });

    return response.json();
}

export async function getFiles(): Promise<FileModel[]> {
    const response = await fetchData(`${API_BASE_URL}/api/files`,
    // const response = await fetchData(`/api/files`,
        {
            method: "GET",
            credentials: 'include'
        });
    return await response.json();
}

export async function updateFile(fileId: string, file: UpdateFileInput): Promise<FileModel> {
    const response = await fetchData(`${API_BASE_URL}/api/files/` + fileId,
    // const response = await fetchData(`/api/files/` + fileId,
        {
            method: "PATCH",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(file),
        });
    return response.json();
}

export async function deleteFile(fileId: string) {
    await fetchData(`${API_BASE_URL}/api/files/` + fileId, {
    // await fetchData(`/api/files/` + fileId, {
        method: "DELETE",
        credentials: 'include'
    });
}

export async function updateTags(fileId: string, tags: string[]) {
    const response = await fetchData(`${API_BASE_URL}/api/files/` + fileId + "/tags",  {
    // const response = await fetchData(`/api/files/` + fileId + "/tags", {
        method: "PATCH",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags }),
    });
    return response;
}

export function useFiles() {
    const { data, error, isLoading, mutate } = useSWR("files",
        async () => {
            try {
                return await getFiles();
            } catch (error) {
                if (error instanceof UnauthorizedError) {
                    return null;
                } else {
                    throw error;
                }
            }
        }
    );

    return {
        files: data,
        filesLoading: isLoading,
        filesLoadingError: error,
        mutateFile: mutate,
    }
}