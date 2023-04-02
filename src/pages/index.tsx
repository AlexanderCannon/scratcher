import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";
import Layout from "~/components/Layout";
import Typography from "~/components/Typography";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data: account } = api.account.getById.useQuery(
    sessionData?.user.id ?? "",
    {
      enabled: sessionData?.user !== undefined,
    }
  );
  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <Typography as="h1" variant="heading">
          {sessionData && sessionData.user.name
            ? `Hello ${sessionData.user.name}`
            : `Welcome to Scratcher`}
        </Typography>
        <Link href={"/posts"}>
          <Typography variant="subheading">Check out our blog</Typography>
        </Link>
        <Link href={"/contributors"}>
          <Typography variant="subheading">
            Check out our contributors
          </Typography>
        </Link>
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
      </div>
    </Layout>
  );
};

export default Home;
