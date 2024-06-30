import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import usersRoutes from "./routes/users";
import projectsRoutes from "./routes/projects";
import paymentItemRoutes from "./routes/paymentItems";
import filesRoutes from "./routes/files";
import reservationsRoutes from "./routes/reservations";
import tagRoutes from "./routes/tags";
import paymentsRoutes from "./routes/payments";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(morgan("dev"))

app.use(express.json());

app.use(bodyParser.urlencoded({
    extended: true,
}))

 app.enable('trust proxy')
// app.set('trust proxy', '3.75.158.163, 3.125.183.140, 35.157.117.28');

app.use(cors({
    origin: 'https://producer-app.onrender.com',
    // origin: 'http://localhost:3000',
    credentials: true,
    // methods: ["GET", "POST"]
}));

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
        sameSite: 'none',
        secure: true,
        httpOnly: true,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_URI
    }),
}));

app.use("/api/users", usersRoutes);

app.use("/api/projects", requiresAuth, projectsRoutes);
// app.use("/api/projects", projectsRoutes);

app.use("/api/files", requiresAuth, filesRoutes);
// app.use("/api/files", filesRoutes);

app.use("/api/reservations", requiresAuth, reservationsRoutes);
// app.use("/api/reservations", reservationsRoutes);

app.use("/api/tags", requiresAuth, tagRoutes);
// app.use("/api/tags", tagRoutes);

app.use("/api/paymentItems", requiresAuth, paymentItemRoutes);
// app.use("/api/paymentItems", paymentItemRoutes);

app.use("/api/payments", paymentsRoutes);
// app.use("/api/payments", paymentsRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;