import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import cookieSession from "cookie-session";
import requestIp from "request-ip";
import { connectDB } from "./config/db.config";
import { log, rateLimiter, notFound, errorHandler } from "./middlewares";
import API from "./routes"
import { Server } from "socket.io";
import { initializeSocketIO } from "./services/socket";


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
app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY as string],
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
}));

app.use(cors({ origin: "*", credentials: true }));
app.use(rateLimiter);

app.get('/', (req, res) => res.json(`Welcome to ${process.env.APP_NAME}!`));

app.use(log);
new API(app).registerGroups();
app.use(notFound);
app.use(errorHandler);

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});