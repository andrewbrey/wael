import * as serverBuild from "@remix-run/dev/server-build";
import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import { spawn } from "node:child_process";
import process from "node:process";

let studioProcess;

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use("/build", express.static("public/build", { immutable: true, maxAge: "1y" }));

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public/", { maxAge: "1h" }));

if (process.env.EXPOSE_PRISMA_STUDIO === "true") {
  const port = process.env.PRISMA_STUDIO_PORT || 5555
  const proxy = require("express-http-proxy");
  const cheerio = require("cheerio");

  studioProcess = spawn("npx", ["prisma", "studio", "--browser", "none", '--port', port], { stdio: "inherit" });

  app.all(
    "*",
    proxy(`http://localhost:${port}`, {
      filter: (req) => req.headers?.referer?.includes("__db") || req.url?.includes("__db"),
      userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        if (userReq.path === "/__db") {
          const $ = cheerio.load(proxyResData);
          $("html head").prepend('<base href="/__db/">');

          return $.root().html();
        }

        return proxyResData;
      },
      proxyReqPathResolver: (req) => req.url.replace("/__db", ""),
    })
  );
}

app.use(morgan("tiny"));

app.all(
  "*",
  createRequestHandler({
    build: serverBuild,
    mode: process.env.NODE_ENV,
  })
);

const hostPort = process.env.HOST_PORT;
const appPort = process.env.APP_PORT || 3000;

const server = app.listen(appPort, () => {
  console.log(`Express server listening at http://localhost:${hostPort ?? appPort}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("Shutting down server...");

  studioProcess?.kill("SIGTERM");

  server?.close((err) => {
    if (err) console.log("Shutdown encountered error ", err);

    process.exit(err ? 1 : 0);
  });
}
