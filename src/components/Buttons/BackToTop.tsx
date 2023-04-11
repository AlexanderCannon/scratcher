import { useEffect, useState } from "react";
import Button from "./Button";
import { BiArrowToTop } from "react-icons/bi";

export default function BackToTop() {
  const [myWindow, setMyWindow] = useState<Window>();
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMyWindow(window);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.pageYOffset > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return showSticky ? (
    <div className="sticky bottom-8 right-6 self-end">
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
