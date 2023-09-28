import "../Timeline.css";
import Chat from "../../../../components/chat/Chat";
import useChat from "../../../../hooks/useChat";
import Loader from "../../../../components/loader/Loader.jsx";
import { useContext, useEffect } from "react";
import {
  AlertContext,
  AlertTypes,
} from "../../../../contexts/AlertContext.jsx";

const ChatTab = ({ event }) => {
  const { addAlert } = useContext(AlertContext);
  const chat = useChat({ eventId: event._id, campaignId: event.campaign_id });

  useEffect(() => {
    if (chat.error == null) {
      return;
    }

    addAlert(AlertTypes.ERROR, "Failed to retrieve chat messages.");
  }, [chat.error]);

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

export default ChatTab;
