import { useEffect, useRef, useState } from "react";
import { debounce } from "~/utils/debounce";

export default function useElementOnScreen(
  once?: boolean,
  animationProps?: IntersectionObserverInit
): [React.MutableRefObject<null>, boolean] {
  const options = animationProps || {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  };
  const ref = useRef<null>(null);
  const [isOnScreen, setIsOnScreen] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      debounce(([entry]) => {
        setIsOnScreen(!!entry?.isIntersecting);
        if (!!once && ref.current && isOnScreen) {
          observer.unobserve(ref.current);
          setIsOnScreen(true);
        }
      }, 100),
      options || {
        root: null,
        rootMargin: "0px",
        threshold: 1,
      }
    );
    observer.observe(ref.current);
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isOnScreen];
}
