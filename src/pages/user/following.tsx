import { useSession } from "next-auth/react";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import NotFound from "~/components/NotFound";
import Typography from "~/components/Typography";
import Loading from "~/components/Loading";
import Card from "~/components/Card";
import ContributorProfile from "~/components/ContributorProfile";

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
      <div className="px-4 py-8">
        <Typography as="h1" variant="heading">
          Following ({following?.length})
        </Typography>
        {following?.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {following?.map(({ following: user }) => (
              <li key={user.id} className="py-4">
                <ContributorProfile user={user} />
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
