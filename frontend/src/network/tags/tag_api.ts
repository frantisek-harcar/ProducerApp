import { UnauthorizedError } from "../../errors/http_errors";
import { Tag } from "../../models/tag";
import { fetchData } from "../general";
import useSWR from 'swr';
import API_BASE_URL from '../config';

export interface TagInput {
    name: string,
    color: string
}

export async function fetchTags(): Promise<Tag[]> {
    const response = await fetchData(`${API_BASE_URL}/api/tags`,
        // const response = await fetchData(`/api/tags`,
        {
            method: "GET",
            credentials: 'include'
        });
    return await response.json();
}

export async function createTag(tag: TagInput): Promise<Tag> {
    const response = await fetchData(`${API_BASE_URL}/api/tags`, {
        // const response = await fetchData(`/api/tags`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tag),
    });

    return response.json();
}

export async function deleteTag(tagId: string) {
    await fetchData(`${API_BASE_URL}/api/tags/` + tagId,
        // await fetchData(`/api/tags/` + tagId,
        {
            method: "DELETE",
            credentials: 'include'
        });
}

export function useTags() {
    const { data, error, isLoading, mutate } = useSWR("tags",
        async () => {
            try {
                return await fetchTags();
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
        tags: data,
        tagsLoading: isLoading,
        tagsLoadingError: error,
        mutateTags: mutate,
    }
}
