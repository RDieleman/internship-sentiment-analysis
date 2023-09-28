import Overlay from "../../Overlay.jsx";
import "./Style.css";

import LogoutIcon from "../../../../assets/icon-logout.svg";
import DashboardIcon from "../../../../assets/icon-dashboard.svg";
import AdminIcon from "../../../../assets/icon-admin.svg";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext.jsx";
import { useContext } from "react";

const SideMenuOverlay = ({ isOpen, onClose }) => {
  const { logout } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const items = [
    {
      text: "Dashboard",
      icon: DashboardIcon,
      onClick: () => navigate("/overview"),
    },
    {
      text: "Admin",
      icon: AdminIcon,
      onClick: () => navigate("/admin"),
    },
    {
      id: "menuItemLogout",
      text: "Logout",
      icon: LogoutIcon,
      onClick: () => logout(),
    },
  ];

  const contents = items.map((item) => {
    return (
      <div
        id={item.id}
        onClick={() => {
          item.onClick();
          onClose();
        }}
      >
        <img src={item.icon} />
        <p>{item.text}</p>
      </div>
    );
  });
  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="sideMenu"
      contents={<div className="sideMenuContainer">{contents}</div>}
    />
  );
};

export default SideMenuOverlay;
