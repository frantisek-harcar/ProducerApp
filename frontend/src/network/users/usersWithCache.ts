import useSWR from 'swr';
import { UnauthorizedError } from '../../errors/http_errors';
import * as UserApi from './user_api';

export function useAuthenticatedUser() {
    const { data, error, isLoading, mutate } = useSWR("user",
        async () => {
            try {
                return await UserApi.getLoggedInUser();
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
        user: data,
        userLoading: isLoading,
        userLoadingError: error,
        mutateUser: mutate,
    }
}

export function useUsers() {
    const { data, error, isLoading, mutate } = useSWR("users",
        async () => {
            try {
                return await UserApi.fetchUsers();
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
        users: data,
        usersLoading: isLoading,
        usersLoadingError: error,
        mutateUsers: mutate,
    }
}

export function useAdmin() {
    const { data, error, isLoading, mutate } = useSWR("user",
        async () => {
            try {
                return await UserApi.fetchAdmin();
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
        user: data,
        userLoading: isLoading,
        userLoadingError: error,
        mutateUser: mutate,
    }
}