import { Hono } from "hono";
import { actor, event, setup } from "rivetkit";
const counter = actor({
  // Persistent state that survives restarts: https://rivet.dev/docs/actors/state
  state: {
    count: 0
  },
  events: {
    newCount: event()
  },
  actions: {
    // Callable functions from clients: https://rivet.dev/docs/actors/actions
    increment: (c, amount) => {
      c.state.count += amount;
      c.broadcast("newCount", c.state.count);
      return c.state.count;
    },
    getCount: (c) => c.state.count
  }
});
const registry = setup({
  use: { counter }
});
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
export {
  app as default
};
