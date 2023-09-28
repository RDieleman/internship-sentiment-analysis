import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../contexts/SocketContext";

function useChat({ campaignId, eventId = null, feedbackId = null }) {
  const [messages, setMessages] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const data = socket.lastMessage;
    if (!data || data.type !== "chat:receive") {
      return;
    }

    if (
      data.content.event_id != eventId ||
      data.content.feedback_id != feedbackId ||
      data.content.campaign_id != campaignId
    ) {
      return;
    }

    const message = {
      ...data.content,
      creation_date: new Date(data.content.creation_date),
      author: "Anonymous",
    };

    setMessages((prevMessages) => [...prevMessages, message]);
  }, [socket.lastMessage]);

  useEffect(() => {
    setMessages([]);
    setError(null);
    setIsFetching(false);
    fetchMessages();
  }, [eventId]);

  const fetchMessages = async () => {
    setIsFetching(true);
    try {
      let url = "/api/chat/" + campaignId;

      if (eventId != null) {
        url += `?eventId=${eventId}`;

        if (feedbackId != null) {
          url += `&feedbackId=${feedbackId}`;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();

      const fetchedMessages = data.reduce((acc, currentValue, currentIndex) => {
        const message = {
          ...currentValue,
          creation_date: new Date(currentValue.creation_date),
          author: "Anonymous",
        };

        acc.push(message);
        return acc;
      }, []);
      setMessages(fetchedMessages);
      setIsFetching(false);
    } catch (error) {
      setError(error);
      setIsFetching(false);
    }
  };

  const sendMessage = (message, ref) => {
    socket.sendMessage("chat:send", {
      content: message,
      feedback_id: feedbackId,
      event_id: eventId,
      campaign_id: campaignId,
      is_ref: ref.is_ref,
      ref_type: ref.ref_type,
      ref_id: ref.ref_id,
    });
  };

  return { messages, sendMessage, fetchMessages, isFetching, error };
}

export default useChat;
