import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import Logo from "../../public/images/svg/logo-black.svg";
import Typography from "./Typography";

const logo = Logo as StaticImageData;

export default function Nav() {
  return (
    <nav className="mb-6 bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/">
                <Image
                  className="block h-24 w-auto lg:hidden"
                  src={logo}
                  alt="Logo"
                />
                <Image
                  className="hidden h-16 w-auto lg:block"
                  src={logo}
                  alt="Logo"
                />
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/about">
              <Typography
                as="p"
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                About
              </Typography>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
