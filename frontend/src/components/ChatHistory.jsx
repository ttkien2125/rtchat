import { useEffect, useRef } from "react";

import { useAuthStore } from "../store/useAuthStore";

function ChatHistory({ messages }) {
    const { authUser } = useAuthStore();

    const messageEndRef = useRef(null);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {
          messages.map(message => (
            <div key={message._id}
              className={`chat ${
                message.senderID === authUser._id
                  ? "chat-end"
                  : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble relative ${
                  message.senderID === authUser._id
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                {
                  message.image &&
                  <img src={message.image} className="rounded-lg h-48 object-cover" />
                }
                {message.text && <p className="mt-2">{message.text}</p>}
                <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                  {
                    new Date(message.createdAt).toLocaleTimeString([],
                      { hour: "2-digit", minute: "2-digit" }
                    )
                  }
                </p>
              </div>
            </div>
          ))
        }
        <div ref={messageEndRef} />
      </div>
    );
}

export default ChatHistory;
