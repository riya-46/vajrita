import { createServer } from "node:http";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { initializeSockets } from "./sockets/index.js";

async function bootstrap() {
  await connectDatabase();
  const app = createApp();
  const server = createServer(app);
  initializeSockets(server);

  server.listen(env.PORT, "0.0.0.0", () => {
    console.log(`VAJRITA server running on ${env.APP_URL} (0.0.0.0:${env.PORT})`);
  });
}

bootstrap().catch((error) => {
  console.error("Server bootstrap failed", error);
  process.exit(1);
});
