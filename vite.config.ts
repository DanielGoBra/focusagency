import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { handleContact } from "./server/contact";

function contactDevApi(): Plugin {
  return {
    name: "focus-contact-api",
    configureServer(server) {
      server.middlewares.use("/api/contact", (req, res, next) => {
        if (req.method !== "POST") {
          next();
          return;
        }
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        req.on("end", () => {
          const request = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: Buffer.concat(chunks).toString("utf8"),
          });
          handleContact(request)
            .then(async (response) => {
              res.statusCode = response.status;
              res.setHeader("content-type", "application/json; charset=utf-8");
              res.end(await response.text());
            })
            .catch(() => {
              res.statusCode = 500;
              res.setHeader("content-type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: "No pudimos enviar el mensaje." }));
            });
        });
      });
    },
  };
}

export default defineConfig({
  envPrefix: ["VITE_", "TURNSTILE_SITE_"],
  plugins: [react(), tailwindcss(), contactDevApi()],
  server: { port: 5173, strictPort: true },
});
