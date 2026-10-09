import cors from "cors";
import express from "express";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
