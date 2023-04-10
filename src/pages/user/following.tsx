import Image from "next/image";
import { useSession } from "next-auth/react";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import NotFound from "~/components/NotFound";
import Typography from "~/components/Typography";
import Loading from "~/components/Loading";
import Link from "~/components/Link";

export default function FollowingPage() {
  const session = useSession();
  const { data: following } = api.follows.getMyFollowing.useQuery();
  if (!session)
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  if (!following)
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Typography as="h1" variant="heading">
          Following
        </Typography>
        {following?.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {following?.map(({ following: user }) => (
              <li key={user.id} className="py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-full"
                      src={user.image ?? "/images/png/placeholder-user.png"}
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <Link
                      href={`/users/${user.slug}`}
                      className="font-medium text-gray-900"
                    >
                      {user.name}
                    </Link>
                    <p className="text-gray-500">{user.username}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Typography>You're not following anyone yet.</Typography>
        )}
      </div>
    </Layout>
  );
}
