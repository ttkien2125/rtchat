import { create } from "zustand";

export const useAuthStore = create((set) => ({
    authUser: { _id: 123, name: "John", age: 25 },
    isLoggedIn: false,

    login: () => {
        console.log("Logged in");
        set({ isLoggedIn: true });
    },
}));
