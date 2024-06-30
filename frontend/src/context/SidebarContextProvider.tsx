import { useState } from "react";
import { SidebarContext } from "./SidebarContext";

type SidebarContextProviderProps = {
    children: any;
}

export const SidebarContextProvider = ({ children }: SidebarContextProviderProps) => {
    const [sidebarShowing, setSidebarShowing] = useState<boolean>(true);

    return (
        <SidebarContext.Provider value={{ sidebarShowing, setSidebarShowing }}>
            {children}
        </SidebarContext.Provider>
    );
};

export default SidebarContextProvider;