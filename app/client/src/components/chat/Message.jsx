import "./Chat.css";

function Message({ message }) {
  return (
    <div className="message">
      <div className="message-author">{message.author}</div>
      <div className="message-content">{message.content}</div>
    </div>
  );
}

export default Message;
