import { create } from "zustand";
import { toast } from "react-hot-toast";

import { useAuthStore } from "./useAuthStore";

import { axiosInstance } from "../lib/axios";

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
        set({ isLoadingMessages: true });
        try {
            const res = await axiosInstance.get(`/message/${userID}`);
            set({ messages: res.data });
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
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };
        set({ messages: [ ...messages, optimisticMessage ]});

        try {
            const userID = selectedUser._id;
            const res = await axiosInstance.post(`/message/send/${userID}`, data);
            set({ messages: [ ...messages, res.data ] });
        } catch (error) {
            set({ messages: messages });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },
}));
