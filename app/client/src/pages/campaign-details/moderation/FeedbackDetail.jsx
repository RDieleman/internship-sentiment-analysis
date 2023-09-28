import CustomTabs from "../../../components/tabs/CustomTabs";
import "./Style.css";
import MessageTab from "./Tabs/MessageTab";
import { useEvents } from "../../../hooks/useEvents";
import InsightsTab from "./Tabs/InsightsTab";
import DiscussionTab from "./Tabs/DiscussionTab";
import { useContext, useEffect } from "react";
import { AlertContext, AlertTypes } from "../../../contexts/AlertContext.jsx";
import ModChatTab from "./Tabs/ModChatTab.jsx";

const FeedbackDetails = ({ feedback }) => {
  if (!feedback) {
    return <div>Select feedback.</div>;
  }

  const { addAlert } = useContext(AlertContext);
  const events = useEvents();

  useEffect(() => {
    if (events.error == null) {
      return;
    }

    addAlert(AlertTypes.ERROR, "Failed to retrieve events.");
  }, [events.error]);

  const event = events.data.find((obj) => {
    return obj._id === feedback.event_id;
  });

  const tabs = [];
  tabs.push({
    id: "InsightsTab",
    title: "Insights",
    content: <InsightsTab feedback={feedback} />,
  });

  tabs.push({
    id: "MessageTab",
    title: "Event",
    content: <MessageTab event={event} />,
  });

  tabs.push({
    id: "EventChatTab",
    title: "Chat",
    content: <DiscussionTab event={event} />,
  });

  tabs.push({
    id: "ModChatTab",
    title: "Discussion",
    content: <ModChatTab feedback={feedback} />,
  });

  return <CustomTabs label="Timeline Event Details" tabs={tabs} />;
};

export default FeedbackDetails;
