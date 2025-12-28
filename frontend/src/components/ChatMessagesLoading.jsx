function ChatMessagesLoading() {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {
          [[...Array(5)].map((_, index) => (
            <div key={index}
              className={`chat animate-pulse ${
                index % 2 === 0 ? "chat-start" : "chat-end"
              }`}
            >
              <div className="chat-bubble bg-slate-800 text-white w-32"></div>
            </div>
          ))]
        }
      </div>
    );
}

export default ChatMessagesLoading;
