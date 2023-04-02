import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import Loading from "~/components/Loading";
import NotFound from "~/components/NotFound";
import { List, ListItem } from "~/components/List";
import Typography from "~/components/Typography";

export default function PostPage() {
  const { query } = useRouter();

  if (!query.slug) {
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }
  const slug =
    typeof query.slug === "string" ? query.slug : query.slug.join(", ");
  const { data, isLoading } = api.categories.getBySlug.useQuery(slug);
  if (!data) {
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }
  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Typography as="h1" variant="heading">
            Articles in {data.name}
          </Typography>
          <List>
            {data.posts.map((post) => (
              <Link href={`/posts/${post.slug}`} key={post.id}>
                <ListItem>
                  <Typography
                    as="h2"
                    variant="subheading"
                    className="m-0 cursor-pointer font-medium text-gray-400 hover:text-gray-500"
                  >
                    {post.title}
                  </Typography>
                </ListItem>
              </Link>
            ))}
          </List>
        </>
      )}
    </Layout>
  );
}
