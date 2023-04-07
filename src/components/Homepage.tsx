import Link from "~/components/Link";
import { signIn, signOut, useSession } from "next-auth/react";
import Typography from "./Typography";
import NotFound from "./NotFound";

export default function HomePage() {
  const { data: sessionData } = useSession();
  if (!sessionData?.user) {
    return <NotFound />;
  }
  const { user } = sessionData;
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-6 py-6">
          <h1 className="mb-6 text-3xl font-semibold text-gray-800">
            Welcome, {user?.name}!
          </h1>
          <div className="mb-6 flex w-1/2 flex-col items-center justify-between sm:flex-row">
            <div className="mb-4 rounded-lg bg-white px-6 py-4 shadow sm:mb-0">
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                Account Details
              </h2>
              <p className="text-gray-600">
                Name: {user?.name}
                <br />
                Email: {user?.email}
              </p>
            </div>
            <Link href="/settings">Edit Profile</Link>
          </div>
          <Link href={"/posts"}>Read articles by our contributors</Link>
          <Link href={"/contributors"}>Learn more about our contributors</Link>
          <div className="rounded-lg bg-white px-6 py-4 shadow">
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              Your Orders
            </h2>
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          </div>
        </main>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        </div>
      </div>
    </>
  );
}
