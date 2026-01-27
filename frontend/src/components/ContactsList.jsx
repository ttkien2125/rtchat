import { useEffect, useState } from "react";

import UsersLoading from "./UsersLoading";
import SearchBar from "./SearchBar";

import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function ContactsList() {
    const { onlineUsers } = useAuthStore();
    const { contacts, getAllContacts, isLoadingUsers, setSelectedUser } = useChatStore();
    const [ searchQuery, setSearchQuery ] = useState("");

    useEffect(() => {
        getAllContacts();
    }, [getAllContacts]);

    // Filter contacts based on search query
    const filteredContacts = contacts.filter((contact) =>
        contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoadingUsers) return <UsersLoading />;

    return (
      <>
        <div className="mb-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search contacts..."
          />
        </div>
        {
          filteredContacts.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <p>No contacts named {searchQuery && ` "${searchQuery}"`}</p>
            </div>
          ) : (
            contacts.map(contact => (
              <div key={contact._id}
                className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
                onClick={() => setSelectedUser(contact)}
              >
                <div className="flex items-center gap-3">
                  <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
                    <div className="size-12 rounded-full">
                      <img src={contact.profilePic || "/avatar.png"} />
                    </div>
                  </div>
                  <h4 className="text-slate-200 font-medium truncate">{contact.username}</h4>
                </div>
              </div>
            ))
          )
        }
      </>
    );
}

export default ContactsList;
