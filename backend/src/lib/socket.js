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

const userSocketMap = new Map();
io.on("connection", (socket) => {
    console.log("A user connected", socket.user.username);

    const userID = socket.userID;

    const sockets = userSocketMap.get(userID) ?? new Set();
    sockets.add(socket.id);
    userSocketMap.set(userID, sockets);

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.username);

        const sockets = userSocketMap.get(userID);
        if (sockets) {
            sockets.delete(socket.id);
            if (sockets.size === 0) {
                userSocketMap.delete(userID);
            }
        }

        io.emit("getOnlineUsers", Array.from(userSocketMap.keys));
    });
});

export { app, server, io };
