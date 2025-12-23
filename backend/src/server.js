import cookieParser from "cookie-parser";
import express from "express";
import path from "path";

import ENV from "./lib/env.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (ENV.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    const filePath = path.join(__dirname, "../frontend/dist/index.html");
    app.get("*", (req, res) => res.sendFile(filePath));
}

app.listen(PORT, () => {
    console.log("Server started on port:", PORT);
    connectDB();
});
