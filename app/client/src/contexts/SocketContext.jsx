import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthenticationContext } from "./AuthenticationContext.jsx";
import { AlertContext, AlertTypes } from "./AlertContext.jsx";

const SocketContext = createContext(null);

export default function SocketProvider({ children }) {
  const { addAlert } = useContext(AlertContext);
  const { isAuthenticated } = useContext(AuthenticationContext);
  let socketRef = useRef();
  const [lastMessage, setLastMessage] = useState(null);

  const createSocketConnection = () => {
    console.log("Setting up socket connection...");
    socketRef.current = new WebSocket(
      import.meta.env.VITE_SOCKET_URL ||
        `wss://${window.location.hostname}/socket/`
    );

    socketRef.current.onclose = (event) => {
      console.log("Unexpected socket close. Attempting to reconnect...");
      addAlert(AlertTypes.INFO, "Connection lost. Attempting to reconnect... ");
      createSocketConnection();
    };

    socketRef.current.onerror = (error) => {
      console.error("Websocket encountered error: ", error);
    };

    socketRef.current.onopen = () => {
      console.log("Socket connection opened.");
    };
    socketRef.current.onmessage = (event) => {
      console.log("Socket message received.", event);
      const data = JSON.parse(event.data);
      setLastMessage(data);
    };
  };

  useEffect(() => {
    if (isAuthenticated == false) {
      return;
    }

    createSocketConnection();
  }, [isAuthenticated]);

  const sendMessage = (type, data) => {
    console.log("Sending socket message...", data);
    socketRef.current.send(
      JSON.stringify({
        type: type,
        content: data,
      })
    );
  };

  return (
    <SocketContext.Provider value={{ lastMessage, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
}

export { SocketContext };
