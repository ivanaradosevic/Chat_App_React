import { useState, useEffect, useRef } from "react";

const ROOM = "observable-room";
const CHANNEL_ID = "SBdjBUCFNdjw6kGD";

function useScaledrone({name, color}) {
  const drone = useRef(null);
  const room = useRef(null);
  const allMessages = useRef(null);

  const [member, setMember] = useState(undefined);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (name && color) {
      const data = {
        name,
        color
      }
      setMember(data);
      
      // open scaledrone connection
      drone.current = new window.Scaledrone(CHANNEL_ID, { data });
      drone.current.on('open', error => {
        if (error) {
          return console.error(error);
        }
        console.log('Successfully connected to Scaledrone');

        const _member = {...member};
        _member.clientId = drone?.current?.clientId;
        setMember(_member);

        // log in chat room
        room.current = drone.current.subscribe(ROOM);
        room.current.on('open', error => {
          if (error) {
            return console.error(error);
          }
          console.log('Successfully joined room');
        });
      });
      
      // close scaledrone
      const droneCurrent = drone.current;
      return () => {
        droneCurrent.close();
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    if (room?.current) {
      room?.current.on('message', (m) => {
        // current username and color
        let currentMessageName = `${m?.member?.clientData?.name}`;
        let currentMessageColor = `${m?.member?.clientData?.color}`;
  
        // always show name
        let showName = true;
        if (allMessages?.current?.length > 0) {
          let lastMessageName = `${allMessages?.current?.[allMessages?.current?.length - 1]?.name}`;
          let lastMessageColor = `${allMessages?.current?.[allMessages?.current?.length - 1]?.color}`;
          if (lastMessageName === currentMessageName && 
              lastMessageColor === currentMessageColor) {
            showName = false;
          }
        }
  
        // show right or left
        let leftAlign = false;
        if (currentMessageColor !== `${color}` || 
            currentMessageName !== `${name}`) {
          leftAlign = true;
        }
  
        // collect all mess
        let _allMessages = allMessages.current ? [...allMessages.current] : [];
        _allMessages.push({
          name: m?.member?.clientData?.name, 
          color: m?.member?.clientData?.color, 
          message: m?.data, 
          showName, 
          leftAlign
        });
        allMessages.current = [..._allMessages];
        setMessages(allMessages?.current);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[room?.current, setMessages, color, name]);

  return { drone: drone?.current, ROOM, messages };
}

export default useScaledrone;
