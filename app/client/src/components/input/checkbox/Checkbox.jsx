import BodyText from "../../text/BodyText";
import "./Checkbox.css";

function Checkbox({ id, value, isChecked, isDisabled = false, handleChange }) {
    const onChange = (event) => {
        handleChange(id, event.target.checked);
    };

    return (
        <div className="checkbox" key={id}>
            <input
                className="checkbox-input"
                name={id}
                type="checkbox"
                checked={isChecked}
                disabled={isDisabled}
                onChange={onChange}
            />
            <BodyText value={value} />
        </div>
    );
}

export default Checkbox;
