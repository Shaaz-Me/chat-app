import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";
import { AuthContext } from "../context/AuthContext";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (docs) => {
      if(docs.exists()){
        const allMessages = docs.data().messages;
        setMessages(allMessages);
        let isUpdated = false;
        const updatedMessages = allMessages.map(message => {
          if (message.senderId !== currentUser.uid && message.status === 'RECEIVED') {
            message['status'] = 'SEEN';
            isUpdated = true;
          }
          return message;
        });
        if (isUpdated) {
          updateDoc(doc(db, 'chats', data.chatId), {messages: updatedMessages});
        }
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId, currentUser.uid]);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
