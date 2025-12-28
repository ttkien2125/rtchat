import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";

import ENV from "./lib/env.js";
import { app, server } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (ENV.NODE_ENV == "production") {
    const outputPath = path.join(__dirname, "../frontend/dist");
    const htmlFilePath = path.join(outputPath, "index.html");

    app.use(express.static(outputPath));
    app.get("*", (_, res) => res.sendFile(htmlFilePath));
}

server.listen(PORT, () => {
    console.log("Server started on port:", PORT);
    connectDB();
});
