import { useEffect } from "react";

import UsersLoading from "./UsersLoading";

import { useChatStore } from "../store/useChatStore";

function ContactsList() {
    const { contacts, getAllContacts, isLoadingUsers, setSelectedUser } = useChatStore();

    useEffect(() => {
        getAllContacts();
    }, [getAllContacts]);

    if (isLoadingUsers) return <UsersLoading />;

    return (
      <>
        {
          contacts.map(contact => (
            <div key={contact._id}
              className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
              onClick={() => setSelectedUser(contact)}
            >
              <div className="flex items-center gap-3">
                <div className="avatar online">
                  <div className="size-12 rounded-full">
                    <img src={contact.profilePic || "/avatar.png"} />
                  </div>
                </div>
                <h4 className="text-slate-200 font-medium truncate">{contact.username}</h4>
              </div>
            </div>
          ))
        }
      </>
    );
}

export default ContactsList;
