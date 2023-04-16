import { useEffect, useState } from "react";
import Button from "./Button";
import { BiArrowToTop } from "react-icons/bi";

export default function BackToTop() {
  const [myWindow, setMyWindow] = useState<Window>();
  const [showSticky, setShowSticky] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMyWindow(window);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.pageYOffset > 0);
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.pageYOffset;
      if (windowHeight + scrollPosition >= fullHeight) {
        setAtFooter(true);
      }
      if (windowHeight + scrollPosition < fullHeight) {
        setAtFooter(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return showSticky ? (
    <div
      className={`sticky bottom-8 right-6 mt-6 self-end ${
        atFooter ? "motion-safe:animate-bounce" : ""
      }`}
    >
      <Button
        type="button"
        aria-label="Back to top"
        onClick={() =>
          myWindow?.scrollTo({ top: 0, left: 0, behavior: "smooth" })
        }
      >
        <BiArrowToTop />
      </Button>
    </div>
  ) : (
    <div className="hidden" />
  );
}
