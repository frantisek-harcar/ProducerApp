import { FunctionComponent, PropsWithChildren, useEffect, useReducer, useState } from "react";
import Spinner from "../components/Spinner";
import { useSocket } from "../hooks/useSocket";
import { defaultSocketContextState, SocketContextProvider, SocketReducer } from "./SocketContext";

interface SocketContextComponentProps extends PropsWithChildren {

}

const SocketContextComponent: FunctionComponent<SocketContextComponentProps> = (props) => {
    const { children } = props;

    const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
    const [loading, setLoading] = useState(true);

    // const socket = useSocket('ws://localhost:3000/', {
    const socket = useSocket('https://producer-app-server.onrender.com', {
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        autoConnect: false,
        withCredentials: true,
    })

    useEffect(() => {
        socket.connect();

        SocketDispatch({ type: "update_socket", payload: socket });

        StartListeners();

        SendHandshake();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const StartListeners = () => {
        socket.on("user_connected", (users: string[]) => {
            console.log("User connected, new user list recieved");
            SocketDispatch({ type: "update_users", payload: users });
        })

        socket.on("user_disconnected", (userId: string) => {
            console.log("User disconnected");
            SocketDispatch({ type: "remove_user", payload: userId });
        })

        socket.io.on("reconnect", (attempt) => {
            console.log("Reconnected on attempt: " + attempt)
        });

        socket.io.on("reconnect_attempt", (attempt) => {
            console.log("Reconnection attempt: " + attempt)
        });

        socket.io.on("reconnect_error", (error) => {
            console.log("Reconnection error: ", error)
        });

        socket.io.on("reconnect_failed", () => {
            console.log("Reconnection failed");
        });


    };
    const SendHandshake = () => {
        console.log("Sending handshake to the server...");

        socket.emit("handshake", (userId: string, users: string[]) => {
            console.log("User handshake callback message received");
            SocketDispatch({ type: "update_userId", payload: userId });
            SocketDispatch({ type: "update_users", payload: users });

            setLoading(false);
        });
    };

    return (
        <>
            {loading && <Spinner />}
            {!loading &&
                <SocketContextProvider value={{ SocketState, SocketDispatch }}>{children}
                </SocketContextProvider>
            }
        </>
    );
}

export default SocketContextComponent;