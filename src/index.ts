import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import API from "./routes"
import cookieSession from "cookie-session";
import requestIp from "request-ip";
import { Server } from "socket.io";
import { createServer } from "http";
import { connectDB } from "./database/db.config";
import { initializeSocketIO } from "./services/socket";
import { log, rateLimiter, notFound, errorHandler } from "./middlewares";
import cookiesParser from 'cookie-parser'

dotenv.config();

const app: Application = express();

connectDB();

const PORT: Number = +(process.env.PORT as string) || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
    pingTimeout: 60000, 
    cors: {
        origin: "*",
        credentials: true,
    },
});

app.set("io", io);

initializeSocketIO(io);

app.use(requestIp.mw());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookiesParser());

app.use(cookieSession({
    name: 'session',
    domain:"https://debate-platform.vercel.app",
    keys: [process.env.COOKIE_KEY as string],
    maxAge: 30 * 24 * 60 * 60 * 1000,
}));

app.use(cors({ origin: ["http://localhost:3000","https://debate-platform.vercel.app"], credentials: true }));
app.use(rateLimiter);

app.get('/', (req, res) => res.json(`Welcome to ${process.env.APP_NAME}!`));

app.use(log);
new API(app).registerGroups();
app.use(notFound);
app.use(errorHandler);

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});