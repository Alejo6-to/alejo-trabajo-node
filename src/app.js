import express from "express";
import { ticketRouter } from "./routes/ticketRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

export const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "taca-tickets-api"
  });
});

app.use("/api/tickets", ticketRouter);

app.use(notFound);
app.use(errorHandler);
