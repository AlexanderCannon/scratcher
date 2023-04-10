import Link from "next/link";
import Typography from "~/components/Typography";

export default function Footer() {
  return (
    <footer className="mx-10 bg-white py-4">
      <div className="container mx-auto px-4">
        <Typography variant="body" className="text-center text-gray-400">
          Copyright &copy; 2023
          <Link href="/" className="ml-1 text-blue-500 hover:text-blue-300">
            Scratcher
          </Link>
        </Typography>
      </div>
    </footer>
  );
}
