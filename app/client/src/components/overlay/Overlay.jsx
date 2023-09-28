import classNames from "classnames";
import "./Overlay.css";
import { useEffect, useRef } from "react";
import CustomButton from "../input/button/CustomButton";

const Overlay = ({
  contents,
  isOpen,
  showCloseButton = false,
  onClose,
  className,
}) => {
  const hasRendered = useRef(false);

  useEffect(() => {
    if (!hasRendered.current && isOpen) {
      hasRendered.current = true;
    }
  }, [isOpen]);

  return (
    <div
      className={classNames("overlay", className, {
        open: isOpen,
      })}
    >
      <div
        className={classNames("overlay-background", {
          open: isOpen,
          closed: !isOpen && hasRendered.current,
        })}
        onClick={() => onClose()}
      />
      <div
        className={classNames("overlay-container", {
          open: isOpen,
          closed: !isOpen && hasRendered.current,
        })}
      >
        {contents}
        {showCloseButton && (
          <CustomButton
            onPress={() => onClose()}
            type="secondary"
            style="squared"
            content={"Close"}
          />
        )}
      </div>
    </div>
  );
};

export default Overlay;
