import { useRouter } from "next/router";
import Link from "~/components/Link";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import Loading from "~/components/Loading";
import NotFound from "~/components/NotFound";
import Article from "~/components/Article";

export default function ArticlePage() {
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
  const { data, isLoading } = api.articles.getBySlugContributor.useQuery(slug);
  if (isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }
  if (!data) {
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }
  return (
    <Layout>
      <Article
        id={data.id}
        image={data.image || undefined}
        title={data.title}
        content={data.content}
        author={data.author}
        categories={data.categories}
        date={data.updatedAt || data.createdAt}
      />
    </Layout>
  );
}
