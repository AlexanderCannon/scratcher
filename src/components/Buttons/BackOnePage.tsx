import { useRouter } from "next/router";
import { BiArrowBack } from "react-icons/bi";
import Button from "./Button";

function BackOnePage() {
  const router = useRouter();

  return /\/\w+\/\[slug\]/.test(router.pathname) ? (
    <Button variant="primary" type="button" onClick={router.back}>
      <BiArrowBack />
    </Button>
  ) : (
    <>&nbsp;</>
  );
}

BackOnePage.defaultProps = {
  home: false,
};

export default BackOnePage;
