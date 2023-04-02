import { useRouter } from "next/router";
import { api } from "../../utils/api";
import Image from "next/image";
import Link from "next/link";
import Layout from "~/components/Layout";
import NotFound from "~/components/NotFound";
import Loading from "~/components/Loading";
import { Post } from "@prisma/client";
import { List, ListItem } from "~/components/List";
import Typography from "~/components/Typography";

const ContributorPage = () => {
  const { query } = useRouter();

  if (!query.slug) {
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }
  const id =
    typeof query.slug === "string" ? query.slug : query.slug.join(", ");
  const { data, isLoading } = api.user.getBySlug.useQuery(id);

  if (!data) {
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }
  const { posts, ...user } = data;
  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Image
            src={user.image ?? "https://api.lorem.space/image/face?w=50&h=50"}
            alt={user.name ?? ""}
            width={100}
            height={100}
          />
          <Typography as="h1" variant="heading">
            {data.name}
          </Typography>
          <List>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */}
            {posts.map((post: Post) => (
              <ListItem key={post.id}>
                <Link href={`/posts/${post.slug}`}>
                  <Typography
                    as="h2"
                    variant="subheading"
                    className="ml-3 cursor-pointer font-medium text-gray-400 hover:text-gray-500"
                  >
                    {post.title}
                  </Typography>
                </Link>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Layout>
  );
};

export default ContributorPage;
