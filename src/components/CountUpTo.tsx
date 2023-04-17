import { useCountUp } from "use-count-up";
import useElementOnScreen from "~/hooks/useElementOnScreen";

import { useState, useEffect } from "react";
interface CounterProps {
  targetNumber: number;
  duration: number;
  delay?: number;
  before?: string;
  after?: string;
  initialNumber?: number;
}

export default function Counter({
  targetNumber,
  duration,
  before,
  after,
  delay = 0,
}: CounterProps) {
  const [ref, isOnScreen] = useElementOnScreen(true);
  const [isCounting, setIsCounting] = useState(false);
  useEffect(() => {
    if (isOnScreen) {
      setTimeout(() => {
        setIsCounting(true);
      }, delay * 1000);
    }
  }, [isOnScreen]);

  const padTo = targetNumber.toString().length;
  const { value } = useCountUp({
    isCounting,
    end: targetNumber,
    duration,
    easing: "easeOutCubic",
  });
  return (
    <pre className="mb-8 text-xl font-bold  md:text-2xl" ref={ref}>
      {before && before + " "}
      {value?.toString().padStart(padTo, "0")}
      {after && " " + after}
    </pre>
  );
}
