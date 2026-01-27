import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        trim: true,
        maxlength: 5000,
    },
    image: {
        type: String,
    },
    audio: {
        type: String,
    },
    audioDuration: {
        type: Number,
    },
    encrypted: {
        type: Boolean,
        default: true,
    },
    iv: {
        type: String,
    },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;
