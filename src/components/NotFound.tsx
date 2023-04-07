import Link from "~/components/Link";
import Typography from "~/components/Typography";

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Typography as="h1" variant="heading" className="mb-4 text-4xl font-bold">
        404 - Page Not Found
      </Typography>
      <Typography as="p" className="text-gray-500">
        The page you are looking for does not exist.
      </Typography>
      <Link href="/">
        <Typography className="mt-4 text-blue-500 hover:text-blue-700">
          Go back to the homepage
        </Typography>
      </Link>
    </div>
  );
};

export default NotFound;
