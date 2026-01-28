import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { sendJSON } from "./helpers/send-json";
import { auth } from "./lib/auth";

const app = express();

// Configure CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the MediStore API");
});

// not found route handler
app.use((_req, res, next) => {
  const error = createError(404, "Requested resource not found");
  res.status(error.status);
  next(error);
});

// global error handler
app.use((error: Error, _req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  sendJSON(false, res, statusCode, error.message);
});

export default app;
