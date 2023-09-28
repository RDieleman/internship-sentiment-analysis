import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "./SocketContext.jsx";

export const NotificationContext = createContext();

export function NotificationContextProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const data = socket.lastMessage;
    if (!data || data.type !== "notification:receive") {
      return;
    }

    const notification = {
      ...data.content,
      was_seen: false,
    };

    setNotifications((prev) => [notification, ...prev]);
  }, [socket.lastMessage]);

  const markAllAsSeen = () => {
    const updatedNotifications = notifications.map((notification) => {
      return { ...notification, was_seen: true };
    });

    setNotifications(updatedNotifications);
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAllAsSeen }}>
      {children}
    </NotificationContext.Provider>
  );
}
