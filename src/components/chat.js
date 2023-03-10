import React, { useCallback, useRef, useEffect } from "react";

import ChatBox from "../components/chatBox";
import ChatMessage from "../components/chatMessage";
import MessageBox from "../components/messageBox";

import useScaledrone from "../hooks/useScaledrone";

function Chat({ name, color }) {
  const bottomRef = useRef(null);

  //connect with scaledron
  const {drone, ROOM, messages} = useScaledrone({name, color});

  //send mess in chat
  const handleMessage = useCallback((message) => {
    if (drone && `${message}` !== "") {
      drone.publish({
        room: ROOM,
        message
      })
    }
  },[drone, ROOM]);

  // scroll up for more
  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [bottomRef, messages]);

  return (
    <>
      <ChatBox>
        {messages?.map((m) => (
          <ChatMessage 
            id={m?.id}
            name={m?.name} 
            message={m?.message} 
            color={m?.color} 
            showName={m?.showName}
            leftAlign={m?.leftAlign}/>
        ))}
      <div ref={bottomRef}></div>
      </ChatBox>
      <MessageBox onMessage={handleMessage} placeholder="Enter your message and press SEND" />
    </>
  );
}

export default Chat;
