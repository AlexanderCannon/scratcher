import Link from "~/components/Link";
import Typography from "./Typography";
export default function LandingPage() {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <Typography as="h1" variant="heading">
        Welcome to Scratcher
      </Typography>
      <Link href={"/posts"}>
        <Typography variant="subheading">
          Read articles by our contributors
        </Typography>
      </Link>
      <Link href={"/contributors"}>
        <Typography variant="subheading">
          Learn more about our contributors
        </Typography>
      </Link>
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center justify-center gap-4"></div>
      </div>
    </div>
  );
}
