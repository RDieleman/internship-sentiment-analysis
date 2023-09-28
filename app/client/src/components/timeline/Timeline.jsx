import TimelineItem from "./TimelineItem";
import "./Timeline.css";
import IconInfoTheme from "../../assets/icon-info-theme.svg";
import IconInfoBlack from "../../assets/icon-info-black.svg";
import IconQuestionTheme from "../../assets/icon-question-theme.svg";
import IconQuestionBlack from "../../assets/icon-question-black.svg";
import IconHourglassTheme from "../../assets/icon-hourglass-theme.svg";
import IconHourglassBlack from "../../assets/icon-hourglass-black.svg";
import IconStudyTheme from "../../assets/icon-study-theme.svg";
import IconStudyBlack from "../../assets/icon-study-black.svg";

function Timeline({ events }) {
  const icons = {
    info: {
      past: IconInfoBlack,
      future: IconInfoTheme,
    },
    question: {
      past: IconQuestionBlack,
      future: IconQuestionTheme,
    },
    learn: {
      past: IconStudyBlack,
      future: IconStudyTheme,
    },
    wait: {
      past: IconHourglassBlack,
      future: IconHourglassTheme,
    },
  };

  const getTypeIcon = (event) => {
    let icon = icons[event.type];

    if (!icon) {
      console.error("Icon not found", event);
      icon = icons["question"];
    }

    return event.isPosted ? icon.past : icon.future;
  };

  return (
    <div className="timeline">
      <div className="line-container">
        {events.map((element) => {
          const classes = ["indicator-container"];
          if (!element.isPosted) {
            classes.push("event-future");
          }

          return (
            <div className={classes.join(" ")}>
              <div className="line-indicator">
                <img src={getTypeIcon(element)} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="event-container">
        {events.map((event) => {
          return <TimelineItem {...event} />;
        })}
      </div>
    </div>
  );
}

export default Timeline;
