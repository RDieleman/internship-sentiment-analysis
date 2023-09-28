import { useContext, useEffect, useState } from "react";
import { CampaignContext } from "../contexts/CampaignContext";

export function useEvents() {
  const { selectedCampaign } = useContext(CampaignContext);
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(
        "/api/campaigns/events/" + selectedCampaign._id
      );
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();

      const events = data.reduce((acc, currentValue, currentIndex) => {
        const event = {
          ...currentValue,
          post_date: new Date(currentValue.post_date),
        };

        acc.push(event);
        return acc;
      }, []);

      setData(events);
    } catch (error) {
      setError(error);
    } finally {
      setIsFetching(false);
    }
  };

  const getById = (id) => {
    return data.find((e) => e._id === id);
  };

  return { data, getById, isFetching, refresh: () => fetchData(), error };
}
