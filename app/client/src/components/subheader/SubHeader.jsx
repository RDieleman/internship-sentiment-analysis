import { useContext } from "react";
import "./SubHeader.css";
import { useLocation, useNavigate } from "react-router-dom";
import { CampaignContext } from "../../contexts/CampaignContext.jsx";

function SubHeader() {
  const campaigns = useContext(CampaignContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isSelected = (pathname) => {
    return location.pathname.toLowerCase() === pathname.toLowerCase();
  };

  const buildItem = (url, value) => (
    <div
      id={isSelected(url) ? "option-selected" : ""}
      className="subheader-option"
      onClick={() => navigate(url)}
    >
      <span className="option-value">{value}</span>
    </div>
  );

  const id = campaigns.selectedCampaign._id;

  return (
    <div id="subheader">
      {buildItem(`/campaign/${id}/timeline`, "Timeline")}
      <div className="subheader-option option-disabled">
        <span className="option-value">Chat</span>
      </div>
      <div className="subheader-option option-disabled">
        <span className="option-value">Settings</span>
      </div>
      <div className="subheader-option option-disabled">
        <span className="option-value">Progress</span>
      </div>
      {buildItem(`/campaign/${id}/moderation`, "Moderation")}
    </div>
  );
}

export default SubHeader;
