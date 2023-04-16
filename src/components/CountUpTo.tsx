import { useState, useEffect } from "react";
import { debounce } from "~/utils/debounce";

interface CounterProps {
  end: number;
  duration: number;
  delay?: number;
  before?: string;
  after?: string;
}

export default function Counter({
  end,
  duration,
  before,
  after,
  delay,
}: CounterProps) {
  const [count, setCount] = useState("0");
  const step = end / (duration / 1000);
  const padding = end.toString().length;
  useEffect(() => {
    let animationFrameId: number;
    let timeoutId: number;

    const start = Date.now();
    const animate = () => {
      const now = Date.now();
      const timeElapsed = now - start;

      if (Number(count) < end) {
        setCount(
          Math.min(Math.round(step * timeElapsed), end)
            .toString()
            .padStart(padding, "0")
        );
        animationFrameId = requestAnimationFrame(debouncedAnimate);
      }
    };
    const debouncedAnimate = debounce(animate, 1000 / 60);

    timeoutId = window.setTimeout(() => {
      animationFrameId = requestAnimationFrame(debouncedAnimate);
    }, delay);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, [count, end, step, duration, delay]);
  return (
    <>
      {before && before + " "}
      {count}
      {after && " " + after}
    </>
  );
}
