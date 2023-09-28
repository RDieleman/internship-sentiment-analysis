import { createContext, useState } from "react";

export const AlertContext = createContext();

export const AlertTypes = {
  ERROR: "type:error",
  INFO: "type:info",
  SUCCESS: "type:success",
};

export function AlertContextProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (type, message, autoRemove = false) => {
    const id = crypto.randomUUID();

    const alert = {
      id,
      type,
      message,
      active: true,
    };

    setAlerts((prevAlerts) => [...prevAlerts, alert]);

    if (autoRemove) {
      setTimeout(() => {
        removeAlert(id);
      }, 5000);
    }
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((a) => (a.id == id ? { ...a, active: false } : a))
    );
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
}
