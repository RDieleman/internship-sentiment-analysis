import TagGroup from "../tag/TagGroup";
import BodyText from "../text/BodyText";
import Info from "../text/Info";
import Title from "../text/Title";
import "./List.css";

function ListItem({
  key = 0,
  title,
  info,
  description,
  tags,
  hasHighlight,
  onClick,
}) {
  return (
    <div
      key={key}
      className={`list-item ${hasHighlight && "list-item-highlight"}`}
      onClick={onClick}
    >
      <Title value={title} />
      <div className="info-group">
        {info.map((entry) => {
          return (
            <div className="info-container">
              <Info value={entry.label + ":"} />
              <Info value={entry.value} isBold={true} />
            </div>
          );
        })}
      </div>
      <BodyText value={description} />
      <TagGroup tags={tags} />
    </div>
  );
}

export default ListItem;
