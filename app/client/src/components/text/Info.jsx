import "./Text.css";

function Info({ value, isBold = false }) {
    let classNames = ["text-info"];

    if (isBold) {
        classNames.push("bold");
    }

    return <span className={classNames.join(" ")}>{value}</span>;
}

export default Info;
