import { useContext } from "react";
import Alert from "./Alert.jsx";
import { AlertContext } from "../../contexts/AlertContext.jsx";
import "./Style.css";

const AlertContainer = () => {
  const { alerts, removeAlert } = useContext(AlertContext);

  return (
    <div className="alert-container">
      {alerts.map((alert) => {
        if (alert.active == false) {
          return;
        }

        return (
          <Alert
            alert={alert}
            remove={() => {
              removeAlert(alert.id);
            }}
          />
        );
      })}
    </div>
  );
};

export default AlertContainer;
