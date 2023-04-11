import { type NextPage } from "next";
import Layout from "~/components/Layout";
import LandingPage from "~/components/LandingPage";
import HomePage from "~/components/Homepage";
import { useUser } from "@clerk/nextjs";
const Home: NextPage = () => {
  const { user } = useUser();
  return <Layout>{!user ? <LandingPage /> : <HomePage />}</Layout>;
};

export default Home;
