import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import Loading from "~/components/Loading";
import { List } from "~/components/List";
import Typography from "~/components/Typography";
import PaginationButtons from "~/components/PaginationButtons";
import ArticleList from "~/components/ArticleList";
import { getFromQuery } from "~/utils/getFromQuery";

export default function ArticlePage() {
  const [page, setPage] = useState(0);
  const { query } = useRouter();
  const slug = getFromQuery(query.slug);
  const { data: categoryData } = api.categories.getBySlug.useQuery(slug);
  const { data, fetchNextPage, isLoading } =
    api.articles.getByCategory.useInfiniteQuery(
      {
        categoryId: categoryData?.id,
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const handleFetchNextPage = () => {
    const [page, setPage] = useState(0);
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
      {isLoading || !currentPage ? (
        <Loading />
      ) : (
        <>
          <Typography as="h1" variant="heading" className="mb-10">
            Articles in {categoryData?.name}
          </Typography>
          <List>
            <ArticleList articles={currentPage} />
          </List>
        </>
      )}
      <PaginationButtons
        page={page}
        nextCursor={nextCursor}
        handleFetchNextPage={handleFetchNextPage}
        handleFetchPreviousPage={handleFetchPreviousPage}
      />
    </Layout>
  );
}
