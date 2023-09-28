import "./Tag.css";

function Tag({ value, key = 0 }) {
    return (
        <div key={key} className="tag">
            {value}
        </div>
    );
}

export default Tag;
