import "./CampaignOverview.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { CampaignContext } from "../../contexts/CampaignContext";
import List from "../../components/list/List";
import Loader from "../../components/loader/Loader.jsx";
import Title from "../../components/text/Title.jsx";
import TodoTable from "../../components/table/TodoTable.jsx";
import { useFeedback } from "../../hooks/useFeedback.jsx";
import { AuthenticationContext } from "../../contexts/AuthenticationContext.jsx";

function CampaignOverview() {
  const { isAuthenticated } = useContext(AuthenticationContext);
  const { campaigns, selectedCampaign, setSelectedCampaign } =
    useContext(CampaignContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const feedback = useFeedback({});

  if (!isAuthenticated) {
    navigate("/authentication");
    return <Loader />;
  }

  if (selectedCampaign != null) {
    setSelectedCampaign(null);
    return <Loader />;
  }

  if (campaigns.isFetching && !campaigns.data) {
    return <Loader />;
  }

  if (feedback.isFetching && !feedback.data) {
    return <Loader />;
  }

  const handleOnItemClick = (campaign) => {
    navigate(`/campaign/` + campaign._id);
  };

  const campaignDataWithUrgencyIndicator = !campaigns.data
    ? []
    : campaigns.data.map((c) => {
        const hasUrgency =
          feedback.data.findIndex(
            (f) =>
              f.campaign_id === c._id &&
              Object.hasOwn(f, "analysis") &&
              f.analysis != null &&
              f.analysis.has_urgency == true
          ) !== -1;
        return {
          ...c,
          has_urgency: hasUrgency,
        };
      });

  const listItems = campaignDataWithUrgencyIndicator.map((c) => {
    const tags = [];

    if (c.is_archived) {
      tags.push("Archived");
    }

    return {
      ...c,
      tags,
      info: [],
      hasHighlight: c.has_urgency,
      onClick: () => handleOnItemClick(c),
    };
  });

  const handleTodoSelect = (id) => {
    const selectedFeedback = feedback.data.find((f) => f._id == id);
    if (!selectedFeedback) {
      console.error("Selected feedback is empty.");
      return;
    }
    navigate(
      `/campaign/${selectedFeedback.campaign_id}/moderation?feedbackId=${selectedFeedback._id}`
    );
    return <Loader />;
  };

  return (
    <>
      <div id="app-content">
        <div id="page" className="campaigns-page">
          <div className="campaign-page-scroll">
            <div className="campaigns-page-content">
              <div>
                <Title value="Todo" />
                <hr />
                <TodoTable
                  items={feedback.data}
                  onSelectionChange={(id) => handleTodoSelect(id)}
                />
              </div>
              <div>
                <Title value="Campaigns" />
                <hr />
                <List items={listItems} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CampaignOverview;
