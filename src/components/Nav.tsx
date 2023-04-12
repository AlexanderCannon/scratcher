import Image, { type StaticImageData } from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "~/components/Link";
import Logo from "../../public/images/svg/logo-no-background.svg";
import Typography from "./Typography";
import Button from "./Buttons/Button";
import BackOnePage from "./Buttons/BackOnePage";

const logo = Logo as StaticImageData;

export default function Nav() {
  const { data: sessionData } = useSession();

  // const { data: account } = api.account.getById.useQuery(
  //   sessionData?.user.id ?? "",
  //   {
  //     enabled: sessionData?.user !== undefined,
  //   }
  // );

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between align-middle">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/" className="rounded">
                  <Image
                    className="h-10 w-10 rounded-full lg:hidden"
                    src={sessionData?.user.image ?? logo}
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
              <Button
                variant="text"
                onClick={
                  sessionData ? () => void signOut() : () => void signIn()
                }
              >
                {sessionData ? "Sign out" : "Sign in"}
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <div className="fixed left-6 top-20 z-50">
        <BackOnePage />
      </div>
    </>
  );
}
