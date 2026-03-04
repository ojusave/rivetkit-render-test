import { Hono } from "hono";
import { registry } from "./actors.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
    <head><title>RivetKit Hello World</title></head>
    <body>
      <h1>RivetKit Hello World</h1>
      <p>Counter Actor is running!</p>
      <p>API endpoint: <code>/api/rivet/*</code></p>
    </body>
    </html>
  `);
});

app.get("/health", (c) => c.json({ status: "ok" }));

app.all("/api/rivet/*", (c) => registry.handler(c.req.raw));

export default app;
