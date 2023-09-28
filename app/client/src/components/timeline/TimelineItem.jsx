import BodyText from "../text/BodyText";
import "./Timeline.css";
import IconClick from "../../assets/icon-click.svg";
import IconExit from "../../assets/icon-exit.svg";
import IconMessage from "../../assets/icon-message.svg";
import Image from "../image/Image.jsx";

function TimelineItem({ _id, description, image_url, stats, onClick }) {
  const handleOnClick = () => {
    onClick(_id);
  };

  const icons = {
    completed: IconClick,
    messages: IconMessage,
    unsubscribed: IconExit,
  };

  return (
    <div key={"key-" + _id} className="timeline-item" onClick={handleOnClick}>
      <Image src={image_url} className="timeline-image" />
      <div className="timeline-item-info">
        <BodyText value={description} />
        <div className="info-indicators">
          {Object.keys(stats).map((key) => {
            const value = stats[key];

            if (value < 1) {
              return;
            }

            return (
              <div className="stat-icon">
                <img src={icons[key]} />
                <div>{value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TimelineItem;
