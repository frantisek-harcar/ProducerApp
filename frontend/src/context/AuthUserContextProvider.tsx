import { useEffect, useState } from "react";
import { User as UserModel } from "../models/user";
import { fetchData } from "../network/general";
import { AuthUserContext } from "./AuthUserContext"

interface AuthUserProviderProps {
    children: any
}

export function AuthUserContextProvider({ children }: AuthUserProviderProps) {
    const [user, setUser] = useState<UserModel | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const response = await fetchData("/api/users", { method: "GET" });
                const user = await response.json();
                setUser(user);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLoggedInUser();
    }, []);
    return (
        <AuthUserContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthUserContext.Provider>
    )
}