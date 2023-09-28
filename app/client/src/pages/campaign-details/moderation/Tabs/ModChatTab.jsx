import "../Style.css";
import Chat from "../../../../components/chat/Chat";
import useChat from "../../../../hooks/useChat";
import Loader from "../../../../components/loader/Loader.jsx";
import { useContext, useState } from "react";
import { CampaignContext } from "../../../../contexts/CampaignContext.jsx";

const ModChatTab = ({ feedback }) => {
  const campaign = useContext(CampaignContext);
  const [refItems, setRefItems] = useState([]);

  const chat = useChat({
    feedbackId: feedback._id,
    eventId: feedback.event_id,
    campaignId: feedback.campaign_id,
  });

  if (chat.isFetching && !chat.messages) {
    return <Loader />;
  }

  const handleQueryChange = (query) => {
    let items = campaign.selectedCampaign.participant_ids.filter((id) =>
      id.includes(query)
    );

    setRefItems(
      items.map((id) => {
        return {
          type: "Person",
          description: id,
          id: id,
        };
      })
    );
  };

  const sortedMessages = chat.messages
    .slice()
    .sort((a, b) => a.creation_date - b.creation_date);

  return (
    <Chat
      messages={sortedMessages}
      handleMessageSent={chat.sendMessage}
      refItems={refItems}
      onRefQueryChange={handleQueryChange}
    />
  );
};

export default ModChatTab;
