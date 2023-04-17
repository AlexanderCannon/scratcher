import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import LandingPage from "~/components/LandingPage";
import Typography from "~/components/Typography";
import HomePage from "~/components/Homepage";
const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data: account } = api.account.getById.useQuery(
    sessionData?.user.id ?? "",
    {
      enabled: sessionData?.user !== undefined,
    }
  );
  return !sessionData || !sessionData.user ? (
    <LandingPage />
  ) : (
    <Layout>
      <HomePage />
    </Layout>
  );
};

export default Home;
