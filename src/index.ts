import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import API from "./routes";
import cookieSession from "cookie-session";
import requestIp from "request-ip";
import { Server } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import { connectDB } from "./database/db.config";
import { initializeSocketIO } from "./services/socket";
import { log, rateLimiter, notFound, errorHandler } from "./middlewares";
import cookiesParser from "cookie-parser";
import StripeController from "./controllers/stripe.controller";

dotenv.config();

class App {
  public app: Application;
  public httpServer: HTTPServer;
  public io: Server;
  private port: number;

  constructor() {
    this.app = express();
    this.port = +(process.env.PORT as string) || 5000;
    this.httpServer = createServer(this.app);

    this.io = new Server(this.httpServer, {
      pingTimeout: 60000,
      cors: {
        origin: [
          "https://debate-platform.vercel.app",
          "http://localhost:3000",
          "http://localhost:3004",
          "https://www.thevirtualdebate.com",
        ],
        credentials: true,
      },
    });

    this.initializeWebhooks();
    this.initializeMiddleware();
    this.initializeSocket();
    this.initializeRoutes();
    this.initializeErrorHandling();

    connectDB();
  }

  private initializeMiddleware(): void {
    this.app.use(requestIp.mw());
    this.app.use(express.json({ limit: "16kb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "16kb" }));
    this.app.use(cookiesParser());

    this.app.use(
      cookieSession({
        name: "session",
        keys: [process.env.COOKIE_KEY as string],
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      }),
    );

    this.app.use(
      cors({
        origin: [
          "https://debate-platform.vercel.app",
          "https://www.thevirtualdebate.com",
          "http://localhost:3000",
          "http://localhost:3004",
        ],
        credentials: true,
      }),
    );

    this.app.use(rateLimiter);
    this.app.use(log);
  }

  private initializeSocket(): void {
    this.app.set("io", this.io);
    initializeSocketIO(this.io);
  }

  private initializeRoutes(): void {
    this.app.get("/", (req, res) =>
      res.json(`Welcome to ${process.env.APP_NAME}!`),
    );

    new API(this.app).registerGroups();
  }

  private initializeWebhooks(): void {
    this.app.post(
      "/webhook-subscription",
      express.raw({ type: "application/json" }),
      new StripeController().webhook,
    );
  }
  private initializeErrorHandling(): void {
    this.app.use(notFound);
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.httpServer.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

const server = new App();
server.listen();
export default server;
