import { createContext } from "react";
import { Socket } from "socket.io-client";

export interface SocketContextStateInterface {
    socket: Socket | undefined;
    userId: string,
    users: string[];
};

export const defaultSocketContextState: SocketContextStateInterface = {
    socket: undefined,
    userId: "",
    users: []
};

export type TypeSocketContextActions = "update_socket" | "update_userId" | "update_users" | "remove_user";

export type TypeSocketContextPayload = string | string[] | Socket;

export interface SocketContextActionsInterface {
    type: TypeSocketContextActions;
    payload: TypeSocketContextPayload;
};

export const SocketReducer = (state: SocketContextStateInterface, action: SocketContextActionsInterface) => {
    console.log(`Message Recieved - Action: ${action.type} - Payload: ${action.payload}`);

    switch (action.type) {
        case "update_socket":
            return { ...state, socket: action.payload as Socket };
        case "update_userId":
            return { ...state, userId: action.payload as string };
        case "update_users":
            return { ...state, users: action.payload as string[] };
        case "remove_user":
            return { ...state, users: state.users.filter((userId) => userId !== action.payload as string) };
        default:
            return { ...state };
    }
};

export interface SocketContextProps {
    SocketState: SocketContextStateInterface;
    SocketDispatch: React.Dispatch<SocketContextActionsInterface>
}

const SocketContext = createContext<SocketContextProps>({
    SocketState: defaultSocketContextState,
    SocketDispatch: () => {}
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;

