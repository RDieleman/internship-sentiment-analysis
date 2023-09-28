import ListItem from "./ListItem";
import "./List.css";

function List({ items }) {
  const listItems = items.map((item, index) => {
    return <ListItem key={index} {...item} />;
  });

  return (
    <div className="list">
      {listItems.length > 0 ? (
        listItems
      ) : (
        <div className="list-empty-indicator">None.</div>
      )}
    </div>
  );
}

export default List;
