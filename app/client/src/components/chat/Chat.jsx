import { useEffect, useRef, useState } from "react";
import "./Chat.css";
import IconSent from "../../assets/icon-sent.svg";
import Message from "./Message";
import classNames from "classnames";
import Reference from "./Reference.jsx";

function Chat({
  messages = [],
  handleMessageSent,
  refItems = [],
  onRefQueryChange = (query) =>
    console.log("No function to handle query: ", query),
}) {
  const [text, setText] = useState("");
  const ENTER_KEY_CODE = 13;

  const scrollRef = useRef(null);
  const hasRendered = useRef(false);

  const inRefSelection =
    text != "" && text.startsWith("@") && refItems.length > 0;

  useEffect(() => {
    if (!hasRendered.current && inRefSelection) {
      hasRendered.current = true;
    }

    if (text != "" && text.startsWith("@")) {
      onRefQueryChange(text.slice(1));
    }
  }, [text]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTextChanged = (e) => {
    setText(e.target.value);
  };

  const handleKeyPressed = (e) => {
    if (e.keyCode != ENTER_KEY_CODE) {
      return;
    }
    handleSentPressed();
  };

  const handleSentPressed = () => {
    if (text.length < 1) {
      return;
    }

    handleMessageSent(text, {
      is_ref: false,
      ref_type: null,
      ref_id: null,
    });
    setText("");
  };

  const handleRefSelected = (item) => {
    if (item == null) {
      setRef({
        is_ref: false,
        ref_type: null,
        ref_id: null,
      });
      return;
    }

    handleMessageSent(text, {
      is_ref: true,
      ref_type: item.type,
      ref_id: item.id,
    });
    setText("");
  };

  let refSelectionContent = <div>Nothing found.</div>;
  if (refItems.length > 0) {
    refSelectionContent = refItems.map((item) => (
      <div onClick={() => handleRefSelected(item)}>
        <p>{item.type}</p>
        <p>{item.description}</p>
      </div>
    ));
  }

  return (
    <div id="chat-container">
      <div id="messages-container" ref={scrollRef}>
        {messages.map((message) => {
          if (message.is_ref) {
            return <Reference message={message} />;
          } else {
            return <Message message={message} />;
          }
        })}
      </div>
      <div id="sent-container">
        <div
          className={classNames("message-info-container", {
            open: inRefSelection,
            closed: !inRefSelection && hasRendered.current,
          })}
        >
          <div className="message-info-results">{refSelectionContent}</div>
        </div>
        <input
          type="text"
          value={text}
          placeholder="Sent a message..."
          onChange={handleTextChanged}
          onKeyDown={handleKeyPressed}
        />
        <img src={IconSent} onClick={handleSentPressed} />
      </div>
    </div>
  );
}

export default Chat;
