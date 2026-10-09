import app from "./app";
import { connectDb } from "./config/db";
import { env } from "./config/env";

connectDb().then(() => {
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
});
