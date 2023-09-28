import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../contexts/SocketContext.jsx";

export function useFeedback({ selectedCampaign }) {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const message = socket.lastMessage;
    if (!message || message.type !== "feedback:status") {
      return;
    }

    fetchData();
  }, [socket.lastMessage]);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const endpoint =
        selectedCampaign == null ? "all" : `campaign/${selectedCampaign._id}`;
      const url = "/api/moderation/feedback/" + endpoint;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      const formattedFeedback = data.reduce(
        (acc, currentValue, currentIndex) => {
          if (currentValue.is_processed) {
            return acc;
          }

          acc.push({
            ...currentValue,
            creation_date: new Date(data.creation_date),
          });

          return acc;
        },
        []
      );

      setData(formattedFeedback);
    } catch (error) {
      setError(error);
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const getById = (id) => {
    return data.find((f) => f._id === id);
  };

  return { data, getById, isFetching, refresh: () => fetchData(), error };
}
