import classNames from "classnames";
import { Button, Tooltip, TooltipTrigger } from "react-aria-components";
import "./Progress.css";

const Progress = ({ steps }) => {
  return (
    <div className="progress-container">
      {steps.map((step) => {
        const className = classNames("progress-step", {
          active: step.active,
        });
        return (
          <TooltipTrigger delay={500} closeDelay={500} trigger="hover">
            <Button className={className}>{step.name}</Button>
            <Tooltip>{step.info}</Tooltip>
          </TooltipTrigger>
        );
      })}
    </div>
  );
};

export default Progress;
