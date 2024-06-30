import useSWR from 'swr';
import { UnauthorizedError } from '../../errors/http_errors';
import * as ProjectApi from './project_api';

export function useProjects() {
    const { data, error, isLoading, mutate } = useSWR("projects",
        async () => {
            try {
                return await ProjectApi.fetchProjects();
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
        projects: data,
        projectsLoading: isLoading,
        projectsLoadingError: error,
        mutateProject: mutate,
    }
}