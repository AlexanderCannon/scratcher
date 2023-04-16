import { useState, useEffect } from "react";

interface CounterProps {
  end: number;
  duration: number;
}

export default function Counter({ end, duration }: CounterProps) {
  const [count, setCount] = useState(0);
  const step = end / (duration / 1000);

  useEffect(() => {
    let animationFrameId: number;
    const start = Date.now();
    const animate = () => {
      const now = Date.now();
      const timeElapsed = now - start;

      if (count < end) {
        setCount(Math.min(Math.round(step * timeElapsed), end));
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, end, step, duration]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-9xl font-bold">{count}</div>
    </div>
  );
}
