import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Loading from "~/components/Loading";

export default function FollowingPage() {
  const session = useSession();
  const { data: following } = api.follows.getMyFollowers.useQuery();
  if (!session || !following)
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold">Your Followers</h1>
        {following?.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {following?.map(({ follower: user }) => (
              <li key={user.id} className="py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Image
                      height={10}
                      width={10}
                      className="h-10 w-10 rounded-full"
                      src={user.image ?? "/images/png/placeholder-user.png"}
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <a
                      href={`/users/${user.slug}`}
                      className="font-medium text-gray-900"
                    >
                      {user.name}
                    </a>
                    <p className="text-gray-500">{user.username}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nobody is following you yet.</p>
        )}
      </div>
    </Layout>
  );
}
