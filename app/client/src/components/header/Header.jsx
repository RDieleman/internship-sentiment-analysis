import { useContext, useEffect, useState } from "react";
import "./Header.css";
import CustomLogo from "../../assets/logo.svg";
import IconAccount from "../../assets/icon-account.svg";
import IconBell from "../../assets/icon-bell.svg";
import IconHelp from "../../assets/icon-help.svg";
import IconMenu from "../../assets/icon-hamburger.svg";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../contexts/NotificationContext.jsx";
import {
  CustomMenuButton,
  CustomMenuItem,
} from "../popover-menu/CustomPopoverMenu.jsx";

function Header({ onOpenMenu }) {
  const { notifications, markAllAsSeen } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const unseenNotifications = notifications.filter((f) => !f.was_seen);
  const showNotificationIndicator = unseenNotifications.length > 0;

  useEffect(() => {
    if (!popoverOpen) {
      markAllAsSeen();
    }
  }, [popoverOpen]);

  return (
    <div id="header">
      <div id="header-content-start">
        <img
          src={IconMenu}
          id="icon-menu"
          className="header-icon"
          onClick={() => onOpenMenu()}
        />
        <img
          src={CustomLogo}
          id="icon-custom"
          alt="Custom Logo"
          onClick={() => navigate("/overview")}
        />
      </div>
      <div id="header-content-end">
        <img className="header-icon" src={IconAccount} />
        <div>
          <CustomMenuButton
            isOpen={popoverOpen}
            onOpenChange={setPopoverOpen}
            label={
              <img className="header-icon" id="icon-bell" src={IconBell} />
            }
          >
            {notifications.map((notification) => {
              return (
                <CustomMenuItem>
                  <div
                    className={`notification-body ${
                      notification.was_seen ? "" : "notification-unseen"
                    }`}
                    onClick={() =>
                      navigate(
                        `/campaign/${notification.campaign_id}/moderation?feedbackId=${notification.feedback_id}`
                      )
                    }
                  >
                    <h3 className="notification-title">Notification</h3>
                    <p className="notification-content">
                      {notification.content}
                    </p>
                  </div>
                </CustomMenuItem>
              );
            })}
          </CustomMenuButton>

          {showNotificationIndicator && (
            <div
              onClick={(e) => {
                setPopoverOpen((prev) => !prev);
              }}
              className="icon-indicator"
            >
              {unseenNotifications.length}
            </div>
          )}
        </div>
        <img className="header-icon" id="icon-help" src={IconHelp} />
      </div>
    </div>
  );
}

export default Header;
