import { useContext, useEffect, useState } from "react";
import Timeline from "../../../components/timeline/Timeline";
import "./Timeline.css";
import { useSearchParams } from "react-router-dom";
import EventDetails from "./EventDetails";
import Overlay from "../../../components/overlay/Overlay";
import { useEvents } from "../../../hooks/useEvents.jsx";
import Loader from "../../../components/loader/Loader.jsx";
import { AlertContext, AlertTypes } from "../../../contexts/AlertContext.jsx";

function TimelinePage() {
  const { addAlert } = useContext(AlertContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Retrieve event data.
  const timeline = useEvents();

  useEffect(() => {
    if (timeline.error == null) {
      return;
    }

    addAlert(AlertTypes.ERROR, "Failed to retrieve events.");
  }, [timeline.error]);

  if (timeline.isFetching) {
    return <Loader />;
  }

  // If present, get the selected event from the url.
  const eventId = searchParams.get("eventId");

  // If no event is provided, reset the stored event.
  const anEventIsProvided = eventId != null;
  if (!anEventIsProvided && selectedEvent != null) {
    setSelectedEvent(null);
    return <Loader />;
  }

  // If the stored event is different, overwrite it.
  const storedEventIsDifferent =
    selectedEvent == null || selectedEvent._id !== eventId;
  if (anEventIsProvided && storedEventIsDifferent) {
    const event = timeline.getById(eventId);
    setSelectedEvent(event);
    return <Loader />;
  }

  const handleOverlayClose = () => {
    searchParams.delete("eventId");
    setSearchParams(searchParams);
  };

  const handleOnEventClick = (event) => {
    searchParams.append("eventId", event._id);
    setSearchParams(searchParams);
  };

  const determineIsPosted = (event) => {
    const dateNow = new Date();
    return event.post_date.getTime() <= dateNow.getTime();
  };

  const formattedEvents = timeline.data.map((e) => {
    return {
      ...e,
      isPosted: determineIsPosted(e),
      stats: {},
      onClick: () => handleOnEventClick(e),
    };
  });

  const eventIsSelected = selectedEvent != null;

  return (
    <>
      <div id="page" className="timeline-page">
        <Timeline events={formattedEvents} />
      </div>
      <Overlay
        contents={<EventDetails event={selectedEvent} />}
        isOpen={eventIsSelected}
        showCloseButton={true}
        onClose={handleOverlayClose}
      />
    </>
  );
}

export default TimelinePage;
