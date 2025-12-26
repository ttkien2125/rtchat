import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatContainer from "../components/ChatContainer";
import ChatPlaceholder from "../components/ChatPlaceholder";
import ChatsList from "../components/ChatsList";
import ContactsList from "../components/ContactsList";
import GradientBorderContainer from "../components/GradientBorderContainer";
import ProfileHeader from "../components/ProfileHeader";

// import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function ChatPage() {
    const { activeTab, selectedUser } = useChatStore();

    return (
      <div className="relative w-full max-w-6xl h-[600px]">
        <GradientBorderContainer>
          {/*Left widget*/}
          <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
            <ProfileHeader />
            <ActiveTabSwitch />

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {
                activeTab === "chats"
                  ? <ChatsList />
                  : <ContactsList />
              }
            </div>
          </div>

          {/*Chat window*/}
          <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
            {
              selectedUser
                ? <ChatContainer />
                : <ChatPlaceholder />
            }
          </div>
        </GradientBorderContainer>
      </div>
    );
}

export default ChatPage;
