import dotenv from "dotenv";
import express from "express";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    const filePath = path.join(__dirname, "../frontend/dist/index.html");
    app.get("*", (req, res) => res.sendFile(filePath));
}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
