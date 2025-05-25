import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { toNodeHandler } from "better-auth/node";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler from "@/common/middlewares/error-handler";
import rateLimiter from "@/common/middlewares/rate-limiter";
import requestLogger from "@/common/middlewares/request-logger";
import { env } from "@/common/utils/env";
import { auth } from "./common/utils/auth";
import { extractData } from "./api/ai/ai.route";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({ origin: env.CORS_ORIGINS.split(","), credentials: true }));
app.use(helmet());
app.use(rateLimiter);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json({ limit: "10mb" }));

// Request logging
app.use(requestLogger);

// Routes
app.use("/ai", extractData);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
