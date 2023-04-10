import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import Loading from "~/components/Loading";
import PaginationButtons from "~/components/PaginationButtons";
import { List } from "~/components/List";
import Typography from "~/components/Typography";
import ArticleList from "~/components/ArticleList";

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
  return (
    <Layout>
      <Typography as="h1" variant="heading" className="mb-10">
        Articles
      </Typography>
      <List>
        {isLoading || isFetchingNextPage || !currentPage ? (
          <Loading />
        ) : (
          <ArticleList articles={currentPage} />
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
