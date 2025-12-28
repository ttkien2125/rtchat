import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketID } from "../lib/socket.js";

import Message from "../models/Message.js";
import User from "../models/User.js";

export const contacts = async (req, res) => {
    try {
        const currentID = req.user._id;
        const filteredUsers =
            await User.find({ _id: { $ne: currentID } })
                .select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in contacts controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const chats = async (req, res) => {
    try {
        const currentID = req.user._id;

        const messages = await Message.find({
            $or: [{ senderID: currentID }, { receiverID: currentID }],
        });

        const partnerIDs = [...new Set(messages.map(message =>
            message.senderID.toString() === currentID.toString()
                ? message.receiverID.toString()
                : message.senderID.toString()
        ))];

        const partners =
            await User.find({ _id: { $in: partnerIDs } }).select("-password");
        res.status(200).json(partners);
    } catch (error) {
        console.error("Error in chats controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const messagesByUserID = async (req, res) => {
    try {
        const currentID = req.user._id;
        const { id: otherID } = req.params;

        const messages = await Message.find({
            $or: [
                { senderID: currentID, receiverID: otherID },
                { senderID: otherID, receiverID: currentID },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in messagesByUserID controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image, audio, audioDuration } = req.body;

        if (!text && !image && !audio) {
            return res.status(400)
                .json({ message: "Text, image, or audio is required" });
        }

        const senderID = req.user._id;
        const { id: receiverID } = req.params;

        if (senderID.equals(receiverID)) {
            return res.status(400)
                .json({ message: "Cannot send messages to yourself" });
        }

        const receiverExists = await User.exists({ _id: receiverID });
        if (!receiverExists) {
            return res.status(400)
                .json({ message: "Receiver not found" });
        }

        let imageURL;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }

        let audioURL;
        if (audio) {
            const uploadResponse = await cloudinary.uploader.upload(audio, {
                resource_type: "video",
                format: "mp3",
            });
            audioURL = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderID,
            receiverID,
            text,
            image: imageURL,
            audio: audioURL,
            audioDuration,
        });

        await newMessage.save();

        const receiverSocketID = getReceiverSocketID(receiverID);
        if (receiverSocketID) {
            io.to(receiverSocketID).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
