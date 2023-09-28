import CustomTabs from "../../../components/tabs/CustomTabs";
import "./Timeline.css";
import MessageTab from "./Tabs/MessageTab";
import ChatTab from "./Tabs/ChatTab";

const EventDetails = ({ event }) => {
  if (!event) {
    return <div>Select an event.</div>;
  }

  const tabs = [];
  tabs.push({
    id: "MessageTab",
    title: "Message",
    content: <MessageTab event={event} />,
  });

  tabs.push({
    id: "StatisticsTab",
    title: "Statistics",
    content: <div className="timeline-statistics">Nothing, yet.</div>,
  });

  tabs.push({
    id: "ChatTab",
    title: "Chat",
    content: <ChatTab event={event} />,
  });

  return <CustomTabs label="Timeline Event Details" tabs={tabs} />;
};

export default EventDetails;
