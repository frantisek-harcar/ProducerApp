import { createContext } from "react";

export type SidebarContextType = {
    sidebarShowing: boolean
    setSidebarShowing: (newValue: boolean) => void;
};

export const SidebarContext = createContext<SidebarContextType>({
    sidebarShowing: true,
    setSidebarShowing: () => {},
});