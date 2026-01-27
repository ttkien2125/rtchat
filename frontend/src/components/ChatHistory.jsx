import { useEffect, useRef } from "react";

import AudioPlayer from "./AudioPlayer";

import { useAuthStore } from "../store/useAuthStore";

// Helper function to highlight matching text
function highlightText(text, searchQuery) {
    if (!searchQuery || !text) return text;

    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
        regex.test(part) ? (
            <mark key={index} className="bg-yellow-500/30 text-yellow-200 rounded px-0.5">
                {part}
            </mark>
        ) : (
            part
        )
    );
}

function ChatHistory({ messages, searchQuery = "" }) {
    const { authUser } = useAuthStore();

    const messageEndRef = useRef(null);

    useEffect(() => {
        if (messageEndRef.current && !searchQuery) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, searchQuery]);

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
                {
                  message.audio &&
                  <div className="my-2">
                    <AudioPlayer audioURL={message.audio} duration={message.audioDuration}/>
                  </div>
                }
                {message.text && <p className="mt-2">{
                  searchQuery ? highlightText(message.text, searchQuery) : message.text
                }</p>}
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
