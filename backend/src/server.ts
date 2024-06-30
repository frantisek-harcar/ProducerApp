import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";
import http from "http";
import { ServerSocket } from "./ServerSocket";

const port = env.PORT;

mongoose.connect(env.MONGO_URI)
    .then(() => {
        console.log("Mongoose connected");

        const server = http.createServer(app);
        
        server.listen(port, () => {
            console.log("Server running on port: " + port);
        });

        new ServerSocket(server);
    })
    .catch(console.error);