import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "~/components/Link";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import Loading from "~/components/Loading";
import PaginationButtons from "~/components/PaginationButtons";
import { List, ListItem } from "~/components/List";
import Typography from "~/components/Typography";
import NotFound from "~/components/NotFound";

export default function ArticlePage() {
  const router = useRouter();
  const [page, setPage] = useState(Number(router.query.page ?? 0));
  const { data, fetchNextPage, isLoading, isFetchingNextPage } =
    api.articles.getBatch.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  useEffect(() => {
    if (page === 0) {
      void router.push("/articles");
    } else {
      void router.push(`/articles?page=${page}`);
    }
  }, [page]);

  const handleFetchNextPage = () => {
    fetchNextPage()
      .then(() => {
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleFetchPreviousPage = () => {
    if (page === 0) return;
    setPage((prev) => prev - 1);
  };

  const currentPage = data?.pages[page]?.items;
  const nextCursor = data?.pages[page]?.nextCursor;
  if (!currentPage)
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  return (
    <Layout>
      <Typography as="h1" variant="heading">
        Articles
      </Typography>
      <List>
        {isLoading || isFetchingNextPage ? (
          <Loading />
        ) : (
          currentPage.map((article) => (
            <Link href={`/articles/${article.slug}`} key={article.id}>
              <ListItem>
                <div className="w-2/3">
                  <Typography
                    as="h2"
                    variant="subheading"
                    className="ml-3 cursor-pointer font-medium text-gray-400 hover:text-gray-500"
                  >
                    {article.title}
                  </Typography>
                </div>
              </ListItem>
            </Link>
          ))
        )}
      </List>
      <PaginationButtons
        page={page}
        nextCursor={nextCursor}
        handleFetchNextPage={handleFetchNextPage}
        handleFetchPreviousPage={handleFetchPreviousPage}
      />
    </Layout>
  );
}