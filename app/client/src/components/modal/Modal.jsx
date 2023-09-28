import CustomButton from "../input/button/CustomButton.jsx";
import classNames from "classnames";
import "./Modal.css";
import Header from "../text/Header.jsx";

function Modal({ title, content, isOpen, onClose, options = [] }) {
  return (
    <div className="modal">
      <div
        className={classNames("modal-background", {
          open: isOpen,
          closed: !isOpen,
        })}
        onClick={() => onClose()}
      />
      <div
        className={classNames("modal-container", {
          open: isOpen,
          closed: !isOpen,
        })}
      >
        <div className="modal-header">
          <Header value={title} />
        </div>
        <div className="modal-content">{content}</div>
        <div className="modal-controls">
          {options.map((option) => {
            return (
              <CustomButton
                onPress={() => option.onAction()}
                content={option.value}
                style="squared"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Modal;
