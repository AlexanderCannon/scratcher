import { api } from "../../utils/api";
import Image from "next/image";
import Link from "~/components/Link";
import Layout from "~/components/Layout";
import NotFound from "~/components/NotFound";
import Loading from "~/components/Loading";
import { Article } from "@prisma/client";
import { List, ListItem } from "~/components/List";
import Typography from "~/components/Typography";
import placeholderUser from "../../public/images/png/placeholder-user.png";

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
            src={user.image ?? placeholderUser}
            alt={user.name ?? "placeholder"}
            width={100}
            height={100}
          />
          <Typography as="h1" variant="heading">
            My Articles
          </Typography>
          <List>
            {articles.map((article: Article) => (
              <ListItem key={article.id}>
                <Link href={`/articles/${article.slug}`}>
                  {/* <Typography
                    as="h2"
                    variant="subheading"
                    className="ml-3 cursor-pointer font-medium text-gray-400 hover:text-gray-500"
                  > */}
                  {article.title}
                  {/* </Typography> */}
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
