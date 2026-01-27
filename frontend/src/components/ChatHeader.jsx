import { useEffect } from "react";
import { XIcon, Search } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function ChatHeader({ isSearchOpen, onToggleSearch, hasMessages }) {
    const { onlineUsers } = useAuthStore();
    const { selectedUser, setSelectedUser } = useChatStore();

    const isOnline = onlineUsers.includes(selectedUser._id);

    const handleEscKey = (e) => {
        if (e.key === "Escape") {
            if (isSearchOpen) {
                onToggleSearch();
            } else {
                setSelectedUser(null);
            }
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleEscKey);

        return () => window.removeEventListener("keydown", handleEscKey);
    }, []);

    return (
      <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
        <div className="flex items-center space-x-3">
          <div className={`avatar ${isOnline ? "online" : "offline"}`}>
            <div className="w-12 rounded-full">
              <img src={selectedUser.profilePic || "/avatar.png"} />
            </div>
          </div>

          <div>
            <h3 className="text-slate-200 font-medium">{selectedUser.username}</h3>
            <p className="text-slate-400 text-sm">{isOnline ? "Online" : "Offline"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {
            hasMessages && (
              <button
                onClick={onToggleSearch}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isSearchOpen
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                }`}
                title="Search messages"
              >
                <Search className="w-5 h-5"/>
              </button>
            )
          }

          <button
            onClick={() => setSelectedUser(null)}
            className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <XIcon className="w-5 h-5"/>
          </button>
        </div>
      </div>
    );
}

export default ChatHeader;
