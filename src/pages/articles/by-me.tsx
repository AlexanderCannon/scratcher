import { api } from "../../utils/api";
import Image from "next/image";
import Link from "~/components/Link";
import Layout from "~/components/Layout";
import NotFound from "~/components/NotFound";
import Loading from "~/components/Loading";
import { Article } from "@prisma/client";
import { List, ListItem } from "~/components/List";
import Typography from "~/components/Typography";
import ArticleList from "~/components/ArticleList";

const ContributorPage = () => {
  const { data, isLoading } = api.user.get.useQuery();

  if (!data) {
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }
  const { articles, ...user } = data;

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Image
            className="rounded-full"
            src={user.image ?? "/images/png/placeholder-user.png"}
            alt={user.name ?? "placeholder"}
            width={100}
            height={100}
          />
          <Typography as="h1" variant="heading" className="mb-8">
            My Articles
          </Typography>
          <List>
            {articles.length > 0 ? (
              <ArticleList articles={articles} />
            ) : (
              <ListItem>
                <Typography as="p" variant="body">
                  You haven't written any articles yet.
                </Typography>
              </ListItem>
            )}
          </List>
        </>
      )}
    </Layout>
  );
};

export default ContributorPage;
