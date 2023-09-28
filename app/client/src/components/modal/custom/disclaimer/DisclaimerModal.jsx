import { useContext } from "react";
import Modal from "../../Modal.jsx";
import "./Style.css";
import { AlertContext } from "../../../../contexts/AlertContext.jsx";

function DisclaimerModal({ isOpen, onClose }) {
  const { addAlert } = useContext(AlertContext);

  return (
    <Modal
      isOpen={isOpen}
      title={"Disclaimers"}
      content={
        <div className="disclaimer-content">
          <p>
            As this is a prototype, please don't enter any sensitive/personal
            data.
          </p>
        </div>
      }
      options={[
        {
          value: "OK",
          onAction: () => onClose(),
        },
      ]}
      onClose={() => onClose()}
    />
  );
}

export default DisclaimerModal;
