import "../Style.css";
import Chat from "../../../../components/chat/Chat";
import useChat from "../../../../hooks/useChat";
import Loader from "../../../../components/loader/Loader.jsx";

const DiscussionTab = ({ event }) => {
  const chat = useChat({ eventId: event._id, campaignId: event.campaign_id });

  if (chat.isFetching && !chat.messages) {
    return <Loader />;
  }

  const sortedMessages = chat.messages
    .slice()
    .sort((a, b) => a.creation_date - b.creation_date);

  return (
    <Chat messages={sortedMessages} handleMessageSent={chat.sendMessage} />
  );
};

export default DiscussionTab;
