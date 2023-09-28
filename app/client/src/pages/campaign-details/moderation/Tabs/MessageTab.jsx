import "../Style.css";

const MessageTab = ({ event }) => {
  if (!event) {
    return <div>No evennt selected.</div>;
  }
  return (
    <div className="timeline-event">
      <img id="event-image" src={event.image_url} />
      <p id="event-description">{event.description}</p>
    </div>
  );
};

export default MessageTab;
