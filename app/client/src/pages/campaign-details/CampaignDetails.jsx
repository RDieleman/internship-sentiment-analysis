import { Outlet, useNavigate, useParams } from "react-router-dom";
import SubHeader from "../../components/subheader/SubHeader.jsx";
import { useContext } from "react";
import { CampaignContext } from "../../contexts/CampaignContext.jsx";
import Loader from "../../components/loader/Loader.jsx";
import { AuthenticationContext } from "../../contexts/AuthenticationContext.jsx";

function CampaignDetails() {
  const { isAuthenticated } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const { campaigns, setSelectedById } = useContext(CampaignContext);

  const { campaignId } = useParams();

  // Go back to home if no camapaign is selected.
  if (!isAuthenticated) {
    navigate("/authentication");
    return <Loader />;
  }

  if (!campaignId) {
    navigate("/");
    return <Loader />;
  }

  if (campaigns.isFetching && !campaigns.data) {
    return <Loader />;
  }

  setSelectedById(campaignId);
  return (
    <>
      <SubHeader />
      <div id="app-content">
        <Outlet />
      </div>
    </>
  );
}

export default CampaignDetails;
