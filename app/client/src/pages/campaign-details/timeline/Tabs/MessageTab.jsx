import ImageContainer from "../../../../components/image/Image.jsx";
import "../Timeline.css";

const MessageTab = ({ event }) => {
  if (!event) {
    return <div>No evennt selected.</div>;
  }
  return (
    <div className="timeline-event">
      <ImageContainer className="event-image" src={event.image_url} />
      <p id="event-description">{event.description}</p>
    </div>
  );
};

export default MessageTab;
