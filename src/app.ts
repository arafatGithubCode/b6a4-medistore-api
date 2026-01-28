import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import createError from "http-errors";
import { auth } from "./lib/auth";
import { errorHandler } from "./middlewares/error-handler";
import { v1Routes } from "./routes/v1";

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

app.use("/api/v1", v1Routes);

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
app.use(errorHandler);

export default app;
