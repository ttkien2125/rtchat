import { useEffect, useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatHistory from "./ChatHistory";
import ChatHistoryPlaceholder from "./ChatHistoryPlaceholder";
import ChatMessagesLoading from "./ChatMessagesLoading";
import MessageInput from "./MessageInput";
import SearchBar from "./SearchBar";

import { useChatStore } from "../store/useChatStore";

function ChatContainer() {
    const {
        selectedUser,
        messages,
        getMessagesByUserID,
        isLoadingMessages,
        subscribeToMessages,
        unsubscribeFromMessages,
    } = useChatStore();

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getMessagesByUserID(selectedUser._id);
        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [
        getMessagesByUserID,
        selectedUser,
        subscribeToMessages,
        unsubscribeFromMessages
    ]);

    const filteredMessages = messages.filter(message => {
        if (!searchQuery) return true;

        return message.text.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
      <>
        <ChatHeader />

        {messages.length > 0 && (
          <div className="px-6 pt-4 pb-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
              placeholder="Search messages..."
            />
          </div>
        )}

        <div className="flex-1 px-6 overflow-y-auto py-8">
          {
            messages.length > 0 && !isLoadingMessages
              ? filteredMessages.length > 0
                ? <ChatHistory messages={filteredMessages} searchQuery={searchQuery} />
                : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-slate-400">
                        <p>No messages found containing "{searchQuery}"</p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="mt-2 text-cyan-500 hover:text-cyan-400 transition-colors"
                        >
                          Clear search
                        </button>
                      </div>
                    </div>
                )
              : isLoadingMessages
                ? <ChatMessagesLoading />
                : <ChatHistoryPlaceholder name={selectedUser.username} />
          }
        </div>

        <MessageInput />
      </>
    );
}

export default ChatContainer;
