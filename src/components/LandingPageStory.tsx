import { useState, type MutableRefObject, useEffect } from "react";
import Typography from "./Typography";
import useElementOnScreen from "~/hooks/useElementOnScreen";

interface StoryItemProps {
  animate: boolean;
  children: React.ReactNode;
}

interface StoryItemPairProps {
  children: React.ReactNode;
  setVisible: (visible: boolean) => void;
}

function RightItem({ animate, children }: StoryItemProps) {
  return (
    <div
      className={`transition duration-1000 ${
        animate
          ? "translate-x-0 opacity-100 blur-none"
          : "translate-x-20 opacity-50 blur-none"
      }  motion-reduce:transition-none motion-reduce:hover:transform-none`}
    >
      {children}
    </div>
  );
}

function LeftItem({ animate, children }: StoryItemProps) {
  return (
    <div
      className={`transition duration-1000 ${
        animate
          ? "translate-x-0 opacity-100 blur-none"
          : "-translate-x-20 opacity-50 blur-none"
      }  motion-reduce:transition-none motion-reduce:hover:transform-none`}
    >
      {children}
    </div>
  );
}

function StoryItemPair({ children, setVisible }: StoryItemPairProps) {
  const [ref, isOnScreen] = useElementOnScreen(true);
  useEffect(() => {
    setVisible(isOnScreen);
  }, [isOnScreen]);
  return (
    <div
      ref={ref}
      className="grid w-full grid-cols-2 items-center justify-center"
    >
      {children}
    </div>
  );
}
export default function LandingPageStory() {
  const [firstItemVisible, setFirstItemVisible] = useState(false);
  const [secondItemVisible, setSecondItemVisible] = useState(false);
  const [thirdItemVisible, setThirdItemVisible] = useState(false);
  const [fourthItemVisible, setFourthItemVisible] = useState(false);

  return (
    <section className="grid w-full grid-cols-1 items-center justify-center gap-6 md:gap-12">
      <StoryItemPair setVisible={setFirstItemVisible}>
        <LeftItem animate={firstItemVisible}>
          <Typography
            as="h2"
            variant="subheading"
            className={`w-full text-center font-bold`}
          >
            Unlock your potential
          </Typography>
          <Typography className="text-center">
            Find new ways to monetize your content and connect with your
            audience. Scratcher is the best way to share your stories, articles,
            and posts.
          </Typography>
        </LeftItem>
        <RightItem animate={firstItemVisible}>
          <img
            src="/images/svg/unlock.svg"
            alt="unlocking potential"
            className="m-auto h-80 w-2/3"
          />
        </RightItem>
      </StoryItemPair>
      <StoryItemPair setVisible={setSecondItemVisible}>
        <LeftItem animate={secondItemVisible}>
          <img
            src="/images/svg/holding-phone-color.svg"
            alt="phone talking"
            className="m-auto h-80 w-2/3"
          />
        </LeftItem>
        <RightItem animate={secondItemVisible}>
          <Typography
            as="h2"
            variant="subheading"
            className="w-full text-center text-4xl font-bold"
          >
            Wherever you need
          </Typography>
          <Typography className="text-center">
            Our platform is designed to be used on the go. So you can read
            articles, sell, or write wherever you are. Scratcher allows you to
            control your content wherever you are.
          </Typography>
        </RightItem>
      </StoryItemPair>
      <StoryItemPair setVisible={setThirdItemVisible}>
        <LeftItem animate={thirdItemVisible}>
          <Typography
            as="h2"
            variant="subheading"
            className="w-full text-center text-4xl font-bold"
          >
            Find your own way
          </Typography>
          <Typography className="text-center">
            We believe that everyone has their own unique path to success, and
            we want to help you find yours. Join our community today and start
            learning from others.
          </Typography>
        </LeftItem>
        <RightItem animate={thirdItemVisible}>
          <img
            src="/images/svg/directions.svg"
            alt="navigating"
            className="m-auto h-80 w-2/3"
          />
        </RightItem>
      </StoryItemPair>
      <StoryItemPair setVisible={setFourthItemVisible}>
        <LeftItem animate={fourthItemVisible}>
          <img
            src="/images/svg/support-notes-color.svg"
            alt="phone talking"
            className="m-auto h-80  w-2/3"
          />
        </LeftItem>
        <RightItem animate={fourthItemVisible}>
          <Typography
            as="h2"
            variant="subheading"
            className="w-full text-center text-4xl font-bold"
          >
            Own your content
          </Typography>
          <Typography className="text-center">
            Your content is your voice, and we believe that you should be able
            to control it. Join the Scratcher revolution today and start
            unlocking your potential.
          </Typography>
        </RightItem>
      </StoryItemPair>
    </section>
  );
}
