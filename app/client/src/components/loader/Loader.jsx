import { ProgressBar } from "react-aria-components";
import "./Style.css";
import { useEffect, useState } from "react";

const Loader = ({ className = "" }) => {
  const [fill, setFill] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(true);

  let center = 16;
  let strokeWidth = 4;
  let r = 16 - strokeWidth;
  let c = 2 * r * Math.PI;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFill((prevFill) => {
        if (prevFill >= 100) {
          setIsIncreasing((prevValue) => !prevValue);
          return 0;
        } else {
          return prevFill + 1;
        }
      });
    }, 8);

    return () => {
      clearInterval(intervalId);
    };
  }, [isIncreasing]);

  const circleColor = isIncreasing
    ? "var(--custom-pink)"
    : "var(--custom-grey-medium)";
  const backgroundColor = isIncreasing
    ? "var(--custom-grey-medium)"
    : "var(--custom-pink)";

  return (
    <div className={`${className} loader-container`}>
      <div className="loader-background">
        <ProgressBar aria-label="Loading…" value={fill}>
          {({ percentage }) => (
            <>
              <svg
                width={64}
                height={64}
                viewBox="0 0 32 32"
                fill="none"
                strokeWidth={strokeWidth}
              >
                <circle
                  cx={center}
                  cy={center}
                  fill="var(--custom-white)"
                  r={r - (strokeWidth / 2 - 0.25)}
                  strokeWidth={0.5}
                />
                <circle
                  cx={center}
                  cy={center}
                  fill="var(--custom-white)"
                  r={r + (strokeWidth / 2 - 0.25)}
                  strokeWidth={0.5}
                />
                <circle
                  cx={center}
                  cy={center}
                  r={r}
                  stroke={backgroundColor}
                  strokeDasharray={`${c} ${c}`}
                  strokeDashoffset={c - (100 / 100) * c}
                  strokeLinecap="round"
                  transform="rotate(-90 16 16)"
                />
                <circle
                  cx={center}
                  cy={center}
                  r={r}
                  stroke={circleColor}
                  strokeDasharray={`${c} ${c}`}
                  strokeDashoffset={c - (percentage / 100) * c}
                  strokeLinecap="round"
                  transform="rotate(-90 16 16)"
                />
              </svg>
            </>
          )}
        </ProgressBar>
      </div>
    </div>
  );
};

export default Loader;
