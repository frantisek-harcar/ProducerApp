import { createContext } from "react"
import { User as UserModel } from "../models/user";

export interface AuthUserContextType {
    user: UserModel | null
    setUser: (user: UserModel | null) => void
    isLoading: boolean
};

export const AuthUserContext = createContext<AuthUserContextType>({
    user: null,
    setUser: () => {},
    isLoading: false
})