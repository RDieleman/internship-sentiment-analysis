import Tag from "./Tag";
import "./Tag.css";

function TagGroup({ tags }) {
    return (
        <div className="tag-group">
            {tags.map((value, index) => {
                return <Tag key={index} value={value} />;
            })}
        </div>
    );
}

export default TagGroup;
