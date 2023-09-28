import "./Chat.css";

function Reference({ message }) {
  return (
    <div className="message">
      <div className="message-author">{message.author}</div>
      <div className="message-content message-ref">
        <div>{message.ref_type}</div>
        <div>{message.ref_id}</div>
      </div>
    </div>
  );
}

export default Reference;
