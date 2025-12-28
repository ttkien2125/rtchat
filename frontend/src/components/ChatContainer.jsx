import { useEffect } from "react";

import ChatHeader from "./ChatHeader";
import ChatHistory from "./ChatHistory";
import ChatHistoryPlaceholder from "./ChatHistoryPlaceholder";
import ChatMessagesLoading from "./ChatMessagesLoading";
import MessageInput from "./MessageInput";

import { useChatStore } from "../store/useChatStore";

function ChatContainer() {
    const { selectedUser, messages, getMessagesByUserID, isLoadingMessages } = useChatStore();

    useEffect(() => {
        getMessagesByUserID(selectedUser._id);
    }, [getMessagesByUserID, selectedUser]);

    return (
      <>
        <ChatHeader />

        <div className="flex-1 px-6 overflow-y-auto py-8">
          {
            messages.length > 0 && !isLoadingMessages
              ? <ChatHistory messages={messages} />
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
