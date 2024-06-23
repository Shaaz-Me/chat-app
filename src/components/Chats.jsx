import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (docs) => {
        const allChats = docs.data();
        setChats(allChats);
        console.log(allChats)
        allChats && Object.entries(allChats).forEach(async (chat) => {
          const chatId = chat[0];
          const docRef = doc(db, 'chats', chatId);
          const docSnap = await getDoc(docRef);
          const allMessages = docSnap.data();
          let isUpdated = false;
          const updatedMessages = allMessages.messages.map((message) => {
            if (message.senderId !== currentUser.uid && message.status === 'SENT'){
              message['status'] = 'RECEIVED';
              isUpdated = true;
            }
            return message;
          });
          if (isUpdated) {
            await updateDoc(docRef, {messages: updatedMessages});
          }
        })
      });
      return unsub;
    };
    
    const unSub = currentUser.uid? getChats(): null;
    return () => {
      if(unSub) unSub();
    };
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div
          className="userChat"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
