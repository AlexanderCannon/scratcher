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
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="col-span-2 mt-8 grid w-full gap-6">
            <Card>
              <Feed />
            </Card>
          </div>
          <div className="col-span-1 mt-8 grid gap-6">
            <div className="grid max-h-32 gap-6">
              <Card>
                <div className="items-left flex flex-col flex-wrap justify-between">
                  <Link padding="p-0" href="user/settings">
                    <h2 className="mb-2 text-xl font-semibold text-gray-800 hover:text-blue-500">
                      Account Details
                    </h2>
                  </Link>
                  <p className="text-gray-600">
                    Name: {user?.name}
                    <br />
                    Email: {user?.email}
                  </p>
                  <Link padding="px-0 py-4" href="user/following">
                    Following
                  </Link>
                  <Link padding="px-0 py-4" href="user/settings">
                    Edit Profile
                  </Link>
                </div>
              </Card>
              {contributorControls && (
                <Link href="/articles/new" padding="p-0">
                  <p className="m-0 flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-100">
                    <BiPlus />
                    <span className="ml-4 flex-1">Create a new article</span>
                  </p>
                </Link>
              )}
              <Link href={"/articles"} padding="p-0">
                <p className="m-0 flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-100">
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
