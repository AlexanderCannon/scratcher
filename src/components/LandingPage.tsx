import Link from "~/components/Link";
import { signIn } from "next-auth/react";
import Button from "./Buttons/Button";
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-500 py-10">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <h1 className="mb-4 text-center text-4xl font-bold text-white md:text-6xl">
            Welcome to the Blockchain Revolution
          </h1>
          <p className="mb-8 text-center text-lg text-white md:text-2xl">
            Blockchain is changing the the way creators can control their
            content, it's time to join the movement.
          </p>
          <Button variant="secondary" onClick={void signIn}>
            Get Started
          </Button>
        </div>
      </div>
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center">
            <h2 className="mb-4 text-2xl font-bold text-blue-500 md:text-4xl">
              Articles, decentralized
            </h2>
            <p className="mb-8 text-center text-lg text-gray-600 md:text-xl">
              Scratcher provides a new way for writers to monetize their work
              with a permanent record of their writing on the blockchain, while
              offering readers a more engaging and personalized experience.
            </p>
            <Link href={"/articles"} padding="p-0">
              <Button>Learn More</Button>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="mb-4 text-2xl font-bold text-blue-500 md:text-4xl">
              See who has taken control
            </h2>
            <p className="mb-8 text-center text-lg text-gray-600 md:text-xl">
              Our platform features a diverse range of talented contributors
              from around the world, providing unique perspectives and insights
              on the latest trends and topics across various industries.
            </p>
            <Link href={"/contributors"} padding="p-0">
              <Button>Learn More</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white py-16">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center text-4xl font-bold text-blue-500 md:text-6xl">
            Join the Scratcher Revolution Today
          </h2>
          <p className="mb-8 text-center text-lg text-gray-600 md:text-2xl">
            Sign up for our newsletter to stay up-to-date on the latest
            blockchain news and events.
          </p>
          <form className="flex flex-col items-center justify-center">
            <div className="mb-4 w-full md:w-1/2">
              <label
                className="mb-2 block font-bold text-gray-700"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border border-gray-400 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
                id="email"
                type="email"
                placeholder="you@example.com"
              />
            </div>
            <button
              className="hover:bg rounded-full bg-blue-500 px-6 py-3 font-bold uppercase tracking-wider text-white shadow-lg"
              type="submit"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
