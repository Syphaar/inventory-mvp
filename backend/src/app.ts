import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import routes from "./routes";
import { errorHandler } from "./middlewares/error-handler.middleware";

const application = express();

application.use(helmet());
application.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
);
application.use(express.json());
application.use(express.urlencoded({ extended: true }));

application.use("/api", routes);

application.get("/health", (_request, response) => {
  response.json({ status: "ok", timestamp: new Date().toISOString() });
});

application.use(errorHandler);

export default application;
