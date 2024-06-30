import { Server as HttpServer } from 'http';
// import {Server as HttpsServer } from 'https';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;

    public users: { [uid: string]: string };

    // constructor(server: HttpServer) {
    constructor(server: HttpServer) {
        ServerSocket.instance = this;
        this.users = {};
        this.io = new Server(server, {
            cors: { 
                origin: "https://producer-app.onrender.com",
                // methods: ["GET", "POST"],
                credentials: true
            }
        });
        this.io.listen(server);
        this.io.on('connect', this.StartListeners);

        console.log("Socket IO started");
    }

    StartListeners = (socket: Socket) => {
        console.info('Message received from ' + socket.id);

        socket.on('handshake', (callback: (userId: string, users: string[]) => void) => {
            console.info('Handshake received from: ' + socket.id);

            const reconnected = Object.values(this.users).includes(socket.id);

            if (reconnected) {
                console.info("This user has reconnected.");
                const userId = this.GetUserIdFromSocketId(socket.id)
                const users = Object.values(this.users);

                if (userId) {
                    console.info("Sending callback for a reconnect ...");
                    callback(userId, users);
                    return;
                }
            }

            const userId = v4();
            this.users[userId] = socket.id;
            const users = Object.values(this.users);

            console.info("Sending callback for handshake ...");
            callback(userId, users);

            this.SendMessage(
                "user_connected",
                users.filter((id) => id !== socket.id),
                users
            )

        });

        socket.on('disconnect', () => {
            console.info('Disconnect received from: ' + socket.id);

            const userId = this.GetUserIdFromSocketId(socket.id);

            if (userId) {
                delete this.users[userId];
                const users = Object.values(this.users);
                this.SendMessage("user_disconnected", users, userId);
            }
        });

        socket.on('join_room', (room) => {
            socket.join(room);
            console.log("emitting:", `user joined room: ${room}`);
        });

        socket.on('chatMessage', (messageObject, room) => {
            // this.io.emit('message', messageObject);
            this.io.to(room).emit('message', messageObject);
            console.log("emitting: ", messageObject);
        });
    };

    GetUserIdFromSocketId = (id: string) => Object.keys(this.users).find((userId) => this.users[userId] == id);


    /**
    * 
    * @param name The name of the event
    * @param users List of socket id's
    * @param payload any information needed by the user for state updates
    */
    // eslint-disable-next-line @typescript-eslint/ban-types
    SendMessage = (name: string, users: string[], payload?: Object) => {
        console.info("Emitting event: " + name + " to ", users);
        users.forEach(id => payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name))
    }
}