import { useSession } from "next-auth/react";
import { BiPlus, BiListUl, BiMaleFemale, BiBookOpen } from "react-icons/bi";
import Card from "~/components/Card";
import Link from "~/components/Link";
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
      <div className="w-full flex-grow">
        <h1 className="mb-6 text-3xl font-semibold text-white">
          Welcome, {user?.name}!
        </h1>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="col-span-2 mt-8 grid w-full gap-6">
            <Feed />
          </div>
          <div className="col-span-1 mt-8 grid gap-6">
            <div className="grid max-h-32 gap-6">
              <Card>
                <div className="items-left flex flex-col flex-wrap justify-between">
                  <Link padding="p-0" href="user/settings">
                    <h2 className="mb-2 text-xl font-semibold text-gray-300 hover:text-blue-500">
                      Account Details
                    </h2>
                  </Link>
                  <p className="capitalize text-gray-200">
                    Name: {user?.name}
                    <br />
                    Role: {user?.role.toLocaleLowerCase()}
                  </p>
                  <Link padding="px-0 py-4" href="user/following">
                    Following ({user?.followingCount}) Followers (
                    {user?.followerCount})
                  </Link>
                  <Link padding="px-0 py-4" href="user/settings">
                    Edit Profile
                  </Link>
                </div>
              </Card>
              {contributorControls && (
                <Link href="/articles/new" padding="p-0">
                  <p className="m-0 flex items-center rounded-lg bg-slate-700 p-4 shadow-md hover:bg-gray-100">
                    <BiPlus />
                    <span className="ml-4 flex-1">Create a new article</span>
                  </p>
                </Link>
              )}
              <Link href={"/articles"} padding="p-0">
                <p className="m-0 flex items-center rounded-lg bg-slate-700 p-4 shadow-md hover:bg-gray-100">
                  <BiListUl />
                  <span className="ml-4 flex-1">
                    Read articles by our contributors
                  </span>
                </p>
              </Link>
              <Link href={"/contributors"} padding="p-0">
                <p className="m-0 flex w-full items-center rounded-lg bg-slate-700 p-4 shadow-md hover:bg-gray-100">
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
                  <p className="flex w-full items-center rounded-lg bg-slate-700 p-4 shadow-md hover:bg-gray-100">
                    <BiBookOpen />
                    <span className="ml-4 flex-1">View all of my articles</span>
                  </p>
                </Link>
              )}
              {contributorControls && (
                <Card>
                  <Link
                    href={"/articles/by-me"}
                    className="text-lg font-semibold text-gray-200"
                  >
                    Your recent articles
                  </Link>
                  <div className="flex flex-col">
                    {recentArticles?.length ? (
                      recentArticles.map((article) => (
                        <Link
                          href={`/articles/${article.slug}`}
                          key={article.id}
                        >
                          {article.title}
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-600">
                        "You haven't written any articles yet."
                      </p>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
