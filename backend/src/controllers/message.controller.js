import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

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
        const { text, image } = req.body;

        const senderID = req.user._id;
        const { id: receiverID } = req.params;

        let imageURL;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderID,
            receiverID,
            text,
            image: imageURL,
        });

        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
