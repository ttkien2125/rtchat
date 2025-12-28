import { useEffect } from "react";

import ChatsNotFound from "./ChatsNotFound";
import UsersLoading from "./UsersLoading";

import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function ChatsList() {
    const { onlineUsers } = useAuthStore();
    const { chats, getAllChats, isLoadingUsers, setSelectedUser } = useChatStore();

    useEffect(() => {
        getAllChats();
    }, [getAllChats]);

    if (isLoadingUsers) return <UsersLoading />;
    if (chats.length === 0) return <ChatsNotFound />;

    return (
      <>
        {
          chats.map(chat => (
            <div key={chat._id}
              className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
              onClick={() => setSelectedUser(chat)}
            >
              <div className="flex items-center gap-3">
                <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
                  <div className="size-12 rounded-full">
                    <img src={chat.profilePic || "/avatar.png"} />
                  </div>
                </div>
                <h4 className="text-slate-200 font-medium truncate">{chat.username}</h4>
              </div>
            </div>
          ))
        }
      </>
    );
}

export default ChatsList;
