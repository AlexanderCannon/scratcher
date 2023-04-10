import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import NotFound from "~/components/NotFound";
import placeholderUser from "../../public/images/png/placeholder-user.png";
import Image from "next/image";

export default function FollowingPage() {
  const session = useSession();
  const { data: following } = api.follows.getMyFollowing.useQuery();
  if (!session || !following)
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  console.log("following", following);
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold">Following</h1>
        {following?.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {following?.map(({ following: user }) => (
              <li key={user.id} className="py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-full"
                      src={user.image ?? placeholderUser}
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
          <p>You're not following anyone yet.</p>
        )}
      </div>
    </Layout>
  );
}
