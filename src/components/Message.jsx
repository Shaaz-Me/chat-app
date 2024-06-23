import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import singleTick from '../img/singleTick.png';
import doubleTick from '../img/doubleTick.png';
import blueTick from '../img/blueTick.png';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
        {message.senderId === currentUser.uid && <div className="messageTick">
          {(!message.status || message.status === 'SENT') && <img src={singleTick} alt="SingleTick" />}
          {(message.status && message.status === 'RECEIVED') && <img src={doubleTick} alt="DoubleTick" />}
          {(message.status && message.status === 'SEEN') && <img src={blueTick} alt="BlueTick" />}
        </div>}
      </div>
    </div>
  );
};

export default Message;
