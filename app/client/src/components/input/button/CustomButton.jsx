import { Button } from "react-aria-components";
import "./CustomButton.css";
import classNames from "classnames";

const CustomButton = ({
  content,
  onPress,
  type = "primary",
  outlined = false,
  style = "rounded",
}) => {
  const className = classNames("button", {
    "button-rounded": style == "rounded",
    "button-squared": style == "squared",
    "button-primary": type == "primary" && outlined == false,
    "button-secondary": type == "secondary" && outlined == false,
    "button-primary-outlined": type == "primary" && outlined == true,
    "button-secondary-outlined": (type = "secondary" && outlined == true),
  });

  const handleClick = () => {
    onClick();
  };
  return (
    <Button onPress={onPress} className={className}>
      {content}
    </Button>
  );
};

export default CustomButton;
