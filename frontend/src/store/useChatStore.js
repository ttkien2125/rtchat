import { create } from "zustand";
import { toast } from "react-hot-toast";

import { useAuthStore } from "./useAuthStore";

import { axiosInstance } from "../lib/axios";
import { encryptMessage, decryptMessage, generateConversationKey } from "../lib/encryption";

export const useChatStore = create((set, get) => ({
    contacts: [],
    chats: [],
    messages: [],

    isLoadingUsers: false,
    isLoadingMessages: false,

    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")),
    activeTab: "chats",
    selectedUser: null,

    toggleSound: () => {
        const flag = !get().isSoundEnabled;
        localStorage.setItem("isSoundEnabled", flag);
        set({ isSoundEnabled: flag })
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (user) => set({ selectedUser: user }),

    getAllContacts: async () => {
        set({ isLoadingUsers: true });
        try {
            const res = await axiosInstance.get("/message/contacts");
            set({ contacts: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isLoadingUsers: false });
        }
    },

    getAllChats: async () => {
        set({ isLoadingUsers: true });
        try {
            const res = await axiosInstance.get("/message/chats");
            set({ chats: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isLoadingUsers: false });
        }
    },

    getMessagesByUserID: async (userID) => {
        const { authUser } = useAuthStore.getState();

        set({ isLoadingMessages: true });
        try {
            const res = await axiosInstance.get(`/message/${userID}`);

            const conversationKey = generateConversationKey(authUser._id, userID);
            const decryptedMessages = res.data.map(message => {
                if (message.encrypted && message.text && message.iv) {
                    return {
                        ...message,
                        text: decryptMessage(message.text, conversationKey, message.iv),
                    };
                }

                return message;
            })

            set({ messages: decryptedMessages });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isLoadingMessages: false });
        }
    },

    sendMessage: async (data) => {
        const { messages, selectedUser } = get();
        const { authUser } = useAuthStore.getState();

        const tempID = `temp-${Date.now()}`;
        const optimisticMessage = {
            _id: tempID,
            senderID: authUser._id,
            receiverID: selectedUser._id,
            text: data.text,
            image: data.image,
            audio: data.audio,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };
        set({ messages: [ ...messages, optimisticMessage ]});

        try {
            const userID = selectedUser._id;

            let encryptedData = { ...data };

            if (data.text) {
                const conversationKey = generateConversationKey(authUser._id, userID);
                const { encrypted, iv } = encryptMessage(data.text, conversationKey);

                encryptedData = {
                    ...data,
                    text: encrypted,
                    encrypted: true,
                    iv,
                };
            }

            const res = await axiosInstance.post(`/message/send/${userID}`, encryptedData);

            // Decrypt the response before adding to messages
            let newMessage = res.data;
            if (newMessage.encrypted && newMessage.text && newMessage.iv) {
                const conversationKey = generateConversationKey(authUser._id, userID);
                newMessage = {
                    ...newMessage,
                    text: decryptMessage(newMessage.text, conversationKey, newMessage.iv)
                };
            }

            set({ messages: [ ...messages, newMessage ] });
        } catch (error) {
            set({ messages: messages });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser, isSoundEnabled } = get();
        if (!selectedUser) return;

        const { socket } = useAuthStore.getState();
        socket.on("newMessage", newMessage => {
            const isCorrectUser = newMessage.senderID === selectedUser._id;
            if (!isCorrectUser) return;

            const { messages } = get();
            set({ messages: [ ...messages, newMessage ]})

            if (isSoundEnabled) {
                const notificationSound = new Audio("/sounds/notification.mp3");

                notificationSound.currentTime = 0;
                notificationSound.play().catch(error => console.error("Audio play failed:", error));
            }
        });
    },

    unsubscribeFromMessages: () => {
        const { socket } = useAuthStore.getState();
        socket.off("newMessage");
    },
}));
