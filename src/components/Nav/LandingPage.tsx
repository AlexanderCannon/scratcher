import { useState, useEffect } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Typography from "../Typography";
import Button from "../Buttons/Button";
import BackOnePage from "../Buttons/BackOnePage";

export default function LandingPageNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const signInOrOut = () => signIn();

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full ${
          scrolled ? "bg-gray-900 shadow" : ""
        }
      `}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between align-middle">
            <div className="flex flex-shrink-0 items-center">
              <Link
                href="/"
                className={`rounded ${!scrolled && "absolute top-2"}`}
              >
                <Image
                  className={`w-auto transition-all ${
                    scrolled ? "h-12" : "h-32"
                  }`}
                  src="/images/svg/logo-no-background.svg"
                  width={40}
                  height={40}
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button
                variant="text"
                onClick={signInOrOut}
                className={`${!scrolled && "text-gray-600"}`}
              >
                Sign in
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
