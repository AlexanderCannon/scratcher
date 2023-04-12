import Link from "~/components/Link";
import Typography from "~/components/Typography";

export default function Footer() {
  return (
    <footer className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center py-6">
          <div className="px-5 py-2">
            <Link href="about" className="text-gray-400 hover:text-blue-500">
              About
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/contact" className="text-gray-400 hover:text-blue-500">
              Contact
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              href="/privacy-policy"
              className="text-gray-400 hover:text-blue-500"
            >
              Privacy Policy
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              href="/terms-of-service"
              className="text-gray-400 hover:text-blue-500"
            >
              Terms of Service
            </Link>
          </div>
        </nav>
        <Typography variant="body" className="text-center text-gray-400">
          Copyright &copy; 2023
          <Link
            href="/"
            className="ml-1 text-blue-500 hover:text-blue-300"
            padding="py-6"
          >
            Scratcher
          </Link>
        </Typography>
      </div>
    </footer>
  );
}
