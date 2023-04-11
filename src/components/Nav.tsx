import Image, { type StaticImageData } from "next/image";
import Link from "~/components/Link";
import Logo from "../../public/images/svg/logo-no-background.svg";
import Typography from "./Typography";
import Button from "./Button";
import { SignInButton, SignOutButton, useUser, SignIn } from "@clerk/nextjs";

const logo = Logo as StaticImageData;

export default function Nav() {
  const { user, isSignedIn } = useUser();

  // const { data: account } = api.account.getById.useQuery(
  //   sessionData?.user.id ?? "",
  //   {
  //     enabled: sessionData?.user !== undefined,
  //   }
  // );

  return (
    <nav className="fixed top-0 z-50 mb-6 w-full bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between align-middle">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="rounded">
                <Image
                  className="h-10 w-10 rounded-full lg:hidden"
                  src={user?.profileImageUrl ?? logo}
                  width={40}
                  height={40}
                  alt="Logo"
                />
                <Image
                  className="hidden h-12 w-auto lg:block"
                  src={logo}
                  alt="Logo"
                />
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/about">About</Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <span className="rounded rounded bg-transparent px-4 py-2 text-base font-semibold text-gray-800 hover:bg-gray-100 focus:shadow focus:outline-none">
              {isSignedIn ? <SignOutButton /> : <SignInButton />}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
