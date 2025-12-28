import { create } from "zustand";
import { toast } from "react-hot-toast";

import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
    contacts: [],
    chats: [],
    messages: [],
    isLoadingUsers: false,
    isLoadingMessages: false,

    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")),
    toggleSound: () => {
        const flag = !get().isSoundEnabled;
        localStorage.setItem("isSoundEnabled", flag);
        set({ isSoundEnabled: flag })
    },

    activeTab: "chats",
    setActiveTab: (tab) => set({ activeTab: tab }),

    selectedUser: null,
    setSelectedUser: (user) => set({ selectedUser: user }),

    getAllContacts: async () => {
        set({ isLoadingUsers: true });
        try {
            const res = await axiosInstance.get("/message/contacts");
            set({ contacts: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
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
            toast.error(error.response.data.message);
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
            toast.error(error.response.data.message);
        } finally {
            set({ isLoadingMessages: false });
        }
    },
}));
