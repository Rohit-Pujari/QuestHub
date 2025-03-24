const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();

const public_key = fs.readFileSync(process.env.JWT_PUBLIC_KEY, "utf-8");

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://192.168.29.244:3000",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Auth Service
app.use(
  "/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

// Post Service
app.use(
  "/graphql",
  createProxyMiddleware({
    target: process.env.POST_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/ws",
  createProxyMiddleware({
    target: process.env.MESSAGE_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  })
);

app.get("/", (req, res) => {
  res.send("API GateWay Running");
});

app.listen(3001, () => console.log("API Gateway listening on port 3000!"));
