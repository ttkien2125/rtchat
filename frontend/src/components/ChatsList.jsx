import { useEffect, useState } from "react";

import ChatsNotFound from "./ChatsNotFound";
import UsersLoading from "./UsersLoading";
import SearchBar from "./SearchBar";

import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function ChatsList() {
    const { onlineUsers } = useAuthStore();
    const { chats, getAllChats, isLoadingUsers, setSelectedUser } = useChatStore();
    const [ searchQuery, setSearchQuery ] = useState("");

    useEffect(() => {
        getAllChats();
    }, [getAllChats]);

    // Filter chats based on search query
    const filteredChats = chats.filter((chat) =>
        chat.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoadingUsers) return <UsersLoading />;

    return (
      <>
        {/* Search bar for chats */}
        <div className="mb-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search chats..."
          />
        </div>
        {
          filteredChats.length === 0 ? (
            searchQuery ? (
              <div className="text-center text-slate-400 py-8">
                <p>No chats found for "{searchQuery}"</p>
              </div>
            ) : (
              <ChatsNotFound />
            )
          ) : (
            filteredChats.map(chat => (
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
          )
        }
      </>
    );
}

export default ChatsList;
