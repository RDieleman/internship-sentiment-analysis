import { useEffect, useState } from "react";
import "./Style.css";
import classNames from "classnames";
import { AlertTypes } from "../../contexts/AlertContext.jsx";
import IconAlertError from "../../assets/icon-circle-error.svg";
import IconAlertInfo from "../../assets/icon-circle-info.svg";
import IconAlertSuccess from "../../assets/icon-circle-success.svg";

const Alert = ({ alert, remove }) => {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      close();
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  const close = () => {
    setExit(true);
    setTimeout(remove, 400); // Delay should match transition duration.
  };

  let icon = IconAlertInfo;
  if (alert.type == AlertTypes.ERROR) {
    icon = IconAlertError;
  } else if (alert.type == AlertTypes.SUCCESS) {
    icon = IconAlertSuccess;
  }

  const className = classNames("alert", {
    error: alert.type == AlertTypes.ERROR,
    info: alert.type == AlertTypes.INFO,
    success: alert.type == AlertTypes.SUCCESS,
    exit: exit == true,
  });

  return (
    <div key={alert.id} className={className} onClick={() => close()}>
      <img src={icon} />
      <div>{alert.message}</div>
    </div>
  );
};

export default Alert;
