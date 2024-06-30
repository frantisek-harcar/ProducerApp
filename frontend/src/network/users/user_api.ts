import { User } from "../../models/user";
import { fetchData } from "../general";
import API_BASE_URL from '../config';

export async function fetchUsers(): Promise<User[]> {
    const response = await fetchData(`${API_BASE_URL}/api/users/list`,
        // const response = await fetchData(`/api/users/list`,
        {
            method: "GET",
            credentials: 'include'
        });
    return await response.json();
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData(`${API_BASE_URL}/api/users`,
        // const response = await fetchData(`/api/users`,
        {
            method: "GET",
            credentials: 'include'
        });
    return await response.json();
}

export async function fetchUser(userId: string): Promise<User> {
    const response = await fetchData(`${API_BASE_URL}/api/users/` + userId,
        // const response = await fetchData(`/api/users/` + userId,
        {
            method: "GET",
            credentials: 'include'
        });
    return await response.json();
}

export async function fetchAdmin(): Promise<User> {
    const response = await fetchData(`${API_BASE_URL}/api/users/list/admin`,
        // const response = await fetchData(`/api/users/list/admin`,
        {
            method: "GET",
            credentials: 'include'
        });
    return await response.json();
}

export interface LoginCredentials {
    email: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData(`${API_BASE_URL}/api/users/login`, {
        // const response = await fetchData(`/api/users/login`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export async function logout() {
    await fetchData(`${API_BASE_URL}/api/users/logout`,
        // await fetchData(`/api/users/logout`,
        {
            method: "POST",
            credentials: 'include'
        });
}

export interface UserInput {
    name?: string,
    email: string,
    password: string,
}

export async function createUser(user: UserInput): Promise<User> {
    const response = await fetchData(`${API_BASE_URL}/api/users`, {
        // const response = await fetchData(`/api/users`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    return response.json();
}

export async function updateUser(userId: string, user: UserInput): Promise<User> {
    const response = await fetchData(`${API_BASE_URL}/api/users/` + userId,
        // const response = await fetchData(`/api/users/` + userId,
        {
            method: "PATCH",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
    return response.json();
}

export interface ChangePasswordInput {
    oldPassword: string,
    newPassword: string,
    newPasswordConfirmation: string,
}

export async function changePassword( passwords: ChangePasswordInput): Promise<User> {
    const response = await fetchData(`${API_BASE_URL}/api/users/user/changePassword`,
        {
            method: "PATCH",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(passwords),
        });
    return response.json();
}

export async function deleteUser(userId: string) {
    await fetchData(`${API_BASE_URL}/api/users/` + userId,
        // await fetchData(`/api/users/` + userId,
        {
            method: "DELETE",
            credentials: 'include'
        });
}