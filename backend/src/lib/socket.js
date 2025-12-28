import http from "http";
import express from "express";
import { Server } from "socket.io";

import ENV from "./env.js";

import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    },
});

io.use(socketAuthMiddleware);

const userSocketMap = {};
io.on("connection", (socket) => {
    console.log("A user connected", socket.user.username);

    const userID = socket.userID;
    userSocketMap[userID] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.username);

        delete userSocketMap[userID];

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export function getReceiverSocketID(userID) {
    return userSocketMap[userID];
}

export { app, server, io };
