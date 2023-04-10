import Link from "~/components/Link";
import { signIn, signOut, useSession } from "next-auth/react";
import { BiPlus, BiListUl, BiMaleFemale, BiBookOpen } from "react-icons/bi";
import Card from "~/components/Card";
import { api } from "~/utils/api";
import Feed from "~/components/Feed";
import Loading from "./Loading";

export default function HomePage() {
  const { data: sessionData } = useSession();
  const { data: user } = api.user.get.useQuery();
  const { data: recentArticles } = api.articles.getRecent.useQuery();

  if (!sessionData?.user || !user) {
    return <Loading />;
  }
  const contributorControls =
    user.role === "CONTRIBUTOR" || user.role === "EDITOR";
  return (
    <>
      <div className="min-h-screen w-full flex-grow bg-gray-100">
        <h1 className="mb-6 text-3xl font-semibold text-gray-800">
          Welcome, {user?.name}!
        </h1>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="mt-8 grid w-full gap-6">
            <Card>
              <Feed />
            </Card>
          </div>
          <div className="mt-8 grid w-full gap-6">
            <div className="grid max-h-32 gap-6">
              <Card>
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  Account Details
                </h2>
                <div className="mb-6 flex flex-col items-center justify-between sm:flex-row">
                  <p className="text-gray-600">
                    Name: {user?.name}
                    <br />
                    Email: {user?.email}
                  </p>
                  <Link href="user/following">Following</Link>
                  <Link href="user/settings">Edit Profile</Link>
                </div>
              </Card>
              {contributorControls && (
                <Link href="/articles/new" padding="p-0">
                  <p className="m-0 flex w-full items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-100">
                    <BiPlus />
                    <span className="ml-4 flex-1">Create a new article</span>
                  </p>
                </Link>
              )}
              <Link href={"/articles"} padding="p-0">
                <p className="m-0 flex w-full items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-100">
                  <BiListUl />
                  <span className="ml-4 flex-1">
                    Read articles by our contributors
                  </span>
                </p>
              </Link>
              <Link href={"/contributors"} padding="p-0">
                <p className="m-0 flex w-full items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-100">
                  <BiMaleFemale />
                  <span className="ml-4 flex-1">
                    See our{" "}
                    {user.role === "CONTRIBUTOR" || user.role === "EDITOR"
                      ? " other "
                      : ""}{" "}
                    contributors
                  </span>
                </p>
              </Link>
              {contributorControls && (
                <Link href={`/articles/by-me`} padding="p-0">
                  <p className="flex w-full items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-100">
                    <BiBookOpen />
                    <span className="ml-4 flex-1">View all of my articles</span>
                  </p>
                </Link>
              )}
              {contributorControls && (
                <Card>
                  <h2 className="mb-2 text-xl font-semibold text-gray-800">
                    Your most recent articles
                  </h2>
                  <p className="text-gray-600">
                    {" "}
                    {recentArticles?.length
                      ? user.articles.map((article) => (
                          <Link
                            href={`/articles/${article.slug}`}
                            key={article.id}
                          >
                            {article.title}
                          </Link>
                        ))
                      : "You haven't written any articles yet."}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
