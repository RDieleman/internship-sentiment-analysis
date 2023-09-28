import { useState } from "react";

export function useModeration() {
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  const setAssigned = async () => {
    if (!selectedFeedback) {
      return;
    }

    try {
      setIsFetching(true);
      const response = await fetch(
        "/api/moderation/feedback/" + selectedFeedback._id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...selectedFeedback,
            is_assigned: !selectedFeedback.is_assigned,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsFetching(false);
    }
  };

  const setHandled = async () => {
    if (!selectedFeedback) {
      return;
    }

    try {
      setIsFetching(true);
      const response = await fetch(
        "/api/moderation/feedback/" + selectedFeedback._id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...selectedFeedback,
            is_processed: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsFetching(false);
    }
  };

  return {
    selectedFeedback,
    setSelectedFeedback,
    isFetching,
    error,
    setHandled,
    setAssigned,
  };
}
