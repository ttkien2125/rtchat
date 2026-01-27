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
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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

    useEffect(() => {
        setSearchQuery("");
        setIsSearchOpen(false);
    }, [selectedUser._id]);

    const filteredMessages = messages.filter(message => {
        if (!searchQuery) return true;

        return message.text.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleToggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isSearchOpen) {
            setSearchQuery("");
        }
    };

    return (
      <>
        <ChatHeader
          isSearchOpen={isSearchOpen}
          onToggleSearch={handleToggleSearch}
          hasMessages={messages.length > 0}
        />

        {isSearchOpen && messages.length > 0 && (
          <div className="px-6 pt-4 pb-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
              placeholder="Search messages..."
            />
            {searchQuery && (
              <p className="text-xs text-slate-400 mt-2">
                Found {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        <div className="flex-1 px-6 overflow-y-auto py-8">
          {
            messages.length > 0 && !isLoadingMessages
              ? filteredMessages.length > 0
                ? <ChatHistory messages={filteredMessages} searchQuery={searchQuery} />
                : <p className="flex items-center justify-center h-full">No results found</p>
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
